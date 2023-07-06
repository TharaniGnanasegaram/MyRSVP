import React from 'react'
import { BrowserRouter } from "react-router-dom";
import PageRoutes from "./PageRoutes";


function Menus() {

    return (
        <BrowserRouter>
            <div>

                <div class="titleHeadingStyle">
                    <img id="logoimg" src="/myrsvp.jpg" ></img> 
                </div>

                <PageRoutes />

            </div>
        </BrowserRouter>

    )
}

export default Menus;