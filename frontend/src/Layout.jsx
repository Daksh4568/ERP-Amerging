import { Header } from 'antd/es/layout/layout';
import React from 'react'
import {Outlet} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';

function Layout() {
    
    return (
        <>
            <Header/>
            <Dashboard/>
            <Outlet/>
        </>
    )
}

export default Layout;