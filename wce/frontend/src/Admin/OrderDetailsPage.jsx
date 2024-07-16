import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Getorders from '../services/Getorders';
import { format } from 'date-fns';
import {toast} from 'react-toastify'
import AdminNavbar from './AdminNavbar';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
          throw new Error('loggedInUser is null');
        }

        const token = loggedInUser.token;
        Getorders.setToken(token);

        const orderDetails = await Getorders.getById(orderId);
        setOrder(orderDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        if (error.message === 'loggedInUser is null' || error.response?.status === 401) {
          navigate('/login');
        } else {
          setError(error.message || 'Error fetching order details');
        }
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const updateOrderStatus = async (newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await Getorders.update(order.id, { status: newStatus });
      setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.message || 'Error updating order status');
      }
    }
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <><AdminNavbar /><div className="container mx-auto py-4 px-2 sm:px-6 lg:px-24 min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">Order Details</h1>
      {order && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Order Information</h2>
            <p><strong>Order Date:</strong> {format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm')}</p>
            <p><strong>Service Name:</strong> {order.service.Name}</p>
            <p><strong>notes:</strong> {order.notes || 'Notes not available'}</p>
            <p><strong>Location:</strong> {order.location || 'Not provided'}</p>
            <p><strong>Service Type:</strong> {order.service.Type}</p>
            <p><strong>User Email:</strong> {order.user.email}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total Price:</strong> {order.totalPrice.toFixed(2)}Rwf</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded"
              onClick={() => updateOrderStatus('pending')}
            >
              Set to Pending
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => updateOrderStatus('processing')}
            >
              Set to Processing
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={() => updateOrderStatus('completed')}
            >
              Set to Completed
            </button>
          </div>
        </div>
      )}
    </div></>
  );
};

export default OrderDetailsPage;
