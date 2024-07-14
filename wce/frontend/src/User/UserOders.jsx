import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Getorders from '../services/Getorders';
import UserService from '../services/UserService';
import 'daisyui/dist/full.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const token = loggedInUser.token;
        const userId = loggedInUser.id;

        // Set token in both Getorders and UserService modules
        Getorders.setToken(token);
        UserService.setToken(token);

        const ordersData = await UserService.getById(userId);
        setOrders(ordersData.orders);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Error fetching orders');
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
        await Getorders.update(orderId, { status: 'Cancelled' });// Updated to use cancel method
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Cancelled' } : order));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Error cancelling order:', error);
        // Handle error state or display error message to the user
      }
    }
  };

  if (loading) {
    return (<div className="flex w-52 flex-col gap-4">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>)
  }

  if (error) {
    return (<div className="min-h-screen flex flex-col bg-base-200"><span className="loading loading-dots loading-xs"></span><span className="loading loading-dots loading-sm"></span><span className="loading loading-dots loading-md"></span><span className="loading loading-dots loading-lg"></span></div>)
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-base-200">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 lg:py-16">
          <h1 className="text-4xl font-bold text-center mb-8">My Orders</h1>
          {orders.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex flex-col md:flex-row bg-base-100 shadow-xl p-4 space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col md:w-1/2">
                    <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                    <p className="py-2">Service: {order.serviceName}</p> {/* Assuming serviceName is included in the order */}
                    <p className="py-2">Status: {order.status}</p>
                    <p className="py-2">Date of Placement: {new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col md:w-1/2 justify-end items-end">
                    {order.status !== 'Cancelled' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg">You have no orders.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOrders;
