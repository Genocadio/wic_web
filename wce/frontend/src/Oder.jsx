import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navbar from './User/Navbar';
import getServices from './services/getServices';
import Getorders from './services/Getorders';
import { toast } from 'react-toastify';
import 'daisyui/dist/full.css';

// Function to fetch the service by ID
const fetchService = async (id) => {
  const serviceData = await getServices.getById(id);
  return serviceData;
};

// Function to create an order
const createOrder = async (newOrder) => {
  // Retrieve token from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const token = loggedInUser.token;

  // Set token in orderServices module
  Getorders.setToken(token);

  // Call the create function from orderServices to post the order
  await Getorders.create(newOrder);
};

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MOMO');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Fetch the service details using useQuery
  const { data: service, error, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id),
  });

  // Mutation to place the order using useMutation
  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success('Order placed successfully!');
      // navigate('/oders');
    },
    onError: (error) => {
      console.error('Error placing order:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    },
    onSettled: () => {
      setIsPlacingOrder(false);
    }
  });

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    const totalPrice = service.price * quantity;

    const newOrder = {
      serviceId: service.id,
      quantity,
      totalPrice,
      location,
      notes,
      paymentMethod
    };

    mutation.mutate(newOrder);
  };

  if (isLoading) {
    return <p className="text-center min-h-screen text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error fetching service details</p>;
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
                    <p className="">{`${service.price * quantity}Rwf`}</p>
                  </div>
                  {service.soldInUnits && (
                    <div className="form-control">
                      <label className="label">Quantity</label>
                      <input
                        type="number"
                        className="input input-bordered"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                    </div>
                  )}
                  {service.locationRequired && (
                    <div className="form-control">
                      <label className="label">Location</label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  )}
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
                      onChange={(e) => setPaymentMethod(e.target.value)}
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
                  <button
                    className="btn btn-primary mt-4"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
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
