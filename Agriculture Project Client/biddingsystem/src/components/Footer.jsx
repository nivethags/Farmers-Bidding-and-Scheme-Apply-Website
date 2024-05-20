import React from "react";
import '../CSS/Footer.css';
import {Link} from 'react-router-dom';
const Footer=()=>{
return(
    <div className="footer"  style={{position:'relative',top:'100%'}}>
        <h4 className="foot-heading">
            Quick Links
        </h4>
        <div className="link">
            <Link to='/main' className="links">Go To Main Page</Link>
            <Link to='/market' className="links">Display Current Bidding Products</Link>
        </div>
    </div>
)
}
export default Footer