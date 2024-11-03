import { Service, Package, Employee, Product, SalonInfo, Booking, Customer } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.meliyah-afroshop.ch/v1';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error.message}`);
  }
}

export const api = {
  // Services
  async getServices(): Promise<Service[]> {
    const response = await fetchApi<Service[]>('/services');
    return response.data;
  },

  async getService(id: string): Promise<Service> {
    const response = await fetchApi<Service>(`/services/${id}`);
    return response.data;
  },

  // Packages
  async getPackages(): Promise<Package[]> {
    const response = await fetchApi<Package[]>('/packages');
    return response.data;
  },

  async getPackage(id: string): Promise<Package> {
    const response = await fetchApi<Package>(`/packages/${id}`);
    return response.data;
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    const response = await fetchApi<Employee[]>('/employees');
    return response.data;
  },

  async getEmployee(id: string): Promise<Employee> {
    const response = await fetchApi<Employee>(`/employees/${id}`);
    return response.data;
  },

  async getEmployeeAvailability(id: string, date: string): Promise<Employee['availability']> {
    const response = await fetchApi<Employee['availability']>(`/employees/${id}/availability?date=${date}`);
    return response.data;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await fetchApi<Product[]>('/products');
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetchApi<Product>(`/products/${id}`);
    return response.data;
  },

  // Bookings
  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const response = await fetchApi<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
    return response.data;
  },

  async getBookings(params?: { 
    startDate?: string; 
    endDate?: string;
    status?: Booking['status'];
  }): Promise<Booking[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetchApi<Booking[]>(`/bookings?${queryParams}`);
    return response.data;
  },

  async getBooking(id: string): Promise<Booking> {
    const response = await fetchApi<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const response = await fetchApi<Booking>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const response = await fetchApi<Customer[]>('/customers');
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await fetchApi<Customer>(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await fetchApi<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
    return response.data;
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const response = await fetchApi<Customer>(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  // Salon Info
  async getSalonInfo(): Promise<SalonInfo> {
    const response = await fetchApi<SalonInfo>('/salon-info');
    return response.data;
  },

  // Analytics
  async getDashboardMetrics(period: 'day' | 'week' | 'month' | 'year'): Promise<{
    bookings: number;
    revenue: number;
    newCustomers: number;
    averageRating: number;
  }> {
    const response = await fetchApi<{
      bookings: number;
      revenue: number;
      newCustomers: number;
      averageRating: number;
    }>(`/analytics/dashboard?period=${period}`);
    return response.data;
  },

  async getRevenueTimeline(
    period: 'day' | 'week' | 'month' | 'year',
    startDate: string,
    endDate: string
  ): Promise<Array<{ date: string; revenue: number }>> {
    const response = await fetchApi<Array<{ date: string; revenue: number }>>(
      `/analytics/revenue?period=${period}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },
};