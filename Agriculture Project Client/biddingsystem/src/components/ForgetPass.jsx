import React, { useState } from 'react';
import axios from 'axios';
// import '../CSS/ForgetPassword.css'

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`http://localhost:3000/forgetpassword`, { email })
      .then((res) => {
        setMessage(res.data);
        console.log(email);
      })
      .catch((err) => {
        console.log(err);
        setMessage('Failed to send reset password instruction', err);
      })
  };

  return (
    <div className='forgetpass'>
      <h2>Forget Password</h2>
      <div>
        <h4>email</h4>          
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPass;
