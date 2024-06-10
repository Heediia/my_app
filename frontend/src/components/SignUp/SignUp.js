import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    type: '', 
    cin: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/signup', formData)
      .then(response => {
        console.log('User registered successfully:', response.data);
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error registering user:', error);
        setMessage(error.response ? error.response.data.message : 'Erreur d\'inscription');
      });
      window.location.reload();
  };

  return (
    <div className="signup-container">
      <div className="signup wrap">
        <h1 className="h1">Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleInputChange} 
              required 
              autoComplete="given-name" 
              placeholder="First Name" 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleInputChange} 
              required 
              autoComplete="family-name" 
              placeholder="Last Name" 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              autoComplete="email" 
              placeholder="Email" 
            />
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleInputChange} 
              required 
              autoComplete="tel" 
              placeholder="Phone Number" 
            />
          </div>
          <div className="form-group">
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Select Type</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="form-group">
            <input 
              type="text" 
              name="cin" 
              value={formData.cin} 
              onChange={handleInputChange} 
              required 
              placeholder="CIN" 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              autoComplete="new-password" 
              placeholder="Password" 
            />
          </div>
          <button type="submit" className="btn">Sign Up</button>
        </form>
        {message && <p className="error-message">{message}</p>}
        <p className="login-text">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
