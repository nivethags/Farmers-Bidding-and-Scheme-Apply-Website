import React from "react";
import {Link} from 'react-router-dom';
import '../CSS/NavBar.css'
const NavBar=()=>{
    return(
        <div className="main-navbar">
            <Link to='/' className="navopt"> DashBoard</Link>
            <Link to='/schemehome'>Schemes</Link>
            <Link to='/market' className="navopt">Marketing</Link>
            <Link to='/contact' className="navopt">ContactUs</Link>
           
        </div>
    )
}
export default NavBar;