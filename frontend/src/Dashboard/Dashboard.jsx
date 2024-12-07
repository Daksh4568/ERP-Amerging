import React, { useState } from "react";
import {
  useNavigate,
  Outlet,
  Link,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import {
  LeftOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  RightOutlined,
  UserOutlined,
  FileOutlined,
  DashboardOutlined,
  LineChartOutlined ,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme, Space, Input } from "antd";
import Search from "antd/es/transfer/search";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Logout,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
// import './dashboard.css';
import axios from "axios";

const { Header, Sider, Content } = Layout;
function Dashboard() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [hrOpen, setHrOpen] = useState(false);
  // const [formsOpen, setFormsOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { Search } = Input;

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem("HR Module", "sub1", <UserOutlined />, [
      getItem("Joining Form", "joining-form"),
      getItem("Self Evaluation Form", "selfeval-form"),
      getItem("Exit form", "exit-form"),
    ]),
    getItem("Employee", "sub2", <TeamOutlined />, [
      getItem("Team 1", "team-1"),
      getItem("Team 2", "team-2"),
    ]),
    getItem("Files", "files", <FileOutlined />),
  ];

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      console.log(token);
      if (!token) {
        alert("No token available, please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/emp/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Logged out successfully");
        alert("Logged out successfully");

        localStorage.removeItem("authToken");
        localStorage.removeItem("empData");

        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);

      if (error.response && error.response.status === 500) {
        alert("Server error: Please try again later.");
      } else {
        alert("Network error: Please check your connection.");
      }
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hrMenuOpen, setHrMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleHrMenu = () => setHrMenuOpen(!hrMenuOpen);

  return (
    <Layout className="w-screen min-h-screen flex flex-col">
      {/* sidebar */}
      <Sider className="" trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />

        <Menu
          className=" "
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* header */}
      <Layout>
        <Header
          className=" flex flex-row items-center justify-between  p-2"
        >
          <Button
            className="basis-1 text-white "
            type="text"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space className=" basis-1/2 " direction="vertical">
            <Search
              className="flex items-center  "
              placeholder="Search Box"
              enterButton="Search"
              size="medium"
            />
          </Space>

          <Button
            className="basis-1 "
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>

        {/* main content */}
        <div className="p-5 text-black overflow-auto">
          <Outlet />
          
        </div>
      </Layout>

    </Layout>
    
  );
}

export default Dashboard;
