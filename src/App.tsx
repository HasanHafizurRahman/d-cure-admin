import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Settings from './pages/Settings';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        expand={true} 
        richColors 
        theme="light"
        toastOptions={{
          style: {
            fontFamily: 'Inter, Hind Siliguri, sans-serif',
            borderRadius: '16px',
            boxShadow: '0 12px 24px -6px rgba(30, 41, 59, 0.08)',
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
