import axiosClient from '@/services/axiosClient';

export interface OccupancyMovieDetail {
    movieId: number;
    movieTitle: string;
    posterUrl: string;
    totalRevenue: number;
    ticketsSold: number;
    totalShowtimes: number;
    occupancyRate: number;
}

export interface OccupancySummary {
    totalTicketsSold: number;
    totalRoomSeats: number;
    overallOccupancyRate: number;
}

export const statisticsExportService = {
    // Get preview data
    getOccupancyData: (params: {
        fromDate?: string;
        toDate?: string;
        limit?: number;
    }) =>
        axiosClient.get<{
            summary: OccupancySummary;
            details: OccupancyMovieDetail[];
        }>('/admin/statistics/occupancy/preview', { params }),

    // Export to Excel
    exportOccupancyReport: (params: {
        fromDate?: string;
        toDate?: string;
        limit?: number;
    }) =>
        axiosClient.get('/admin/statistics/occupancy/export', {
            params,
            responseType: 'blob',
        }),
};