import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mockUsers= [
    {
      username: "keshav",
      password: "keshav123",
    },
    {
      username: "daksh",
      password: "daksh123",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = mockUsers.find(
      (mockUsers) => mockUsers.username === username && mockUsers.password === password
    );

    if(user){
      navigate('/dashboard');
    }
    else{
      alert("Invalid usernamae or password");
      setUsername("");
      setPassword("");
    }

  }; 

  return (
    <div className="w-dvw flex flex-wrap  justify-center items-center h-dvh bg-gradient-to-r from-blue-200 to-red-100 p-4">
      {/* <div
        className='h-96 w-full max-w-md mx-auto rounded-lg bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1365795/pexels-photo-1365795.jpeg?auto=compress&cs=tinysrgb&w=600')`,
        }}
      >
      </div> */}

      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-w-auto"
        onSubmit={handleSubmit}
      >
        <div className='flex flex-wrap justify-center items-center mb-4 p-2'>
          <img className='h-20 w-20 ' src="https://www.cphi-online.com/LOGO_Size-comp302721.png" alt="" />
        </div>

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
