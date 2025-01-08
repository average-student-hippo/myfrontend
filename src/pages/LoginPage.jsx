import React, { useEffect } from 'react'
import Login from '../components/Login/Login'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);
    // if user is logged in then redirect to home page
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }

    })
    return (
        <div>
            <Login />
        </div>
    )
}

export default LoginPage