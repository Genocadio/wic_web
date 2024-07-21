import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import Getorders from '../services/Getorders';
import getServices from '../services/getServices'; // Import ServiceService
import AdminNavbar from './AdminNavbar'; // Import AdminNavbar
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const DataExportPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    // Fetch initial data on component mount
    fetchUserData();
    fetchOrderData();
    fetchServiceData();
  }, []);

  const fetchUserData = async () => {
    try {
      UserService.setToken(loggedInUser.token);
      const fetchedUsers = await UserService.getAll();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrderData = async () => {
    try {
      Getorders.setToken(loggedInUser.token);
      const fetchedOrders = await Getorders.getAll();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchServiceData = async () => {
    try {
      getServices.setToken(loggedInUser.token);
      const fetchedServices = await getServices.getAll();
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleExportUsers = async () => {
    try {
      // Map fetched users data to the format expected by xlsx library
      const userData = users.map(user => ({
        'First Name': user.firstName,
        'Last Name': user.lastName,
        'Email': user.email,
        'Phone Number': user.phoneNumber,
        'Location': user.location || '',
        'User Type': user.userType || '',
        'Has Notification': user.hasNotification ? 'Yes' : 'No',
        'Has Notice': user.hasNotice ? 'Yes' : 'No',
        'Status': user.status,
        'Date Of Creation': new Date(user.dateOfCreation).toLocaleDateString(),
        // Add more fields as needed
      }));

      // Convert user data to xlsx format
      const userWorksheet = XLSX.utils.json_to_sheet(userData);
      const userWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(userWorkbook, userWorksheet, 'Users');

      // Generate XLSX file for users and save it using FileSaver.js
      const userExcelBuffer = XLSX.write(userWorkbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([userExcelBuffer], { type: 'application/octet-stream' }), 'users_data.xlsx');
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const handleExportOrders = async () => {
    try {
      // Map fetched orders data to the format expected by xlsx library
      const orderData = orders.map(order => ({
        'Order ID': order.id,
        'Service Name': order.serviceName,
        'Quantity': order.quantity,
        'Total Price': order.totalPrice,
        'Notes': order.notes,
        'Status': order.status,
        'User': `${order.user.firstName} ${order.user.lastName} `,
        'User Email': order.user.email,
        'User Phone number': order.user.phoneNumber,
        'Location': order.location || '',
        'Payment Method': order.paymentMethod,
        'Order Date': new Date(order.orderDate).toLocaleString(),
        // Add more fields as needed
      }));

      // Convert order data to xlsx format
      const orderWorksheet = XLSX.utils.json_to_sheet(orderData);
      const orderWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(orderWorkbook, orderWorksheet, 'Orders');

      // Generate XLSX file for orders and save it using FileSaver.js
      const orderExcelBuffer = XLSX.write(orderWorkbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([orderExcelBuffer], { type: 'application/octet-stream' }), 'orders_data.xlsx');
    } catch (error) {
      console.error('Error exporting orders:', error);
    }
  };

  const handleExportServices = async () => {
    try {
      // Map fetched services data to the format expected by xlsx library
      const serviceData = services.map(service => ({
        'Service Name': service.Name,
        'Description': service.Description,
        'Type': service.Type,
        'Image Links': service.ImageLinks.join(', '), // Convert array to comma-separated string
        'Video Links': service.VideoLinks.join(', '), // Convert array to comma-separated string
        'Show Images': service.showImages ? 'Yes' : 'No',
        'Show Videos': service.showVideos ? 'Yes' : 'No',
        'Sold In Units': service.soldInUnits ? 'Yes' : 'No',
        'Price': service.price,
        'Location Required': service.locationRequired ? 'Yes' : 'No',
        'Created At': new Date(service.createdAt).toLocaleDateString(),
        // Add more fields as needed
      }));

      // Convert service data to xlsx format
      const serviceWorksheet = XLSX.utils.json_to_sheet(serviceData);
      const serviceWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(serviceWorkbook, serviceWorksheet, 'Services');

      // Generate XLSX file for services and save it using FileSaver.js
      const serviceExcelBuffer = XLSX.write(serviceWorkbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([serviceExcelBuffer], { type: 'application/octet-stream' }), 'services_data.xlsx');
    } catch (error) {
      console.error('Error exporting services:', error);
    }
  };

  return (
    <><AdminNavbar /><div className="p-4 bg-white shadow rounded min-h-screen">
          <h2 className="text-center text-lg font-bold mb-4">Data Export</h2>
          <div className="flex justify-center space-x-4">
              <div className="card bg-base-100 w-80 shadow-xl">
                  <div className="card-body">
                      <h2 className="card-title text-center">Total Users</h2>
                      <p className="text-lg font-semibold text-center">{users.length}</p>
                      <div className="card-actions justify-center">
                          <button className="btn btn-primary" onClick={handleExportUsers}>Export Users</button>
                      </div>
                  </div>
              </div>
              <div className="card bg-base-100 w-80 shadow-xl">
                  <div className="card-body">
                      <h2 className="card-title text-center">Total Orders</h2>
                      <p className="text-lg font-semibold text-center">{orders.length}</p>
                      <div className="card-actions justify-center">
                          <button className="btn btn-primary" onClick={handleExportOrders}>Export Orders</button>
                      </div>
                  </div>
              </div>
              <div className="card bg-base-100 w-80 shadow-xl">
                  <div className="card-body">
                      <h2 className="card-title text-center">Total Services</h2>
                      <p className="text-lg font-semibold text-center">{services.length}</p>
                      <div className="card-actions justify-center">
                          <button className="btn btn-primary" onClick={handleExportServices}>Export Services</button>
                      </div>
                  </div>
              </div>
          </div>
      </div></>
  );
};

export default DataExportPage;
