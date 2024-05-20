import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/LoginForm.css';
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";


const LoginForm = ({ passData, MakeStatus }) => {
  const [credentials, setCredentials] = useState({ mail: '', password: '' });
  const [password, setPassword] = useState(' ');
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState('');


  const bg = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/image/bg2.jpg)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    opacity: '0.8',
    width: '100vw'
  }

  const handleChange = (e) => {
    // console.log("clicked");
    setCredentials(({ ...credentials, [e.target.name]: e.target.value.toString() }));
  };

  const verify = (e) => {
    e.preventDefault();
    console.log(credentials);
    axios.post('http://localhost:5000/login', { mail: credentials.mail, password: credentials.password })
      .then(res => {
        setPassword(res.data);
        console.log("response from login", res.data.success);
        if (res.data.success) {

          if (localStorage.length == 0) {
            MakeStatus = true;
            localStorage.setItem('status', JSON.stringify({ loginid: res.data.userid, login: true }));
            setPopupMessage(res.data.message);
            navigate('/');

          }
          window.location.reload();
        }
        else {
          setPopupMessage(res.data.message);
        }
      })
      .catch(err => console.log("err in fetching data from server:", err));
  }

  return (
    <div className="loginformcont" style={{ ...bg,height:'100vh',overflow:'hidden' }}>
      <div className="loginform" style={{ margin: ' 30px auto', borderRadius: '10px' }}>
        <h2>Login</h2>
        <div className="icon-container">
          <MdOutlineEmail className="MdOutlineEmail icon" />
          <input
            type="text"
            name="mail"
            id="mail"
            placeholder="Enter Your Mail-Id"
            value={credentials.mail}
            onChange={handleChange} />
        </div>
        <div className="icon-container">
        <RiLockPasswordLine className="icon"/>
        <input
          type="password"
          name="password"
          id="keyword"
          placeholder="Enter Your Password"
          value={credentials.password}
          onChange={handleChange}
        />
        </div>
        
        <button className='verify' onClick={(e) => verify(e)}>Verify</button>
        <div className="forgetpassword">
          <Link to='/forgetpass'>Forget Password?</Link>
        </div>
        <div className="signUp">
          <Link to='/signup'>Don't have an account? Create An Account</Link>
        </div>
        {/* <p className='greet' id='greet'></p> */}
       
      </div>

    </div>
  );
};

export default LoginForm;
