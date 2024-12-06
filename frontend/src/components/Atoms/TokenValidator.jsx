import React from 'react'
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { DeckRounded } from '@mui/icons-material';

const isTokenValid = (token) => {
    try{
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp && decoded.exp > currentTime;
    }
    catch (error){
        return false;
    }
}
const TokenValidator = ({children}) => {
    const token = localStorage.getItem("authToken");

    if(!token || !isTokenValid(token)){
        localStorage.removeItem("authToken");
        return <Navigate to="/" />;
    }

    return <>{children}</>
    
}

export default TokenValidator;
