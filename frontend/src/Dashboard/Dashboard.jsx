import React, { useState } from 'react';
import {useNavigate, Outlet} from 'react-router-dom'
import { LeftOutlined, PieChartOutlined, DesktopOutlined, TeamOutlined, RightOutlined, UserOutlined, FileOutlined, SettingOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Layout, Menu, theme, Space ,Input } from 'antd';
import Search from 'antd/es/transfer/search';

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
  const  { Search } = Input;

  const handleMenuClick = (e) => {
    navigate(e.key);
  }

  const {
    token : {colorBgContainer, borderRadiusLG},
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
    getItem('HR Module', 'sub1', <UserOutlined />, [
      getItem('Joining Form', 'joining-form'),
      getItem('Performance Evaluation Form', 'create-new-user'),
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

          <Space direction='vertical'>  
            <Search 
              className='flex items-center p-2'
              placeholder='Search Box'
              enterButton='search'
              size='large'
            />
          </Space>
        </Header>
        <div style={{ padding: '20px', background: '#f0f2f5', height: 'dvh' }}>
          <Outlet /> 
        </div>
      </Layout>
    </Layout>

  );
}

export default Dashboard;
