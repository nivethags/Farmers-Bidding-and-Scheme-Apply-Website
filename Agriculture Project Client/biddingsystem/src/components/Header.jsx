import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../CSS/Header.css'
import SearchBar from "./SearchBar";
import '../CSS/SearchBar.css';
import NavBar from "./NavBar";

const Header = (props) => {
    const [login, setLogin] = useState(props.login);

    const logout = () => {
        localStorage.removeItem('status');
        window.location.reload();
    }

    return (
<div className="header-container" style={{display:'flex',flexDirection:'column'}}>
<header className="header">
            <div className="h1">
                <h1 className="heading">AgriConnect</h1>
            </div>
            <div className="serachbar">
                <SearchBar />
            </div>
            <div className="entry">
                {login ? (
                    <div className="after-login" style={{display:'inline-flex',justifyContent:'center',alignItems:'center',columnGap:'20px'}} >
                        <Link to='/profile'> <div className="pro-img" /> </Link>
                        <Link to ="/" onClick={logout}>logout</Link>
                    </div>


                ) : (
                    <Link to="/login">Login</Link>
                )}

            </div>
        </header>
        <NavBar/>

</div>
        
    )
}

export default Header;
