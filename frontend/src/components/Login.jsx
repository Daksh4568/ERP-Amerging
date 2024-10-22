// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="w-dvw flex justify-center items-center h-screen bg-gradient-to-r from-blue-200 to-red-100">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
