import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/ProductDetailsPage.css';
import Timer from './Timer';
import Time from './Time';

const ProductDetailsPage = ({type}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const bg = {
    backgroundImage: 'url("https://t3.ftcdn.net/jpg/07/76/27/84/240_F[_776278497_eFKVAtJARxgjUTCcwCX3CkzkZP98dL9C.jpg")',
    backgroundSize: 'cover',
    // backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    // opacity:'0.8',
    width: '100vw'
 }
  useEffect(() => {
    axios.get(`http://localhost:5000/productss/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error(error.stack);
      });
  }, [id]);

  const handleEvent = () => {
    console.log("navigating code page" + id);
    navigate(`/product/${id}/code`);
  }
  return (

    <div className='details' style={{...bg}}>
      <h2>Product Details</h2>
      {product ? (
        <div className='product-detail'>
          <div className="description">
            <div className="img-dis">
              <img id="product-img" className='product-img' src={`http://localhost:5000/` + product.image} alt={product.id} />
            </div>
            <div className="detail">
              <table>
                <tr>
                  <td><span className='p-d'> Product Name: </span></td>
                  <td>{product.name}</td>
                </tr>
                <tr>
                  <td><span className='p-d'> Product Price:</span></td>
                  <td>{product.startingPrice}</td>
                </tr>
                <tr>
                  <td><span className='p-d'> Product Quantity:</span></td>
                  <td>{product.quantity}</td>
                </tr>
              </table>
            </div>

          </div>
          <div className="timer">
            <Time prdid={product.id} />
          </div>
          
          <div className="code-btn">
            <button className='makecode' onClick={handleEvent}>Make Code</button>
          </div>
        </div>


      ) : (
        <p>Loading...</p>
      )}

    </div>

  );
};

export default ProductDetailsPage;
