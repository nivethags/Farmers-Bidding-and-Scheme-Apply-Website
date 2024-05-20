import React from 'react';
import { useState } from 'react';
import '../CSS/BuyerDetail.css';
import {Link} from 'react-router-dom'
import { BsEmojiSmileFill } from "react-icons/bs";
import { BsAwardFill } from "react-icons/bs";


const BuyerDetail = () => {

    const [buyer, setBuyer] = useState([
        { name: 'Lakshmi', mail: 'lakshmi@gmail.com', phno: '9150453376',prdname:'Passion Fruit' },
        { name: 'Sathish', mail: 'sathishlakshmi@gmail.com', phno: '9150671410',prdname:'Lychee' },
        { name: 'Sudharsan', mail: 'sudharsansudhar@gmail.com', phno: '9092394965', prdname:'Mango'},
        { name: 'Nivetha', mail: 'nivethagslakshmi@gmail.com', phno: '9786188392',prdname:'Rice' }
    ]);

    return (
        <div className="buyer-container">
            <span><BsEmojiSmileFill className='cus-icon' />
            <BsAwardFill className='cus-icon' />
</span>
<p>Here Your Customer Details</p>

            <table className="buyer-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Product Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {buyer.map((item, index) => (
                        <tr key={index} className="buyer-row">
                            <td>{item.name}</td>
                            <td>{item.mail}</td>
                            <td>{item.phno}</td>
                            <td><Link to=''>{item.prdname}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BuyerDetail;
