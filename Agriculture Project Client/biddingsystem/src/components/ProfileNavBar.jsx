import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../CSS/ProfileNavBar.css';

const ProfileNavBar = ({auth,mailid,secretkey}) => {

    const menu_icon = document.getElementById('menu-icon');
    const [isRotated, setIsRotated] = useState(false);
    const [temp,setTemp]=useState("abcd");

    const [prop,setProp]=useState({propidentity:auth,propmailid:mailid,propsecretkey:secretkey});
    const handleRotate = () => {
        setIsRotated(!isRotated);
        if (isRotated) {
            menu_icon.style.transform = 'rotate(180deg)';
        }
        if(!isRotated){
            const element=document.getElementsByClassName('icon');
            // menu_icon.style.padding='10px';
            menu_icon.style.paddingTop='-20px';

            for(var i=0;i<element.length;i++){
                element[i].style.padding='10px';
                // element[i].style.border='1px solid black'
            }
        }
    };
    // console.log("profilenavbar log");
    // console.log("prop",prop);

    return (
        <div className="ProfileNavBar">
            <FontAwesomeIcon icon={faArrowRight} id='menu-icon' className='arrow-icon' style={{ transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)', position: 'relative', left: isRotated ? '0px' : '-40px' }} onClick={handleRotate} />
            <div className="navbar" >
                <div className="product" >
                    <Link to='/code' id="products">
                        <FontAwesomeIcon icon={faShopify} style={{ display: isRotated ? 'block' : 'none' }} className="icon" />
                        <span style={{ display: isRotated ? 'none' : 'inline' }}>Order</span>
                    </Link>
                </div>
                <div className="addproducts" >
                    <Link to='/editprofile' id="products"  >
                    {/* <Link to='/editprofile' id="products"> */}
                        <FontAwesomeIcon icon={faPlus} style={{ display: isRotated ? 'block' : 'none' }} className="icon"/>
                        <span style={{ display: isRotated ? 'none' : 'inline' }}>Edit Profile</span>
                    </Link>
                </div>
                <div className="orders">
                    <Link to='/market?type=editproduct' id="editproduct">
                    <FontAwesomeIcon icon={faArrowRight} style={{ display: isRotated ? 'block' : 'none' }} className="icon"/>
                        <span style={{ display: isRotated ? 'none' : 'block' }}>Edit Product
                        </span>
                    </Link>
                </div>
                <div className="alpha" >
                    <Link to='/bidform' id="alpha" >
                    <FontAwesomeIcon icon={faArrowRight} style={{ display: isRotated ? 'block' : 'none' }} className="icon" />
                       <span style={{ display: isRotated ? 'none' : 'block' }}>Add Products</span>
                       </Link>
                </div>
                <div className="alpha" >
                    <Link to='/buyerdetail' id="alpha" >
                    <FontAwesomeIcon icon={faArrowRight} style={{ display: isRotated ? 'block' : 'none' }} className="icon" />
                       <span style={{ display: isRotated ? 'none' : 'block' }}>Buyer Detail</span>
                       </Link>
                </div>
            </div>
        </div>
    )
}
export default ProfileNavBar;