import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import '../CSS/Scheme.css';
import axios from 'axios';

const Scheme = () => {
    const [popupMessage, setPopupMessage] = useState(false);
    const [download, setDownload] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        aadharnumber: '',
        phonenumber: '',
        otp: '',
        mailid: '',
        age: '',
        dateofbirth: '',
        pan: '',
        image: null, // Store selected file for image
        chitta: null // Store selected file for chitta
    });

    const handleChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // Function to handle file input change
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files[0] // Get the first file from the selected files
        }));
    };

    // Function to render form data as PDF
    const renderFormDataAsPDF = async (data) => {
        const doc = new jsPDF();
        let yPosition = 20;

        for (const [key, value] of Object.entries(data)) {
            doc.text(`${key}: ${value}`, 10, yPosition);
            yPosition += 10;
        }

        doc.save('form_data.pdf');
    };

    // Function to review the application
    const reviewApplication = () => {
        renderFormDataAsPDF(formData);
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("clicking");
        console.log(popupMessage);
        setPopupMessage(true);
    };

    // useEffect to handle any side effects
    useEffect(() => {
        if (popupMessage && download && (formData.applicationNumber === null || formData.applicationNumber === undefined)) {
            const updatedFormData = { ...formData, applicationNumber: '12asd2345erxs' };
            renderFormDataAsPDF(updatedFormData);
        }
    }, [download]);

    // Axios request to apply scheme
    useEffect(() => {
        axios.get(`http://localhost:5000/applyscheme/${formData}`)
            .then(res => { console.log('successfully Scheme Applied') })
            .catch(err => { console.log(err) });
    }, [formData]); // Trigger the Axios request whenever formData changes

    return (
        <div>
            <h2>Fill out the form:</h2>
            <form className='scheme-form'>
                {/* Other input fields */}
                <div className="form-group">
                    <label htmlFor="field1">Name:</label>
                    <input type="text" id="field1" name="name" value={formData.name} onChange={handleChange} placeholder='Enter your Name' />
                </div>
                <div className="form-group">
                    <label htmlFor="field2">Aadhar number:</label>
                    <input type="text" id="field2" name="aadharnumber" value={formData.aadharnumber} onChange={handleChange} placeholder='Enter your Aadhar number' />
                </div>
                <div className="form-group">
                    <label htmlFor="field3">Phone number:</label>
                    <input type="text" id="field3" name="phonenumber" value={formData.phonenumber} onChange={handleChange} placeholder='Enter your phone number' />
                </div>
                <div className="form-group">
                    <label htmlFor="field4">OTP:</label>
                    <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder='enter OTP' />
                </div>
                <div className="form-group">
                    <label htmlFor="field5">Mail ID:</label>
                    <input type="text" name="mailid" value={formData.mailid} onChange={handleChange} placeholder='neter your mailid' />
                </div>
                <div className="form-group">
                    <label htmlFor="field6">Age:</label>
                    <input type="text" name="fage" value={formData.age} onChange={handleChange} placeholder='enter your age' />
                </div>
                <div className="form-group">
                    <label htmlFor="field7">Dtae-of-Birth :</label>
                    <input type="text" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} placeholder='enter your date of birth' />
                </div>
                <div className="form-group">
                    <label htmlFor="field8">PAN Number :</label>
                    <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder='enter your pan' />
                </div>

                <div className="form-group">
                    <label htmlFor="file1">Upload File 1:</label>
                    <input type="file" id="file1" name="image" accept=".pdf,.docx" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="file2">Upload File 2:</label>
                    <input type="file" id="file2" name="chitta" accept=".pdf" onChange={handleFileChange} />
                </div>
                <div className="btn">
                    <button onClick={reviewApplication}>Review Your Application</button>
                    <button type="submit" onClick={handleSubmit} style={{padding:'10px'}}>Submit</button>
                </div>
            </form>
            {/* Popup message */}
            {popupMessage && (
                <div className="popup">
                    <p>{popupMessage}</p>
                    <button id='download' onClick={() => setDownload(true)}>Download</button>
                    <button id='close' className="popupbtn" onClick={() => { setPopupMessage(false); setDownload(false) }}>Close</button>
                    <p>{download}</p>
                </div>
            )}
        </div>
    );
};

export default Scheme;
