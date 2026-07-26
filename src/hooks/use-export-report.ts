import { useState, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export const useExportReport = () => {
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().subtract(7, 'days'),
        dayjs(),
    ]);
    const [limit, setLimit] = useState(10);

    const getExportParams = useCallback(() => {
        return {
            fromDate: dateRange[0].format('YYYY-MM-DD'),
            toDate: dateRange[1].format('YYYY-MM-DD'),
            limit,
        };
    }, [dateRange, limit]);

    const resetFilters = useCallback(() => {
        setDateRange([dayjs().subtract(7, 'days'), dayjs()]);
        setLimit(10);
    }, []);

    return {
        dateRange,
        setDateRange,
        limit,
        setLimit,
        getExportParams,
        resetFilters,
    };
};