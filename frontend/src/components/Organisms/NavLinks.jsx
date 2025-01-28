import { MenuIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const NavLinks = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#2E3B55] hover:bg-[#E8E8E8]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        className="bg-[#2E3B55]"
        breakPoint="sm"
        rootStyles={{
          height: '100%',
        }}
      >
        <Menu className='bg-[#2E3B55] text-white'>
          {/* Toggle Button */}
          <MenuItem onClick={() => setCollapsed(!collapsed)} className=''>
            {collapsed ?  <MenuIcon /> : <MenuIcon />}
          </MenuItem>

          {/* Admin access */}
          <SubMenu className='bg-[#2E3B55]' label="Admin Module">
            <MenuItem className='bg-[#2E3B55] hover:bg-[#4A90E2] hover:text-black' component={<Link to="/admin/employee-data" />}>Employee Data</MenuItem>
          </SubMenu>

          {/* HR Module */}
          <SubMenu className='' label="HR Module">
            <MenuItem className='bg-[#2E3B55] hover:bg-[#4A90E2] hover:text-black' component={<Link to="/dashboard/joining-form" />}>Joining Form</MenuItem>
            <MenuItem className='bg-[#2E3B55] hover:bg-[#4A90E2] hover:text-black' component={<Link to="/dashboard/selfeval-form" />}>Self Evaluation Form</MenuItem>
            <MenuItem className='bg-[#2E3B55] hover:bg-[#4A90E2] hover:text-black' component={<Link to="/dashboard/exit-form" />}>Exit Form</MenuItem>
          </SubMenu>

          {/* Employee Module */}
          <SubMenu className='bg-[#2E3B55]' label="Employee Module">
            {/* <MenuItem className='bg-[#2E3B55] hover:bg-[#4A90E2] hover:text-black' component={<Link to="/dashboard/leave-form" />}>Leave Form</MenuItem> */}
            <MenuItem className='bg-[#2E3B55] hover:bg-[#4A90E2] hover:text-black' component={<Link to="/dashboard/leave-status" />}>My Leaves</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>

    </div>
  );
};

export default NavLinks;