'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    DatePicker,
    Select,
    Button,
    Space,
    Table,
    Empty,
    Spin,
    Row,
    Col,
    Statistic,
    Tag,
    Divider,
    message,
    Progress,
    Alert, Image,
} from 'antd';
import {
    DownloadOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    BarChartOutlined,
    CalendarOutlined,
    FireOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useExportReport } from '@/hooks/use-export-report';
import {
    type OccupancyMovieDetail,
    type OccupancySummary,
    statisticsExportService
} from "@/services/statistics-export.service.ts";
import type {TopMovieProjection} from "@/services/satistics.service.ts";
import {baseURL} from "@/services/axiosClient.ts";
import { getMoviePosterSrc } from '@/utils/moviePoster';

const ExportReportPage: React.FC = () => {
    const [movieData, setMovieData] = useState<OccupancyMovieDetail[]>([]);
    const [summary, setSummary] = useState<OccupancySummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const { dateRange, setDateRange, limit, setLimit, getExportParams, resetFilters } =
        useExportReport();

    // ✅ Fetch preview data
    const fetchPreviewData = async () => {
        try {
            setLoading(true);
            const params = getExportParams();
            const res = await statisticsExportService.getOccupancyData(params);
            setSummary(res.data.summary);
            setMovieData(res.data.details || []);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to load preview data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreviewData();
    }, []);

    const handleDateRangeChange = (dates: any) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
        }
    };

    const handleApplyFilters = () => {
        fetchPreviewData();
    };

    // ✅ Export to Excel
    const handleExport = async () => {
        try {
            setExporting(true);
            const params = getExportParams();
            const blob = await statisticsExportService.exportOccupancyReport(params);

            // Create download link
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ReportStatistic_${dayjs().format('YYYY-MM-DD')}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success('Report exported successfully');
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to export report');
        } finally {
            setExporting(false);
        }
    };

    const columns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (_: any, __: any, index: number) => (
                <Tag
                    color={index === 0 ? 'gold' : index === 1 ? 'silver' : 'cyan'}
                    style={{ fontWeight: 700 }}
                >
                    #{index + 1}
                </Tag>
            ),
        },
        {
            title: 'Movie Poster',
            dataIndex: 'posterUrl',
            key: 'posterUrl',
            width: 100,
            render: (posterUrl: string, record: TopMovieProjection) => (
                <Image
                    src={
                        posterUrl
                            ? getMoviePosterSrc(posterUrl)
                            : '/placeholder.png'
                    }
                    alt={record.movieTitle}
                    width={80}
                    height={120}
                    style={{
                        objectFit: 'cover',
                        borderRadius: 6,
                    }}
                    preview={false}
                />
            )
        },
        {
            title: 'Movie Title',
            dataIndex: 'movieTitle',
            key: 'movieTitle',
            render: (text: string) => (
                <span style={{ fontWeight: 600, color: '#fff' }}>{text}</span>
            ),
        },
        {
            title: 'Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            width: 140,
            align: 'right' as const,
            render: (amount: number) => (
                <span style={{ fontWeight: 700, color: '#10b981', fontSize: 13 }}>
                    {(amount)} VND
                </span>
            ),
        },
        {
            title: 'Tickets Sold',
            dataIndex: 'ticketsSold',
            key: 'ticketsSold',
            width: 130,
            align: 'center' as const,
            render: (count: number) => (
                <span style={{ fontWeight: 600, color: '#e63946' }}>{count}</span>
            ),
        },
        {
            title: 'Showtimes',
            dataIndex: 'totalShowtimes',
            key: 'totalShowtimes',
            width: 110,
            align: 'center' as const,
            render: (count: number) => (
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>{count}</span>
            ),
        },
        {
            title: 'Occupancy Rate',
            dataIndex: 'occupancyRate',
            key: 'occupancyRate',
            width: 140,
            align: 'center' as const,
            render: (rate: number) => (
                <div>
                    <Progress
                        type="circle"
                        percent={Math.round(rate)}
                        width={50}
                        strokeColor={{
                            '0%': '#ef4444',
                            '50%': '#f59e0b',
                            '100%': '#10b981',
                        }}
                        format={(percent) => (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                                {percent}%
                            </span>
                        )}
                    />
                </div>
            ),
        },
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                // background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 100%)',
                padding: '40px 20px',
            }}
        >
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* HEADER */}
                <div style={{ marginBottom: 30 }}>
                    <h1
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#fff',
                            margin: '0 0 8px 0',
                            fontFamily: "'Bebas Neue', sans-serif",
                            letterSpacing: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <FileExcelOutlined style={{ fontSize: 36, color: '#10b981' }} />
                        EXPORT OCCUPANCY REPORT
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        Generate and download detailed occupancy and revenue reports
                    </p>
                </div>

                {/* SUMMARY STATISTICS */}
                {summary && (
                    <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card
                                style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    borderRadius: 12,
                                }}
                            >
                                <Statistic
                                    title="Total Tickets Sold"
                                    value={summary.totalTicketsSold}
                                    valueStyle={{ color: '#10b981', fontSize: 24, fontWeight: 700 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card
                                style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: 12,
                                }}
                            >
                                <Statistic
                                    title="Total Room Seats"
                                    value={summary.totalRoomSeats}
                                    valueStyle={{ color: '#3b82f6', fontSize: 24, fontWeight: 700 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card
                                style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    borderRadius: 12,
                                }}
                            >
                                <Statistic
                                    title="Overall Occupancy Rate"
                                    value={Math.round(summary.overallOccupancyRate)}
                                    suffix="%"
                                    valueStyle={{ color: '#f59e0b', fontSize: 24, fontWeight: 700 }}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* FILTER CARD */}
                <Card
                    style={{
                        background: '#111',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        marginBottom: 24,
                    }}
                >
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
                        {/* DATE RANGE */}
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: 8,
                                    fontSize: 12,
                                    color: 'rgba(255,255,255,0.6)',
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                }}
                            >
                                <CalendarOutlined style={{ marginRight: 6 }} />
                                DATE RANGE
                            </label>
                            <DatePicker.RangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                format="DD/MM/YYYY"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 6,
                                }}
                            />
                        </div>

                        {/* LIMIT */}
                        <div style={{ minWidth: 150 }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: 8,
                                    fontSize: 12,
                                    color: 'rgba(255,255,255,0.6)',
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                }}
                            >
                                <FireOutlined style={{ marginRight: 6 }} />
                                SHOW TOP
                            </label>
                            <Select
                                value={limit}
                                onChange={(value) => setLimit(value)}
                                options={[
                                    { label: 'Top 5', value: 5 },
                                    { label: 'Top 10', value: 10 },
                                    { label: 'Top 15', value: 15 },
                                    { label: 'Top 20', value: 20 },
                                ]}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                }}
                            />
                        </div>

                        {/* ACTION BUTTONS */}
                        <Space>
                            <Button
                                type="primary"
                                onClick={handleApplyFilters}
                                loading={loading}
                                style={{
                                    background: '#3b82f6',
                                    border: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Preview
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    resetFilters();
                                    fetchPreviewData();
                                }}
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#fff',
                                }}
                            >
                                Reset
                            </Button>
                        </Space>
                    </div>

                    {/* ACTIVE FILTERS */}
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        <span>Period: </span>
                        <Tag
                            style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                color: '#3b82f6',
                            }}
                        >
                            {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                        </Tag>
                        <Tag
                            style={{
                                background: 'rgba(230, 57, 70, 0.2)',
                                border: '1px solid rgba(230, 57, 70, 0.3)',
                                color: '#e63946',
                                marginLeft: 8,
                            }}
                        >
                            Top {limit} Movies
                        </Tag>
                    </div>
                </Card>

                {/* EXPORT BUTTON */}
                <Card
                    style={{
                        background: '#111',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 16,
                        }}
                    >
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 4 }}>
                                Ready to Export?
                            </h2>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: 'rgba(255,255,255,0.5)',
                                    margin: 0,
                                }}
                            >
                                Download the report as Excel file with complete data
                            </p>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            loading={exporting}
                            style={{
                                background: '#10b981',
                                border: 'none',
                                fontWeight: 700,
                                minWidth: 180,
                            }}
                        >
                            {exporting ? 'Exporting...' : 'EXPORT TO EXCEL'}
                        </Button>
                    </div>
                </Card>

                {/* DATA PREVIEW TABLE */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BarChartOutlined style={{ fontSize: 18, color: '#3b82f6' }} />
                            <span>Movie Performance Data</span>
                        </div>
                    }
                    style={{
                        background: '#111',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                    }}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <Spin size="large" tip="Loading data..." />
                        </div>
                    ) : movieData.length === 0 ? (
                        <Empty
                            description="No data available for this period"
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                        />
                    ) : (
                        <>
                            <Alert
                                message="Preview Data"
                                description="This table shows the data that will be exported to Excel. You can download the full report using the Export button above."
                                type="info"
                                showIcon
                                style={{
                                    marginBottom: 16,
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    color: '#3b82f6',
                                }}
                            />

                            <Table
                                columns={columns}
                                dataSource={movieData.map((movie, index) => ({
                                    ...movie,
                                    key: movie.movieId,
                                    rank: index + 1,
                                }))}
                                pagination={false}
                                scroll={{ x: 1200 }}
                            />

                            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

                            {/* SUMMARY ROW */}
                            <Row gutter={16}>
                                <Col xs={24} sm={12} lg={6}>
                                    <div
                                        style={{
                                            padding: 12,
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: 6,
                                        }}
                                    >
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                            Total Tickets
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                                            {movieData.reduce((sum, m) => sum + (m.ticketsSold || 0), 0)}
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <div
                                        style={{
                                            padding: 12,
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: 6,
                                        }}
                                    >
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                            Total Revenue
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                                            {(movieData.reduce((sum, m) => sum + (m.totalRevenue || 0), 0) )} VND
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <div
                                        style={{
                                            padding: 12,
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: 6,
                                        }}
                                    >
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                            Total Showtimes
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                                            {movieData.reduce((sum, m) => sum + (m.totalShowtimes || 0), 0)}
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <div
                                        style={{
                                            padding: 12,
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: 6,
                                        }}
                                    >
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                            Avg Occupancy
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                                            {(
                                                movieData.reduce((sum, m) => sum + (m.occupancyRate || 0), 0) /
                                                movieData.length
                                            ).toFixed(1)}
                                            %
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ExportReportPage;