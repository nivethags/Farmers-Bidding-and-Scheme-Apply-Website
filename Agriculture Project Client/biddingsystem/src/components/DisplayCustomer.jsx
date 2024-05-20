import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayCustomer = () => {
  const [customerData, setCustomerData] = useState([]);
  const [error, setError] = useState('');
  const productId='07b30ee9-5fbb-4c27-9f11-ba99970d7c92';

  useEffect(() => {

    axios.get(`http://localhost:5000/productbid/${productId}`)
      .then((res) => {
        setCustomerData(res.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
        setError('Error fetching customer data');
        console.log(error);
      })
    }, [productId]);



// if (error) {
//   return <div>Error: {error}</div>;
// }

return (
  <div>
    <h1>Customer Details for Product ID: {productId}</h1>
    {customerData.map((customer, index) => (
      <div key={index}>
        <p>Customer ID: {customer.id}</p>
        <p>Product ID: {customer.productid}</p>
        <p>User ID: {customer.userid}</p>
        <p>Current Bid: {customer.currentbid}</p>
        <p>Username: {customer.name}</p>
        <hr />
      </div>
    ))}
  </div>
);
};

export default DisplayCustomer;
