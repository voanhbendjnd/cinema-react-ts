import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { TableProps } from 'antd';
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  notification,
} from 'antd';
import {
  CalendarOutlined,
  CreditCardOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { ticketService } from '@/services/ticket.service';
import type { CustomerTicket } from '@/types/ticket.types';

const { Text } = Typography;

type TicketFilters = {
  q: string;
  seatType?: string;
  paymentMethod?: string;
  bookingStatus?: string;
  releaseDate: Dayjs | null;
};

const defaultFilters: TicketFilters = {
  q: '',
  seatType: undefined,
  paymentMethod: undefined,
  bookingStatus: undefined,
  releaseDate: null,
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : value;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : value;
};

const formatTimeRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return '-';
  return `${start ?? '-'} - ${end ?? '-'}`;
};

const formatMoney = (value?: number | string | null) => {
  if (value == null) return '-';
  const amount = Number(value);
  if (Number.isNaN(amount)) return '-';
  return `${amount.toLocaleString('vi-VN')} VND`;
};

const getBookingStatusColor = (status?: string | null) => {
  const statusMap: Record<string, string> = {
    SUCCESS: 'green',
    PENDING: 'orange',
    FAILED: 'red',
    CANCELLED: 'default',
  };
  return status ? statusMap[status] ?? 'blue' : 'default';
};

const getSeatTypeColor = (seatType?: string | null) => {
  const seatTypeMap: Record<string, string> = {
    STANDARD: 'blue',
    VIP: 'gold',
    SWEETBOX: 'magenta',
  };
  return seatType ? seatTypeMap[seatType] ?? 'default' : 'default';
};

const getRoomLabel = (ticket: CustomerTicket) => {
  if (ticket.roomName && ticket.roomType) return `${ticket.roomName} (${ticket.roomType})`;
  if (ticket.roomName) return ticket.roomName;
  if (ticket.roomId) return `Room ${ticket.roomId}`;
  return '-';
};

const InfoBlock = ({ label, value }: { label: string; value: ReactNode }) => (
  <Space direction="vertical" size={0}>
    <Text type="secondary" style={{ fontSize: 12 }}>
      {label}
    </Text>
    <Text style={{ color: '#fff' }}>{value}</Text>
  </Space>
);

const TicketManagementPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [filters, setFilters] = useState<TicketFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTickets = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    nextFilters = filters
  ) => {
    try {
      setLoading(true);
      const res = await ticketService.getAdminTickets({
        page: page - 1,
        size: pageSize,
        sort: 'createdDate,desc',
        q: nextFilters.q.trim(),
        seatType: nextFilters.seatType,
        paymentMethod: nextFilters.paymentMethod,
        bookingStatus: nextFilters.bookingStatus,
        releaseDate: nextFilters.releaseDate?.format('YYYY-MM-DD'),
      });

      setTickets(res.data?.result ?? []);
      setPagination({
        current: page,
        pageSize,
        total: res.data?.meta?.total ?? 0,
      });
    } catch (error: any) {
      setTickets([]);
      api.error({
        message: 'Cannot load tickets',
        description: error?.response?.data?.message ?? 'Please try again later.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTickets(1, 10, defaultFilters);
  }, []);

  const handleSearch = () => {
    void fetchTickets(1, pagination.pageSize);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    void fetchTickets(1, pagination.pageSize, defaultFilters);
  };

  const columns: TableProps<CustomerTicket>['columns'] = [
    {
      title: 'Ticket',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (_, ticket) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ color: '#ffd700' }}>
            #{ticket.id}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {ticket.ticketCode ?? '-'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 220,
      render: (_, ticket) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ color: '#fff' }}>
            {ticket.customerName || ticket.customerLogin || 'Guest'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {ticket.customerPhone ?? '-'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            CCCD: {ticket.customerIdentityCard ?? '-'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Movie',
      dataIndex: 'movieTitle',
      key: 'movieTitle',
      width: 240,
      render: (movieTitle) => <Text style={{ color: '#fff' }}>{movieTitle ?? '-'}</Text>,
    },
    {
      title: 'Showtime',
      key: 'showtime',
      width: 180,
      render: (_, ticket) => (
        <InfoBlock
          label={formatDate(ticket.releaseDate)}
          value={formatTimeRange(ticket.startDateTime, ticket.endDateTime)}
        />
      ),
    },
    {
      title: 'Room / Seat',
      key: 'seat',
      width: 170,
      render: (_, ticket) => (
        <Space direction="vertical" size={4}>
          <Text style={{ color: '#fff' }}>{getRoomLabel(ticket)}</Text>
          <Space size={6}>
            <Tag color={getSeatTypeColor(ticket.seatType)}>{ticket.seatType ?? '-'}</Tag>
            <Tag>{ticket.seatPosition ?? '-'}</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Booking',
      key: 'booking',
      width: 180,
      render: (_, ticket) => (
        <Space direction="vertical" size={4}>
          <Text style={{ color: '#fff' }}>{ticket.bookingCode ?? '-'}</Text>
          <Tag color={getBookingStatusColor(ticket.bookingStatus)}>
            {ticket.bookingStatus ?? 'UNKNOWN'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 130,
      render: (paymentMethod) => <Text style={{ color: '#fff' }}>{paymentMethod ?? '-'}</Text>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 130,
      align: 'right',
      render: (price) => (
        <Text strong style={{ color: '#10b981' }}>
          {formatMoney(price as number | string | null)}
        </Text>
      ),
    },
    {
      title: 'Booked At',
      dataIndex: 'bookingAt',
      key: 'bookingAt',
      width: 170,
      render: (bookingAt) => (
        <Text style={{ color: 'rgba(255,255,255,0.78)' }}>
          {formatDateTime(bookingAt as string)}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '40px 20px' }}>
      {contextHolder}
      <div style={{ maxWidth: 1500, margin: '0 auto' }}>
        <div style={{ marginBottom: 30 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 8px 0',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: 1,
            }}
          >
            TICKET MANAGEMENT
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            View, search, and filter all customer tickets.
          </p>
        </div>

        <Card
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Input
              placeholder="Search ticket code, booking code, movie, customer, phone, CCCD, or seat"
              prefix={<SearchOutlined />}
              value={filters.q}
              onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
              onPressEnter={handleSearch}
              allowClear
            />

            <Space wrap size={12}>
              <Select
                allowClear
                placeholder="Seat type"
                value={filters.seatType}
                onChange={(value) => setFilters((prev) => ({ ...prev, seatType: value }))}
                suffixIcon={<TagsOutlined />}
                options={[
                  { value: 'STANDARD', label: 'Standard' },
                  { value: 'VIP', label: 'VIP' },
                  { value: 'SWEETBOX', label: 'Sweet Box' },
                ]}
                style={{ width: 150 }}
              />
              <Select
                allowClear
                placeholder="Payment"
                value={filters.paymentMethod}
                onChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value }))}
                suffixIcon={<CreditCardOutlined />}
                options={[
                  { value: 'VNPAY', label: 'VNPAY' },
                  { value: 'COUNTER', label: 'Counter' },
                  { value: 'EXCHANGE_USING_POINTS', label: 'Use points' },
                ]}
                style={{ width: 170 }}
              />
              <Select
                allowClear
                placeholder="Booking status"
                value={filters.bookingStatus}
                onChange={(value) => setFilters((prev) => ({ ...prev, bookingStatus: value }))}
                suffixIcon={<FilterOutlined />}
                options={[
                  { value: 'SUCCESS', label: 'Success' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'FAILED', label: 'Failed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ]}
                style={{ width: 170 }}
              />
              <DatePicker
                placeholder="Show date"
                value={filters.releaseDate}
                onChange={(value) => setFilters((prev) => ({ ...prev, releaseDate: value }))}
                suffixIcon={<CalendarOutlined />}
                style={{ width: 160 }}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                Search
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Space>
        </Card>

        <Card
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
          }}
        >
          {tickets.length === 0 && !loading ? (
            <Empty description="No tickets found" />
          ) : (
            <Table
              columns={columns}
              dataSource={tickets}
              rowKey="id"
              loading={loading}
              pagination={false}
              scroll={{ x: 1400 }}
            />
          )}

          {pagination.total > 0 && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
                showTotal={(total) => `Total ${total} tickets`}
                onChange={(nextPage, nextPageSize) => {
                  void fetchTickets(nextPage, nextPageSize);
                }}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TicketManagementPage;
