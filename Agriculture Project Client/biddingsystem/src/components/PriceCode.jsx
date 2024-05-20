import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../CSS/PriceCode.css';

const PriceCode = ({ userid }) => {
    const { id } = useParams();
    const [products, setProducts] = useState({});
    const [bidDetails, setBidDetails] = useState({ highestbid: '' });
    const [makeBid, setMakeBid] = useState({ productId: '', userId: userid, price: '' });
    const [available, setAvailable] = useState(false);
    const [conformation, setConformation] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/checkbid/${id}/${userid}`)
            .then(res => {
                if (res.data.status === true) {
                    setAvailable(true);
                } else {
                    setAvailable(false);
                }
                console.log(res.data.status);
            })
            .catch(err => console.log(err))
    }, [userid, id])
    //get all product details 
    useEffect(() => {
        axios.get(`http://localhost:5000/getproductdetails/${id}`)
            .then(res => {
                console.log("get bid products details result", res.data);
                setProducts(res.data);
                setMakeBid({ ...makeBid, productId: res.data.id, price: res.data.startingPrice });
                console.log("make Bid ", makeBid);
            })
            .catch(err => {
                console.log("error from pricecode", err);
            })
    }, [id]);
    //for highest price from productbid table
    useEffect(() => {
        axios.get(`http://localhost:5000/getbiddetails/${id}`)
            .then(res => {
                if (res.data.previous === true) {
                    setBidDetails(res.data.answer);
                }
                else {
                    setBidDetails({ ...bidDetails, highestbid: products.price })
                }
                console.log("getbiddetails result", res.data);
                console.log("bid details", res.data);
            })
            .catch(err => { console.log('error', err); })
    }, [id, userid]);

    // const submitBid = () => {

    //     const bidPrice = parseFloat(makeBid.price);
    //     console.log(bidDetails.currentbid);
    //     const currentHighestBid = parseFloat(bidDetails.currentbid);

    //     console.log("bid price",bidPrice);
    //     console.log("current highesct bid",currentHighestBid);
    //     if (!isNaN(bidPrice) && !isNaN(currentHighestBid) && !isNaN(products.startingPrice)) {
    //         if (bidPrice > currentHighestBid && bidPrice > products.startingPrice) {
    //             axios.post('http://localhost:5000/addbid', makeBid)
    //                 .then(res => {
    //                     console.log("Bid added successfully",res.data);
    //                 })
    //                 .catch(err => {
    //                     console.error("Error submitting bid:", err);
    //                 });
    //             return;
    //         } else {
    //             alert(`Your bid must be higher than the current highest ${currentHighestBid ? currentHighestBid : products.startingPrice}`);
    //         }
    //     } else {
    //         alert("Please enter a valid bid price.");
    //     }
    // };

    const submitBid = () => {
        const bidPrice = parseFloat(makeBid.price);
        const currentHighestBid = parseFloat(bidDetails.currentbid);
        console.log(bidPrice);
        console.log(currentHighestBid);
        axios.post('http://localhost:5000/addbid', makeBid)
            .then(res => {
                console.log("addbid result", res.data);
                setConformation(res.data.message)
            })
            .catch(err => console.log("error from add bid", err))
    }
    return (
        <>

            <div className="pricecode">
                <div className="info">
                    <h3>{products.name}</h3>
                    <h3>{products.startingPrice}</h3>
                </div>
                <div className="price">
                    <input
                        type="number"
                        name="price"
                        id="price"
                        placeholder={bidDetails && bidDetails.price ? bidDetails.price.toString() : 'Enter your bid'}
                        value={makeBid.price}
                        style={{ width: '100%' }}
                        onChange={(e) => setMakeBid({ ...makeBid, price: e.target.value })}
                    />
                </div>
                <div className="btn">
                    <button onClick={submitBid}>Submit Bid</button>
                </div>
                <div className="warning">
                    <p>Your bidding price must be greater than margin price.</p>
                </div>
                <p id='values'></p>
                <p id='value1'></p>
            </div>
            {conformation && (
          <div className="popup" >
            <p>{conformation}</p>
            <button onClick={() => setConformation('')}>Close</button>
          </div>
        )}

        </>
    );
};

export default PriceCode;

