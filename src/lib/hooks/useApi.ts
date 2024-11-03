import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
  deps?: any[];
}

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: options.initialData || null,
    error: null,
    isLoading: true,
    isError: false,
  });

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await apiCall();
      setState({ data, error: null, isLoading: false, isError: false });
      options.onSuccess?.(data);
    } catch (error) {
      setState({
        data: null,
        error,
        isLoading: false,
        isError: true,
      });
      options.onError?.(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, options.deps || []);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Typed hooks for specific API calls
export function useServices() {
  return useApi(() => api.getServices());
}

export function usePackages() {
  return useApi(() => api.getPackages());
}

export function useEmployees() {
  return useApi(() => api.getEmployees());
}

export function useProducts() {
  return useApi(() => api.getProducts());
}

export function useBookings(params?: Parameters<typeof api.getBookings>[0]) {
  return useApi(() => api.getBookings(params), { deps: [JSON.stringify(params)] });
}

export function useCustomers() {
  return useApi(() => api.getCustomers());
}

export function useSalonInfo() {
  return useApi(() => api.getSalonInfo());
}

export function useDashboardMetrics(period: 'day' | 'week' | 'month' | 'year') {
  return useApi(() => api.getDashboardMetrics(period), { deps: [period] });
}

export function useRevenueTimeline(
  period: 'day' | 'week' | 'month' | 'year',
  startDate: string,
  endDate: string
) {
  return useApi(() => api.getRevenueTimeline(period, startDate, endDate), {
    deps: [period, startDate, endDate],
  });
}