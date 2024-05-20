import React from 'react'
import { Routes,Route, Outlet } from 'react-router-dom';
// import '../CSS/Profile.css'
// import '../CSS/ProfileNavBar.css'
import ProfileNavBar from './ProfileNavBar';

const ProfileMain = () => {
  return (
    <div>
       <div className="navbar" style={{display:'flex',marginLeft:'80px'}}>
            <ProfileNavBar className="sub-navbar"  />
          </div>
          <div className="routes">
           <Outlet></Outlet>
          </div>
    </div>
  )
}

export default ProfileMain
