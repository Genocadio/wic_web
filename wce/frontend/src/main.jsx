import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
    path: '/Pay',
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
    element: <ProtectedRoute element={<ServiceDetails />}/>,
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
  }


]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
