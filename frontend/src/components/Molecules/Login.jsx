import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [officialEmail, setOfficialEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  // useEffect(() => {
  //   const isTokenValid = localStorage.getItem("authToken");
  //   if(isTokenValid){

  //   }
  // }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      officialEmail,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/emp/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { token } = response.data;
        // console.log(token);
        
        const { emp } = response.data;
        // console.log(emp);        
        
        // storing tokens in local storage
        localStorage.setItem("authToken", token);
        // employee data in local storage
        localStorage.setItem("empData", JSON.stringify(emp));


        navigate("/dashboard");
      }
    } catch (error) {
      // handling invalid credentials
      if (error.response && error.response.status === 400) {
        alert("Invalid username or password");
        console.log("Invalid username or password");
      } else {
        console.error("Error submitting form data:", error);
        alert("An error occurred. Please try again later.");
      }

      // clear input fields
      setOfficialEmail("");
      setPassword("");
    }
  };

  return (
    <div className=" w-dvw flex flex-wrap  justify-center items-center h-dvh bg-gradient-to-r from-blue-500 to-red-500 p-4">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-w-auto flex flex-col flex-wrap"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap justify-center items-center mb-4 p-2">
          <img
            className="h-20 w-20 "
            src="https://www.cphi-online.com/LOGO_Size-comp302721.png"
            alt=""
          />
        </div>

        <div className="mb-4">
          <label htmlFor="officialEmail" className="block text-gray-700">
            Official Email Address
          </label>
          <input
            type="email"
            id="officialEmail"
            value={officialEmail}
            onChange={(e) => setOfficialEmail(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            className="w-full mt-1 p-2 border text-white border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className=" bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-2xl transition duration-200 mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
