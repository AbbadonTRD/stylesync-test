import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { startOfDay, subDays, startOfWeek, startOfMonth } from 'date-fns';

interface MetricsComparison {
  current: number;
  previous: number;
  percentageChange: number;
}

export function useMetricsComparison(metric: 'bookings' | 'revenue' | 'customers' | 'emailRate', period: 'day' | 'week' | 'month') {
  const [comparison, setComparison] = useState<MetricsComparison>({
    current: 0,
    previous: 0,
    percentageChange: 0
  });

  useEffect(() => {
    const fetchComparison = async () => {
      const now = new Date();
      let currentStart: Date;
      let previousStart: Date;

      switch (period) {
        case 'day':
          currentStart = startOfDay(now);
          previousStart = startOfDay(subDays(now, 1));
          break;
        case 'week':
          currentStart = startOfWeek(now);
          previousStart = startOfWeek(subDays(now, 7));
          break;
        case 'month':
          currentStart = startOfMonth(now);
          previousStart = startOfMonth(subDays(now, 30));
          break;
      }

      try {
        const [currentMetrics, previousMetrics] = await Promise.all([
          api.getDashboardMetrics(period),
          api.getDashboardMetrics(period)
        ]);

        const current = metric === 'bookings' ? currentMetrics.bookings :
                       metric === 'revenue' ? currentMetrics.revenue :
                       metric === 'customers' ? currentMetrics.newCustomers :
                       currentMetrics.averageRating;

        const previous = metric === 'bookings' ? previousMetrics.bookings :
                        metric === 'revenue' ? previousMetrics.revenue :
                        metric === 'customers' ? previousMetrics.newCustomers :
                        previousMetrics.averageRating;

        const percentageChange = previous === 0 ? 0 : ((current - previous) / previous) * 100;

        setComparison({
          current,
          previous,
          percentageChange
        });
      } catch (error) {
        console.error('Error fetching metrics comparison:', error);
      }
    };

    fetchComparison();
  }, [metric, period]);

  return comparison;
}