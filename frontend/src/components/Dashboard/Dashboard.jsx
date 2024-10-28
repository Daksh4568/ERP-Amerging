import React, { useState } from 'react';
import {useNavigate, Outlet} from 'react-router-dom'
import { LeftOutlined, PieChartOutlined, DesktopOutlined, TeamOutlined, RightOutlined, UserOutlined, FileOutlined, SettingOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content} = Layout;
function Dashboard() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [hrOpen, setHrOpen] = useState(false);
  // const [formsOpen, setFormsOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate(e.key);
  }

  const {
    token : {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  // return (


  //   <div className="flex h-screen overflow-hidden">
  //     {/* Hamburger menu for mobile/desktop */}
  //     <div className="absolute top-4 left-4 z-50 md:hidden">
  //       <button
  //         onClick={toggleSidebar}
  //         className="text-white focus:outline-none"
  //       >
  //         <svg
  //           className="w-8 h-8"
  //           xmlns="http://www.w3.org/2000/svg"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           stroke="currentColor"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth="2"
  //             d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
  //           />
  //         </svg>
  //       </button>
  //     </div>

  //     {/* Sidebar */}
  //     <div
  //       className={`bg-gray-800 text-white p-5 md:static absolute inset-y-0 left-0 transform ${
  //         isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
  //       } md:translate-x-0 transition-transform duration-200 ease-in-out w-64`}
  //     >
  //       <h3 className="text-lg font-bold mb-5">Sidebar</h3>

  //       {/* HR Module Dropdown */}
  //       <div className="mb-5">
  //         <button
  //           className="w-full text-left bg-gray-700 p-2 rounded-md hover:bg-gray-600"
  //           onClick={() => setHrOpen(!hrOpen)}
  //         >
  //           HR Module {hrOpen ? '▲' : '▼'}
  //         </button>
  //         {hrOpen && (
  //           <div className="mt-2 pl-2 space-y-2">
  //             <a href="/" className="block hover:bg-gray-600 p-2 rounded-md">
  //               Employee Joining Form
  //             </a>
  //             <a href="#" className="block hover:bg-gray-600 p-2 rounded-md">
  //               Employee Exit Form
  //             </a>
  //             <a href="#" className="block hover:bg-gray-600 p-2 rounded-md">
  //               Exit Form
  //             </a>
  //           </div>
  //         )}
  //       </div>

  //       {/* Forms dropDown */}
  //       <div>
  //         <button
  //           className="w-full text-left bg-gray-700 p-2 rounded-md hover:bg-gray-600"
  //           onClick={() => setFormsOpen(!formsOpen)}
  //         >
  //           Forms {formsOpen ? '▲' : '▼'}
  //         </button>
  //         {formsOpen && (
  //           <div className="mt-2 pl-2 space-y-2">
  //             <a href="#" className="block hover:bg-gray-600 p-2 rounded-md">
  //               Form 1
  //             </a>
  //             <a href="#" className="block hover:bg-gray-600 p-2 rounded-md">
  //               Form 2
  //             </a>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Main Content */}
  //     <div className="w-dvw flex-1 text-black bg-gray-100 p-10 overflow-auto">
  //       <h2 className="text-3xl font-bold">Welcome to the Dashboard</h2>
  //       {/* Additional dashboard content goes here */}
  //     </div>
  //   </div>
  // );

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem('HR Module', 'sub1', <UserOutlined />, [
      getItem('Joining Form', 'joining-form'),
      getItem('Create new user', 'create-new-user'),
      getItem('Exit form', 'exit-form'),
    ]),
    getItem('Employee', 'sub2', <TeamOutlined />, [
      getItem('Team 1', 'team-1'),
      getItem('Team 2', 'team-2'),
    ]),
    getItem('Files', 'files', <FileOutlined />),
  ];

  return (
    <Layout className='w-dvw h-dvh '>
      <Sider className='p-3 ' trigger={null} collapsible collapsed={collapsed}>
        <div className='demo-logo-vertical' />
        
        <Menu
          className='' 
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding:0,
            background: colorBgContainer,
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <RightOutlined/> : <LeftOutlined/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 40,
              height: 64,
            }}
          />
        </Header>
        <div style={{ padding: '20px', background: '#f0f2f5' }}>
          <Outlet /> 
        </div>
      </Layout>
    </Layout>

  );
}

export default Dashboard;
