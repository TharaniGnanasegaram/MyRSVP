import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import UserContext from './UserContext';


function AdminLogout() {

    const { logout } = useContext(UserContext);
  
    logout();

    const navigate = useNavigate();

    navigate('/');

}

export default AdminLogout;