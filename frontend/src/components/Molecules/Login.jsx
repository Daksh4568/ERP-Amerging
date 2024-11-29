import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mockUsers= [
    {
      emailAddress: "keshav@amerging.com",
      password: "keshav123",
    },
    {
      emailAddress: "daksh@amerging.com",
      password: "daksh123",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/emp/login", {
      emailAddress,
      password,
    })
    console.log(response.data);

    if(response.status === 200) {
      console.log("Login successful: ", response.data);
      navigate('/dashboard');
    }
    } catch (error) {
      // handling invalid credentials
      if(error.response && error.response.status === 401){
        alert("Invalid usernamae or password");
      }
      else {
      console.error("Error submitting form data:", error);
      alert("An error occurred. Please try again later.");
      }

      // clear input fields
      setEmailAddress("");
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
          <label htmlFor="emailAddress" className="block text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="emailAddress"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
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
