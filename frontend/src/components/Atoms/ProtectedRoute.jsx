import React from "react";
import { Navigate, Outlet} from "react-router-dom";

function ProtectedRoute(){
    const isLoggedIn = localStorage.getItem("authToken");
    return isLoggedIn ? <Outlet /> : <Navigate to='/' /> 
}

export default ProtectedRoute;