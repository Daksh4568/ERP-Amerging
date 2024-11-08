import React from 'react'
import {Outlet} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';

function Layout() {
    
    return (
        <>
            <Dashboard/>
            <Outlet/>
        </>
    )
}

export default Layout;