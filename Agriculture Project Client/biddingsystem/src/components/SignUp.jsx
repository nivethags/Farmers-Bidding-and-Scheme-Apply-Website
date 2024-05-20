import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
import '../CSS/SignUp.css';

const SignUp = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [popupMessage, setPopupMessage] = useState('');

    const bg = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/image/bg2.jpg)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        opacity: '0.8',
        width: '100vw',
        height:'100vh'
    }

    const handleSubmit = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const createAccount = (e) => {
        e.preventDefault();
        if (user.name === '' || user.email === '' || user.password === '') {
            setPopupMessage("Please Enter Valid Data");
        }
        else {
            axios.post('http://localhost:5000/createacc', {
                userdata: { name: user.name, mail: user.email, password: user.password }
            })
                .then((res) => {
                    setPopupMessage(res.data);
                })
                .catch((err) => {
                    console.log("error from client access", err.stack);
                });
        }

    }

    return (
        <div className="signup" style={{ ...bg, width: '100vw', position: 'relative'}}>
            <div className="signup-form">
                <h1 className="sub-heading">Signup</h1>
                <div className="icon-container">
                    <CiUser  className="icon"/>
                    <input type="text" name="name" id="name" placeholder="Enter Your Name" style={{ marginTop: '10px' }} value={user.name} onChange={handleSubmit} />
                </div>
                <div className="icon-container">
                    <MdOutlineEmail className="MdOutlineEmail icon" />
                    <input type="email" name="email" id="mail" placeholder="Enter Your Email-Id" value={user.email} onChange={handleSubmit} />

                </div>
                <div className="icon-container">
                    <RiLockPasswordLine className="icon" />
                    <input type="password" name="password" id="pass" placeholder="Enter Your Password" value={user.password} onChange={handleSubmit} />

                </div>
                <button type='button' className='create' onClick={createAccount}>Create Account</button>
            </div>
            {popupMessage && (
                <div className="popup" >
                    <p>{popupMessage}</p>
                    <button onClick={() => setPopupMessage('')}>Close</button>
                </div>
            )}
        </div>
    );
}

export default SignUp;
