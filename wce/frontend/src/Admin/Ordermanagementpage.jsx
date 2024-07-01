import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Getorders from '../services/Getorders';
import getServices from '../services/getServices';
import { format } from 'date-fns';
import Filter from '../components/Filter';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('orderDate'); // Default sort by order date
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
          throw new Error('loggedInUser is null');
        }

        const token = loggedInUser.token;
        Getorders.setToken(token);
        const ordersData = await Getorders.getAll();

        // Fetch service details for each order
        const ordersWithServiceDetails = await Promise.all(
          ordersData.map(async (order) => {
            const serviceDetails = await getServices.getById(order.service);
            return {
              ...order,
              serviceName: serviceDetails.Name // Assuming serviceDetails has a Name property
            };
          })
        );

        setOrders(ordersWithServiceDetails);
        setLoading(false);
      } catch (error) {
        if (error.message === 'loggedInUser is null' || error.response?.status === 401) {
          navigate('/login');
        } else {
          console.error('Error fetching orders:', error);
          setError(error.message || 'Error fetching orders');
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await Getorders.remove(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError(error.message || 'Error deleting order');
    }
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
    let sortedOrders = [...orders];
    if (criteria === 'orderDate') {
      sortedOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    } else if (criteria === 'serviceName') {
      sortedOrders.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    }
    setOrders(sortedOrders);
  };

  const filteredOrders = orders.filter(order =>
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto py-4 px-2 sm:px-6 lg:px-24">
      <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">Order Management</h1>
      <div className="mb-6 flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
          <label htmlFor="sortCriteria" className="block text-sm font-medium text-gray-700">Sort by:</label>
          <select
            id="sortCriteria"
            className="mt-1 block w-full pl-2 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => handleSortChange(e.target.value)}
            value={sortCriteria}
          >
            <option value="orderDate">Order Date</option>
            <option value="serviceName">Service Name</option>
          </select>
        </div>
        <div className="w-full lg:w-3/4 lg:pl-4">
          <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
      <div className="overflow-x-auto lg:mx-6">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Order Date</th>
              <th className="py-3 px-4 text-left">Service Name</th>
              <th className="py-3 px-4 text-left">User Email</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Total Price</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index} className="even:bg-gray-50">
                <td className="py-2 px-4">{format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm')}</td>
                <td className="py-2 px-4">{order.serviceName}</td>
                <td className="py-2 px-4">{order.user.email}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <button onClick={() => navigate(`/manage-orders/${order.id}`)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementPage;
