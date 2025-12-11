import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import {  Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({handleOpenModal}) => {
  const {isLoggedIn, loading} = useSelector((state) => state.user);
   const navigate= useNavigate()
   console.log(loading)
  // If not logged in → redirect to login page
 
    useEffect(() => {
        if (loading) {
              return ;
        }
        if (!isLoggedIn) {
            handleOpenModal("login");
            navigate("/");   
        }
         
       }, [])
       
  
   if (loading) {
              return null;
    }

  return <Outlet />;
}

export default ProtectedRoute

