import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import loginService from './services/loginService';
import { AuthContext } from './AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ email, password });
      console.log('Logged in:', user);
      login(user);
      // Redirect to the previous route or to a default route
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (error) {
      setError(error.message || 'Login failed');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <button><Link to="/admin">Admin</Link></button>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      <button><Link to="/Register">Register</Link></button>
    </div>
  );
};

export default LoginForm;
