import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginService from './services/loginService';
import { AuthContext } from './AuthContext';
import Navbar from './components/Navbar';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    if (loggedInUser && loggedInUser.userType !== 'admin') {
      const confirmed = window.confirm('You are not authorized. Proceed to sign out?');
      if (confirmed) {
        navigate('/logout');
      } else {
        navigate('/');
      }
    }
  }, [loggedInUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.register({ firstName, lastName, email, phoneNumber, location, password });

      setMessage(loggedInUser ? 'User created successfully.' : 'Thanks for registering. Please login to continue.');
      
      if (!loggedInUser) {
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <><Navbar /><div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Create Your Account</h1>
        <p className="mt-4 text-gray-500">
          Register to start using our services!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
        <div className="grid grid-cols-1 gap-y-4">
          <label htmlFor="firstName" className="sr-only">First Name</label>
          <input
            type="text"
            id="firstName"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required />

          <label htmlFor="lastName" className="sr-only">Last Name</label>
          <input
            type="text"
            id="lastName"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required />

          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            id="email"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />

          <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} />

          <label htmlFor="location" className="sr-only">Location</label>
          <input
            type="text"
            id="location"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)} />

          <label htmlFor="password" className="sr-only">Password</label>
          <input
            type="password"
            id="password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>

        {message && (
          <p className="text-green-500 text-sm">{message}</p>
        )}

        <button
          type="submit"
          className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Register
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="underline">
          Login here
        </Link>
      </p>
    </div></>
  );
};

export default RegisterForm;
