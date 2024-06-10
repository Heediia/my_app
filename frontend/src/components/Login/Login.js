import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', formData);
      console.log('User logged in successfully:', response.data);
      localStorage.setItem('token', response.data.token); // Store the JWT token
      localStorage.setItem('userType', response.data.role); // Store the user role in local storage
      setErrorMessage(''); // Reset error message
      navigate('/'); // Redirect to dashboard after successful login
      window.location.reload(); // Refresh the page to apply changes (like header display)
    } catch (error) {
      console.error('Error logging in user:', error);
      setErrorMessage(error.response ? error.response.data.message : 'Login error');
    }
  };

  return (
    <div className="login-container">
      
      <div className="login wrap">
        <h1 className="h1">Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              placeholder="Email"
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
        {errorMessage && <p className="error-message-login">{errorMessage}</p>}
        <p className="signup-text">Don't have an account? <Link to="/signup">signup</Link></p>
      </div>
    </div>
  );
};

export default Login;
