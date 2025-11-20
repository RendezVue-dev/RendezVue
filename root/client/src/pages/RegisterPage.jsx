import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    age: '',
    city: '',
    state: '',
    zipcode: '',
    bio: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }

      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="register-header">
          <h1>Register</h1>
          <p className="register-subtitle">
            Register to create your account.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name</label>
        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <label htmlFor="last_name">Last Name</label>
        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        <label htmlFor="age">Age</label>
        <input type="number" id="age" name="age" value={formData.age} min={18} onChange={handleChange} required />
        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
        <label htmlFor="state">State</label>
        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
        <label htmlFor="zipcode">Zipcode</label>
        <input type="text" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} required />
        <label htmlFor="bio">Write a short introduction:</label>
        <input type="text" maxLength={1000} style={{"height": "200px"}} id="bio" name="bio" value={formData.bio} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
