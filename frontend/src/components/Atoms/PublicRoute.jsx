import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const isLoggedIn = localStorage.getItem("authToken");
    return isLoggedIn ? <Navigate to='/dashboard' /> : <Outlet />;
}

export default PublicRoute;
