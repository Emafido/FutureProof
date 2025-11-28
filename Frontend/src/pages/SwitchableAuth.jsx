import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm'; // Assuming LoginForm is in the same directory
import RegisterForm from '../components/RegisterForm'; // Use your actual path for RegisterForm

const SwitchableAuth = () => {
  const [activeTab, setActiveTab] = useState('login'); 

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student', 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); 

  const API_BASE_URL = 'http://localhost:5000/api/auth';

  const navigate = useNavigate();

  // Function to update form state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (error) setError(null);
  };
  
  // 🔑 Login Logic Implementation
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setError(null);
    setSuccess(false);

    if (!formData.email || !formData.password) {
      setError('Email and password are required for login.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Successful login (HTTP 200)
        setSuccess(true);
        setSuccessMessage('Login successful! Redirecting...');
        console.log('Login successful. Token:', result.access_token);
        localStorage.setItem('auth_token', result.access_token);
        // Add redirection logic here

        if (result.has_taken_onboarding) {
          setTimeout(() => {
            navigate('/dashboard'); // Redirect to dashboard after login
          }, 1500);
        } else {
          setTimeout(() => {
            navigate('/onboarding'); // Redirect to onboarding if not taken
          }, 1500);
        }
      } else {
        // Handle server errors (e.g., 401 Unauthorized)
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    
    setError(null);
    setSuccess(false);
    setSuccessMessage('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSuccessMessage('Account created successfully! Logged in automatically.');
        console.log('Registration successful. Token:', result.access_token);
        localStorage.setItem('auth_token', result.access_token);

        setTimeout(() => {
          navigate('/onboarding'); // Redirect to onboarding after registration
        }, 1500);
        
      } else {
        setError(result.error || 'Registration failed due to a server error.');
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);

    }
  };
  
  // Function to switch tabs and clear state
  const switchTab = (tabName) => {
      setActiveTab(tabName);
      setError(null);
      setSuccess(false);
      setSuccessMessage('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Pill Tabs */}
        <div className="flex p-2 m-4 bg-gray-100 rounded-full">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-2.5 px-6 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === 'login' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-2.5 px-6 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === 'register' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>
        
        {/* Messages */}
        <div className="px-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                    🛑 {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                    ✅ {successMessage || 'Action successful!'}
                </div>
            )}
        </div>
        
        {/* Form Content */}
        <div>
          {activeTab === 'login' && (
              <LoginForm 
                handleLogin={handleLogin} 
                handleChange={handleChange} 
                formData={formData} 
                loading={loading} 
              />
          )}
          {activeTab === 'register' && (
              <RegisterForm 
                handleRegister={handleRegister} 
                handleChange={handleChange}
                formData={formData}
                loading={loading}
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default SwitchableAuth;