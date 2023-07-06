import React from 'react'
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import EventPortal from "./EventsPortal";
import RsvpEvent from "./Event";
import AdminLogout from './Logout';


function PageRoutes() {

    const userId = localStorage.getItem('rsvpuserId');

    return (
        <Routes>
            <Route path='/' element={<AdminLogin />} />
            <Route path='/events' element= {userId ? <EventPortal /> : <AdminLogin /> } />
            <Route path='/events/:eventid/:customname' element={<RsvpEvent />} />
            <Route path='/logout' element={<AdminLogout />} />
        </Routes>

    )
}

export default PageRoutes;