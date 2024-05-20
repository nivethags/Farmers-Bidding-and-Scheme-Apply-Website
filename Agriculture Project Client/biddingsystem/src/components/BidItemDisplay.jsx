import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../CSS/BidItemDisplay.css'

const BidItemDisplay = ({ userid,setPrdID }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    const [showButton, setShowButton] = useState(false);

    var apiUrl = '';

    const viewCustomer = (index,e) => {
        e.preventDefault();
        console.log(products[index].id); 
        setPrdID(products[index].id) 
    }


    useEffect(() => {
        if (type === 'ownership') {
            apiUrl = `http://localhost:5000/ownerproduct/${userid}`;
        } else if (type === 'buyer') {
            apiUrl = `http://localhost:5000/buyerproduct/${userid}`;
        } else if (type === 'editproduct') {
            apiUrl = `http://localhost:5000/editproduct/${userid}`;
        }
        // else if(type==='viewcustomer'){
        //     navigate('')
        //     const apiUrl = `http://localhost:5000/viewcustomer/${userid}/${prdID}`;
        // }
        else {
            apiUrl = `http://localhost:5000/getallprd/${userid}`;
        }

        
        if (type === 'editproduct' || type === 'ownership') {
            setShowButton(true);
        }


        axios.get(apiUrl)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                    console.log("response from products", res.data);
                } else {
                    console.error('Response data is not an array:', res.data);
                }
            })
            .catch(err => {
                console.log("Error fetching products: ", err);
            });
    }, [type, userid]);


    const startBid = (index, e) => {
        e.preventDefault();
        // setProductId(index);
        axios
            .get(`http://localhost:5000/product-time/${products[index].id}`)
            .then(res => {
                if (res.data.currenttime !== 0 && type !== 'editproduct') {
                    navigate(`/product/${products[index].id}`);
                }
                else if (res.data.currenttime !== 0 && type === 'editproduct') {
                    navigate('/')
                }
                else {
                    navigate('/confirmation');
                }
            })
    };

    return (
        <div className="biditemdisplay">
            <h1>Products</h1>
            <div className="products">
                {products.map((item, index) => (
                    <div className="single" id="single" key={index}>
                        <div className="img">
                            <img src={`http://localhost:5000/` + item.image} alt={item.image} />
                        </div>
                        <div className="details">
                            <div className="name">
                                <h2>{item.name}</h2>
                            </div>
                            <div className="sub">
                                <h3><p>Price</p>{item.startingPrice}</h3>
                                <h3><p>Quantity</p>{item.quantity}</h3>
                            </div>
                            <div className="button" style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                <NavLink to='/code' className='makeuseit' id='makeuseit' onClick={(e) => startBid(index, e)}>Make Use It</NavLink>
                                {showButton &&
                                    (
                                        < div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                                            <NavLink to=' ' className='editproduct' id='editproduct'>editproduct</NavLink>
                                            <NavLink to='/viewcustomer' className='displayUser' id='checkUser' onClick={viewCustomer}>View Cust</NavLink>
                                        </div>

                                    )
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BidItemDisplay;
