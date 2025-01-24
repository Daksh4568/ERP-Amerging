import React, { useState } from "react";
import { Space, Input } from "antd";
import { BellIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import Notification from "../Pages/Notification";
import axios from 'axios';    

const Header = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const { Search } = Input;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token available, please log in again.");
        navigate("/");
        return;
      }

      // const response = await fetch(
      //   // "http://localhost:3000/api/emp/logout", {
      //   "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/emp/logout", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const response = await axios.post(
        "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/emp/logout", {  }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          }
        });

      if (response.ok) {
        localStorage.clear();
        alert("Logged out successfully");
        navigate("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  const handleIconClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="w-screen flex items-center justify-between p-4 bg-[#2E3B55] shadow-md">
      <div className="logo-container flex items-center justify-center">
        <img
          src="https://www.cphi-online.com/LOGO_Size-comp302721.png"
          alt="Company Logo"
          className="logo-image w-9 h-9 cursor-pointer"
          onClick={handleIconClick}
        />

        <span className="company-name flex-grow text-lg text-white font-bold ml-2">
          Amerging Technologies (Beta Version)
        </span>
      </div>

      {/* <Space>
        <Search placeholder="Search" enterButton="Search" size="medium" />
      </Space> */}

      <div className="flex items-center justify-center gap-4 ">
        <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
          <BellIcon className="text-white" />
        </Button>

        <Notification
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <Button onClick={handleLogout}>
          <span>
            <LogOutIcon />
          </span>{" "}
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
