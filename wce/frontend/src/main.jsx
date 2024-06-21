import React from 'react';
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
