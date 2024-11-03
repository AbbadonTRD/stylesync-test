import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Package, Employee, Booking, Product, Service } from '@/types';

interface BookingState {
  selectedPackage: Package | null;
  selectedEmployee: Employee | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedProducts: Product[];
  bookings: Booking[];
}

type BookingAction =
  | { type: 'SELECT_PACKAGE'; payload: Package }
  | { type: 'SELECT_EMPLOYEE'; payload: Employee }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SELECT_TIME'; payload: string | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'RESET_BOOKING' }
  | { type: 'CLEAR_CART' };

const initialState: BookingState = {
  selectedPackage: null,
  selectedEmployee: null,
  selectedDate: null,
  selectedTime: null,
  selectedProducts: [],
  bookings: [],
};

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_PACKAGE':
      return {
        ...state,
        selectedPackage: action.payload,
      };
    case 'SELECT_EMPLOYEE':
      return { ...state, selectedEmployee: action.payload };
    case 'SELECT_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SELECT_TIME':
      return { ...state, selectedTime: action.payload };
    case 'ADD_PRODUCT':
      return {
        ...state,
        selectedProducts: [...state.selectedProducts, action.payload],
      };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(p => p.id !== action.payload),
      };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };
    case 'RESET_BOOKING':
      return {
        ...initialState,
        selectedProducts: state.selectedProducts,
        bookings: state.bookings,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        selectedProducts: [],
      };
    default:
      return state;
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}