import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import App from './App.jsx';
import Home from './Home.jsx';
import ServicePage from './Service.jsx';
import Notfound from './NotFound.jsx';
import Oder from './Oder.jsx';
import Login from './Login.jsx';
import RegisterForm from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { AuthProvider } from './AuthContext';
import AdminDashboard from './Admin/Dashboard.jsx';
import AddService from './Admin/AddService.jsx';
import ServiceManagement from './Admin/ServiceManagement.jsx';
import ServiceDetails from './Admin/ServiceDetails.jsx';
import OrderManagementPage from './Admin/Ordermanagementpage.jsx';
import OrderDetailsPage from './Admin/OrderDetailsPage.jsx';
import UserManagementPage from './Admin/UserManagementPage.jsx';
import UserDetailsPage from './components/UserDetails.jsx';
import UserOrders from './User/UserOders.jsx';
import AdminNoticesPage from './Admin/AdminNoticePage.jsx';
import AdminMessagesPage from './Admin/AdminMessagesPage.jsx';
import UserMessagesPage from './User/UserMessagesPage.jsx';
import DataExportPage from './Admin/DataExportPage.jsx';

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <ProtectedRoute element={<App />} />,
  },
  {
    path: '/',
    element: <Home />,
    errorElement: <Notfound />,
  },
  {
    path: '/service/:id',
    element: <ProtectedRoute element={<ServicePage />} />,
  },
  {
    path: '/Pay/:id',
    element: <ProtectedRoute element={<Oder />} />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/Register',
    element: <RegisterForm />,
  },
  {
    path: '/Dashboard',
    element: <ProtectedRoute element={<AdminDashboard />} />
  },
  {
    path: '/add-service',
    element: <ProtectedRoute element={<AddService />} />
  },
  {
    path: '/manage-services',
    element: <ProtectedRoute element={<ServiceManagement />} />
  },
  {
    path: '/manage-services/:id',
    element: <ProtectedRoute element={<ServiceDetails />} />,
  },
  {
    path: '/manage-orders',
    element: <ProtectedRoute element={<OrderManagementPage />} />
  },
  {
    path: '/manage-orders/:orderId',
    element: <ProtectedRoute element={<OrderDetailsPage />} />
  },
  {
    path: '/manage-users',
    element: <ProtectedRoute element={<UserManagementPage />} />
  },
  {
    path: '/user-details',
    element: <ProtectedRoute element={<UserDetailsPage />} />
  },
  {
    path: '/user-orders',
    element: <ProtectedRoute element={<UserOrders />} />
  },
  {
    path: '/notices',
    element: <ProtectedRoute element={<AdminNoticesPage />} />
  },
  {
    path: '/messages',
    element: <ProtectedRoute element={<AdminMessagesPage />} />
  },
  {
    path: '/user-messages',
    element: <ProtectedRoute element={<UserMessagesPage />} />
  },
  {
    path: '/data-export',
    element: <ProtectedRoute element={<DataExportPage />} />
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={3000} />
    </AuthProvider>
  </React.StrictMode>,
);
