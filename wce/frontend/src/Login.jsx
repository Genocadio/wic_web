import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginService from './services/loginService';
import { AuthContext } from './AuthContext';
import Navbar from './User/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const LoginForm = () => {
  const [identifier, setIdentifier] = useState(''); // Single input for email or phone number
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { login, loggedInUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is already logged in
    if (loggedInUser) {
      logout();
      // navigate('/');
    }
  }, [loggedInUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const user = await loginService.login({ identifier, password });
      login(user);
      console.log('Logged in:', user);
      toast.success(`Welcome back, ${user.firstName}!`);

      // Redirect based on user type
      if (user.userType === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Authentication failed. Please check your credentials.');
        toast.error('Authentication failed. Please check your credentials.');
      } else {
        setError(error.message || 'Login failed'); // Fallback to generic error message
        toast.error(error.message || 'Login failed');
      }
      // console.error('Login error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto min-h-screen max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Login to Your Account</h1>
          <p className="mt-4 text-gray-500">
            Welcome back! Please login to access your account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
          <div>
            <label htmlFor="identifier" className="sr-only">Email or Phone Number</label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0a10 10 0 110 20 10 10 0 010-20zm0 1a9 9 0 100 18 9 9 0 000-18zm-.5 6.5a.5.5 0 00-1 0v4a.5.5 0 001 0v-4zm-.5 8.75a1.5 1.5 0 013 0h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
              >
                {!showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3C5 3 1.73 6.11.84 10.03c-.13.62.39 1.22 1.03 1.22.46 0 .87-.31.98-.76C3.1 8.67 6.29 6 10 6s6.9 2.67 7.15 6.49c.11.45.52.76.98.76.64 0 1.16-.6 1.03-1.22C18.27 6.11 15 3 10 3zM10 7c-2.21 0-4 1.79-4 4 0 1.49.81 2.77 2 3.44V16h4v-1.56c1.19-.67 2-1.95 2-3.44 0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2 0 .35-.07.68-.18.99L10 10.66l-1.82 1.33C8.07 11.68 8 11.35 8 11c0-1.1.9-2 2-2z"/>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              No account?{' '}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </p>

            <button
              type="submit"
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign in
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
