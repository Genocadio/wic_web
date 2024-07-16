import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Getorders from '../services/Getorders';
import { format } from 'date-fns';
import Filter from '../components/Filter';
import AdminNavbar from './AdminNavbar';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('orderDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState(null);
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
        setOrders(ordersData);
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
    setConfirmDeleteOrderId(orderId);
  };

  const handleConfirmDelete = async () => {
    try {
      await Getorders.remove(confirmDeleteOrderId);
      toast.success('Order deleted successfully');
      setOrders(orders.filter(order => order.id !== confirmDeleteOrderId));
    
      setConfirmDeleteOrderId(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      setError(error.message || 'Error deleting order');
      toast.error('Error deleting order');
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOrderId(null);
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

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const serviceStatusOptions = Array.from(new Set(orders.map(order => order.status)));

  if (loading) {
    return (
      <>
        <div className="container mx-auto py-4 px-2 min-h-screen sm:px-6 lg:px-24">
          <div className="overflow-x-auto lg:mx-6">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4"><div className="skeleton h-4 w-full"></div></td>
                    <td className="py-2 px-4">
                      <div className="skeleton h-4 w-1/2"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="container mx-auto py-4 px-2 min-h-screen sm:px-6 lg:px-24">
          <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">Order Management</h1>
          <p>Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-4 px-2 min-h-screen sm:px-6 lg:px-24">
        <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">Order Management</h1>
        <div className="mb-6 flex flex-col lg:flex-row items-center justify-between">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">Sort by:</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li><button className="dropdown-item" onClick={() => handleSortChange('orderDate')}>Order Date</button></li>
              <li><button className="dropdown-item" onClick={() => handleSortChange('serviceName')}>Service Name</button></li>
            </ul>
          </div>

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">Filter by Status:</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li><button className="dropdown-item" onClick={() => handleStatusFilterChange('')}>All</button></li>
              {serviceStatusOptions.map((status, index) => (
                <li key={index}><button className="dropdown-item" onClick={() => handleStatusFilterChange(status)}>{status}</button></li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-3/4 lg:pl-4 flex justify-center">
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
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4">{format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm')}</td>
                  <td className="py-2 px-4">{order.serviceName}</td>
                  <td className="py-2 px-4">{order.user.email}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">{order.totalPrice.toFixed(2)} Rwf</td>
                  <td className="py-2 px-4">
                    <button onClick={() => navigate(`/manage-orders/${order.id}`)} className="btn btn-sm btn-primary mr-2">Edit</button>
                    <button onClick={() => handleDeleteOrder(order.id)} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirmDeleteOrderId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded shadow-lg z-10">
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-end mt-4">
              <button onClick={handleCancelDelete} className="btn btn-sm btn-primary mr-2">Cancel</button>
              <button onClick={handleConfirmDelete} className="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagementPage;
