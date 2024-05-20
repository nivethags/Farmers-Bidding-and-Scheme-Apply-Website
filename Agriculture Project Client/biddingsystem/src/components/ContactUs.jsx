import React from 'react'
import '../CSS/ContactUs.css'
import { useState } from 'react'
import axios from 'axios'
const ContactUs = () => {

    const [contactData,setContactData]=useState({name:'',usermail:'',message:''})

    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:5000/contactus',contactData)
        .then(res=>{console.log(res)})
        .catch(err=>console.log(err))
    }

    return (
        <div className="contact-page">
            <div className='info'>
                <h2>Contact Us</h2>
                <p>Feel free to reach out to us using the contact form below:</p>
            </div>

            <div className='contact-form'>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={contactData.name} onChange={(e)=>{setContactData({...contactData,name:e.target.value})}}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={contactData.usermail} onChange={(e)=>{setContactData({...contactData,usermail:e.target.value})}} />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" rows="4" value={contactData.message} onChange={(e)=>{setContactData({...contactData,message:e.target.value})}}></textarea>
                </div>
                <button type="submit" onClick={handleSubmit}>Send</button>
            </div>
        </div>
    )
}

export default ContactUs
