import React, { useEffect, useState } from "react";
import { Space, Input } from "antd";
import { BellIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import Notification from "../Pages/Notification";
import axios from "axios";
import useDialog from "../Atoms/UseDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const { Search } = Input;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { DialogComponent, showDialog } = useDialog();
  const [initials, setInitials] = useState("AT");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("empData"));
    if(userData?.name){
      const nameParts = userData.name.trim().split(" ");
      const calculatedInitials = nameParts.map((part) => part[0].toUpperCase()).join("").substring(0, 2);
      setInitials(calculatedInitials);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showDialog("No token available, please log in again.");
        navigate("/");
        return;
      }

      const response = await fetch(
        // "http://localhost:3000/api/emp/logout", {
        "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/emp/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.clear();
        showDialog("Logged out successfully", () => navigate("/"));
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      showDialog("An error occurred during logout. Please try again.");
    }
  };

  const handleIconClick = () => {
    navigate("/dashboard");
  };

  const handleUserProfile = () => {
    navigate("/user-profile")
  }

  return (
    <header className="w-screen flex items-center justify-between p-4 bg-[#2E3B55] shadow-md ">
      <DialogComponent />
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
        <Button
          className="bg-black hover:bg-black"
          variant="ghost"
          onClick={() => setIsDialogOpen(true)}
        >
          <BellIcon className=" text-white" />
        </Button>

        <Notification
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <Button className="bg-black" onClick={handleLogout}>
          <span>
            <LogOutIcon />
          </span>{" "}
          Logout
        </Button>

        <Avatar className="cursor-pointer" onClick={handleUserProfile}>
          <AvatarImage/>
          <AvatarFallback className="select-none">{initials}</AvatarFallback>
        </Avatar>
        
      </div>
    </header>
  );
};

export default Header;