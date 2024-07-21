import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Getorders from '../services/Getorders';
import { format } from 'date-fns';
import Filter from '../components/Filter';
import AdminNavbar from './AdminNavbar';

const OrderManagementPage = () => {
  const [sortCriteria, setSortCriteria] = useState('orderDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (!loggedInUser) throw new Error('loggedInUser is null');
  
      const token = loggedInUser.token;
      Getorders.setToken(token);
  
      return await Getorders.getAll();
    },
    onError: (error) => {
      if (error.message === 'loggedInUser is null' || error.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching orders:', error);
      }
    }
  });

  const mutation = useMutation({
    mutationFn: (orderId) => Getorders.remove(orderId),
    onSuccess: () => {
      toast.success('Order deleted successfully');
      queryClient.invalidateQueries(['orders']);
      setConfirmDeleteOrderId(null);
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
      toast.error('Error deleting order');
    }
  });

  const handleDeleteOrder = (orderId) => {
    setConfirmDeleteOrderId(orderId);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteOrderId) {
      mutation.mutate(confirmDeleteOrderId);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOrderId(null);
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  }) || [];

  const serviceStatusOptions = Array.from(new Set(orders?.map(order => order.status) || []));

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortCriteria === 'orderDate') {
      return new Date(a.orderDate) - new Date(b.orderDate);
    } else if (sortCriteria === 'serviceName') {
      return a.serviceName.localeCompare(b.serviceName);
    }
    return 0;
  });

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
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

  if (isError) {
    return (
      <>
        <AdminNavbar />
        <div className="container mx-auto py-4 px-2 min-h-screen sm:px-6 lg:px-24">
          <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">Order Management</h1>
          <p>Error: {error.message}</p>
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
              {sortedOrders.map((order, index) => (
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
          <div className="bg-white p-6 rounded shadow-lg relative z-10">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={handleCancelDelete} className="btn btn-secondary mr-2">Cancel</button>
              <button onClick={handleConfirmDelete} className="btn btn-error">Delete</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default OrderManagementPage;
