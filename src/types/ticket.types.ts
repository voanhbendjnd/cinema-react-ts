export type TicketSeatType = 'STANDARD' | 'VIP' | 'SWEETBOX' | string;

export interface CustomerTicket {
  id: number;
  movieTitle: string;
  bookingAt: string;
  releaseDate: string;
  seatPosition: string;
  seatType: TicketSeatType;
  startDateTime: string;
  endDateTime: string;
  paymentMethod?: string | null;
  createdBy?: string | null;
  ticketCode?: string | null;
  price?: number | null;
  bookingId?: number | null;
  bookingCode?: string | null;
  bookingStatus?: string | null;
  customerId?: number | null;
  customerLogin?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerIdentityCard?: string | null;
  roomId?: number | null;
  roomName?: string | null;
  roomType?: string | null;
}

export interface TicketListQuery {
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminTicketListQuery extends TicketListQuery {
  q?: string;
  seatType?: string;
  paymentMethod?: string;
  bookingStatus?: string;
  releaseDate?: string;
}
