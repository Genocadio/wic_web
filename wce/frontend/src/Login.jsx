import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import loginService from './services/loginService';
import { AuthContext } from './AuthContext';
import Navbar from './components/Navbar';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const user = await loginService.login({ email, password });
      login(user);
      console.log('Logged in:', user);

      // Redirect based on user type
      if (user.userType === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Authentication failed. Please check your email and password.');
      } else {
        setError(error.message || 'Login failed'); // Fallback to generic error message
      }
      console.error('Login error:', error);
    }
  };

  return (
    <><Navbar /><div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Login to Your Account</h1>
        <p className="mt-4 text-gray-500">
          Welcome back! Please login to access your account.
        </p>
      </div>

      <form onSubmit={handleLogin} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>

          <div className="relative">
            <input
              type="email"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />

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
                  clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">Password</label>

          <div className="relative">
            <input
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />

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
                  clipRule="evenodd" />
              </svg>
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
    </div></>
  );
};

export default LoginForm;
