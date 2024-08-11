import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navbar from './User/Navbar';
import Getorders from './services/Getorders';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { intializeServices } from './redux/servicesSlice';
import 'daisyui/dist/full.css';

// Function to fetch the service by ID
const fetchService = async (id, services, dispatch) => {
  let service = services.find((s) => s.id === id);
  if (!service) {
    console.log('missing');
    const serviceData = await getServices.getById(id);
    dispatch(intializeServices([serviceData]));
    service = serviceData;
  }
  return service;
};

// Function to create an order
const createOrder = async (newOrder) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const token = loggedInUser.token;
  Getorders.setToken(token);
  await Getorders.create(newOrder);
};

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MOMO');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedColor, setSelectedColor] = useState(''); // State for selected color
  const [selectedSize, setSelectedSize] = useState(''); // State for selected size
  const [showOverlay, setShowOverlay] = useState(false);

  const servicess = useSelector((state) => state.services);
  useEffect(() => {
    if (servicess.length === 0) {
      console.log('Fetching services...');
      dispatch(intializeServices());
    }
  }, [dispatch]);

  const services = useSelector((state) => state.services);
  const { data: service, error, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id, services, dispatch),
    initialData: services.find((s) => s.id === id),
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success('Order placed successfully!');
      setShowOverlay(true);
      // navigate('/orders');
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
  const isValidArray = (arr) => {
    console.log('arr', arr);
    return Array.isArray(arr) && arr.length > 0 && arr.some(item => item !== null && item !== undefined && item !== '');
  };
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    const totalPrice = service.price * quantity;

    const newOrder = {
      serviceId: service.id,
      quantity,
      totalPrice,
      location,
      notes,
      paymentMethod,
      color: selectedColor, // Add selected color to the order
      size: selectedSize, // Add selected size to the order
    };

    mutation.mutate(newOrder);
  };
  const handleOverlayClose = () => {
    setShowOverlay(false);
    // navigate('/orders'); // Redirect or perform any other action after closing overlay
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-52 flex flex-col gap-4">
          <div className="skeleton h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="skeleton h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
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
                  {isValidArray(service.colors) > 0 && (
                    <div className="form-control">
                      <label className="label">Select Color</label>
                      <select
                        className="select select-bordered"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                      >
                        <option value="" disabled>Select a color</option>
                        {service.colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  { isValidArray(service.sizes) && (
                    <div className="form-control">
                      <label className="label">Select Size</label>
                      <select
                        className="select select-bordered"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      >
                        <option value="" disabled>Select a size</option>
                        {service.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
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
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Order Successful!</h2>
            <p className="mb-4">Your order has been placed successfully. Please proceed with payment using {paymentMethod}.</p>
            <button
              className="btn btn-primary"
              onClick={handleOverlayClose}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPage;
