import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import BookingPage from '@/pages/BookingPage';
import ShopPage from '@/pages/ShopPage';
import AdminDashboard from '@/pages/AdminDashboard';
import ClientManagement from '@/pages/ClientManagement';
import AdminRoute from '@/components/AdminRoute';
import { BookingProvider } from '@/contexts/BookingContext';
import { UserProvider } from '@/contexts/UserContext';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <BookingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/clients" 
                element={
                  <AdminRoute>
                    <ClientManagement />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Layout>
          <Toaster />
        </BookingProvider>
      </UserProvider>
    </Router>
  );
}