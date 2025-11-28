import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const SwitchableAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Pill Tabs */}
        <div className="flex p-2 m-4 bg-gray-100 rounded-full">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-6 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === 'login' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-6 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === 'register' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>
        
        {/* Form Content */}
        <div>
          {activeTab === 'login' && <LoginForm />}
          {activeTab === 'register' && <RegisterForm />}
        </div>
      </div>
    </div>
  );
};


export default SwitchableAuth;