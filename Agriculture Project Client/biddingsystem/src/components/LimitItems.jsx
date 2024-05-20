import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../CSS/BidItemDisplay.css';
import PriceCode from "./PriceCode";

const LimitItems = ({ count }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const startBid = (index, e) => {
        e.preventDefault();
        // navigate(`/product/${index + 1}/code`);
        navigate(`/product/${products[index].id}`); 

    };

    useEffect(() => {
        axios.post('http://localhost:5000/getlimitprd', { numberOfProducts: count })
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => console.log("Error:", err));
    }, [count]);

    return (
        <div>
            <h1>Products</h1>
            <div className="products">
                {products.map((item, index) => (
                    <div className="single" id="single" key={index}>
                        <div className="img">
                            <img src={`http://localhost:5000/` + item.image}/>
                            </div>
                        <div className="details">
                            <div className="name">
                                <h2>{item.name}</h2>
                            </div>
                            <div className="sub">
                                <h3><p>price</p>{item.startingPrice}</h3>
                                <h3><p>quantity</p>{item.quantity}</h3>
                            </div>
                            <NavLink to='/code' className='makeuseit' onClick={(e) => { startBid(index, e) }}>Make Use It</NavLink>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// prisma 
// nest.js
//postgrade
//

//productname
//price


//buyer
export default LimitItems;