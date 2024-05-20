import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import '../CSS/BidForm.css'
const BidForm = ({ userid }) => {
    const [product, setProduct] = useState({ image: null, prdname: '', prdprice: '', prdquantity: '', timer: 0, owner: userid });
    const [count, setCount] = useState(false);
    const [status, setStatus] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const formData = new FormData();

    const addProduct = (e) => {
        e.preventDefault();

        if (product.image === null || product.prdname === '', product.prdprice === '', product.prdprice === '') {
            // con.innerHTML = 'please enter All Data';
            setPopupMessage('please enter All Data');

        }
        else if (product.timer === 0) {
            // con.innerHTML = 'please select time otherwise it will consider as 1 day';
            setPopupMessage('please select time otherwise it will consider as 1 day');
            setProduct({ ...product, timer: 1 });
        }

        else {
            formData.append('prdname', product.prdname);
            formData.append('image', product.image);
            formData.append('prdprice', product.prdprice);
            formData.append('prdquantity', product.prdquantity);
            formData.append('timer', product.timer);
            formData.append('owner', product.owner);
            console.log("image value", product.image);
            axios.post('http://localhost:5000/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    // con.innerText = res.data;
                    setPopupMessage(res.data);
                    setCount(true);
                    setStatus(true);

                })

                .catch(err => {
                    if (err.response && err.response.status === 409) {
                    }
                    if (product.image !== null && product.image !== undefined) {
                        console.log("image sent");
                    } else {
                        console.log("image is not sent");
                    }
                    console.log("err for post", err);
                })

        }

    };

   

    return (
        <>
            {
                userid ?
                    <div className="bidform">
                        <div className="form">
                            <div className="img-btn">
                                {product.image ? (
                                    <img className='imgs' src={URL.createObjectURL(product.image)} alt="Selected" />
                                ) : (
                                    <img className='imgs' id='imgs' src='' alt="Select Image" />
                                )}
                                <input type='file' alt="image" onChange={e => setProduct({ ...product, image: e.target.files[0] })} />
                            </div>
                            <div className="prddata">
                                <input type="text" name="pname" id="pname" placeholder="enter your product name" required value={product.prdname} onChange={(e) => { setProduct({ ...product, prdname: (e.target.value) }) }} />
                                <input type="number" name="price" id="price" placeholder="Enter Your Margin Amount" required value={product.prdprice} onChange={(e) => { setProduct({ ...product, prdprice: (e.target.value) }) }} />
                                <input type="number" name="quantity" id="quantity" placeholder="Enter Youur Product Quantity" required value={product.prdquantity} onChange={(e) => { setProduct({ ...product, prdquantity: (e.target.value) }) }} />
                                <input type="number" name="timer" id="timer" placeholder="Enter timer value (in days)" required value={product.timer} onChange={(e) => { setProduct({ ...product, timer: parseInt(e.target.value) }) }} />
                                <button onClick={addProduct} style={{width:'fitContent',padding:'10px'}} >Add Bid</button>
                                {/* <div className="conformation-container">
                                    <p id='conformation'></p>
                                </div> */}
                            </div>
                            {popupMessage && (
                                <div className="popup" >
                                    <p>{popupMessage}</p>
                                    <button onClick={() => setPopupMessage('')} className="popupbtn">Close</button>
                                </div>
                            )}
                            {/* <input type="text" name="prdid" id="prdid" value={idvalue} readOnly /> */}

                        </div>
                        {/* const [product, setProduct] = useState({ image: null, prdname: '', prdprice: '', prdquantity: '', timer: 0, owner: userid }); */}

                    </div>
                    :
                    <div className='login-message'>
                        <p className="blink">Please Login To Enter Into Profile </p>
                        <Link to='/login'> Login </Link>
                    </div>

            }
        </>
    )
}
export default BidForm;