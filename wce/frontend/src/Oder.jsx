import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './User/Navbar';
import getServices from './services/getServices';
import Getorders from './services/Getorders'; // Import orderServices module
import { toast } from 'react-toastify';
import 'daisyui/dist/full.css';

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setpaymentMethod] = useState('MOMO');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceData = await getServices.getById(id);
        setService(serviceData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching service details');
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handlePlaceOrder = async () => {
    try {
      const totalPrice = service.price * quantity;

      const newOrder = {
        serviceId: service.id, // Assuming service object has an _id field
        quantity,
        totalPrice,
        location,
        notes,
        paymentMethod
      };

      // Retrieve token from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const token = loggedInUser.token;
      
      // Set token in orderServices module
      Getorders.setToken(token);

      // Call the create function from orderServices to post the order
      await Getorders.create(newOrder);
      toast.success('Order placed successfully!'); // Example of notifying the user
      // alert('Order placed successfully!'); // Example of notifying the user

      // Optional: Redirect the user to another page after successful order placement
      // navigate('/orders'); // Make sure to import useNavigate from react-router-dom
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error state or display error message to the user
      if (error.response && error.response.status === 401) {
        // Redirect to login if 401 Unauthorized
        navigate('/login');
      }
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-base-200">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 lg:py-16">
          {service ? (
            <div className="flex flex-col md:flex-row bg-base-100 shadow-xl p-4 space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col md:w-1/2">
                <div className="rounded-box hero bg-base-200 h-full">
                  <div className="hero-content text-center">
                    <div className="max-w-md">
                      <h1 className="text-4xl font-bold">{service.Name}</h1>
                      <p className="py-4 text-sm md:text-base lg:text-lg">
                        {service.Description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:w-1/2">
                <div className="rounded-box bg-base-200 h-full p-4">
                  <div className="form-control">
                    <label className="label">Total Price</label>
                    <p className="">{`$${service.price * quantity}Rwf`}</p>
                  </div>
                  <div className="form-control">
                    <label className="label">Quantity</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Location</label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Notes</label>
                    <textarea
                      className="textarea textarea-bordered"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Payment Option</label>
                    <select
                      className="select select-bordered"
                      value={paymentMethod}
                      onChange={(e) => setpaymentMethod(e.target.value)}
                    >
                      <option value="MOMO">MOMO</option>
                      <option value="Airtel">Airtel</option>
                    </select>
                    {paymentMethod === 'MOMO' && (
                      <p className="mt-2">Pay using MOMO.</p>
                    )}
                    {paymentMethod === 'Airtel' && (
                      <p className="mt-2">Pay using Airtel.</p>
                    )}
                  </div>
                  <button className="btn btn-primary mt-4" onClick={handlePlaceOrder}>
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg">Service not found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderPage;
