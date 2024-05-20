import React, { useEffect, useState } from 'react';
import '../CSS/Scheme.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import { jsPDF } from "jspdf";
// import pdfjs from "pdfjs-dist/build/pdf";


const ApplicationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("scheme_id", id);
  // const {userId}=localStorage.getItem('status');
  const userId = JSON.parse(localStorage.getItem('status')).loginid;
  const [popupMessage, setPopupMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [download, setDownload] = useState(false);
  const [availability, setavailability] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    aadharnumber: '',
    phonenumber: '',
    // otp: '',
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
    const fileName = files[0].name;
    setFormData(prevState => ({
      ...prevState,
      [name]: fileName
    }));
  };

  const renderFormDataAsPDF = async (data) => {
    const doc = new jsPDF();
    let yPosition = 20;
    const pdfs = [];

    for (const [key, value] of Object.entries(data)) {
      if (key === "chitta" && value instanceof File) {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedarray = new Uint8Array(reader.result);
          const pdfDoc = await pdfjs.getDocument({ data: typedarray }).promise;
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const imageData = canvas.toDataURL("image/jpeg", 1.0);
            pdfs.push(new jsPDF({ format: [viewport.width, viewport.height] }).addImage(imageData, "JPEG", 0, 0));
          }
          if (pdfs.length > 0) {
            pdfs.forEach((pdf, index) => {
              if (index !== 0) {
                doc.addPage();
              }
              doc.addFileToVFS(`page${index + 1}.pdf`, pdf.output("arraybuffer"));
              doc.addImage(`page${index + 1}.pdf`, "PDF", 10, yPosition, 100, 100);
              yPosition += 110; // Adjust the spacing between pages
            });
            doc.save("form_data.pdf");
          }
        };
        reader.readAsArrayBuffer(value);
      } else {
        doc.text(`${key}: ${value}`, 10, yPosition);
        yPosition += 10;
      }
    }
  };



  // Function to review the application
  const reviewApplication = () => {
    renderFormDataAsPDF(formData);
  };

  // Function to handle form submission
  // console.log(formData.image.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name == null || formData.aadharnumber == null || formData.phonenumber == null || formData.dateofbirth == null || formData.image == null || formData.mailid == null || formData.pan == null || formData.age == null || formData.chitta == null) {
      alert('all data')
    }
    else {
      axios.post(`http://localhost:5000/applyscheme/${id}`, { formdata: formData, userid: userId },
        {  
          responseType: 'blob'
        })
        .then(res => {
          setMessage(res.data);
          // const blob = new Blob([res.data], { type: 'application/pdf' });
          // const url = window.URL.createObjectURL(blob);

          // const link = document.createElement('a'); link.href = url;
          // link.setAttribute('download', 'form_data.pdf');
          // document.body.appendChild(link);
          // link.click();

          // window.URL.revokeObjectURL(url);
          console.log(res);
        })
        .catch(err => { console.log(err) });

      console.log(formData.chitta);
      setPopupMessage(true);
    }
  };

  useEffect(() => {
    axios.post(`http://localhost:5000/checkscheme/${userId}`, { schemeid: id })
      .then(res => {
        console.log(res.data);
        if (res.data.result === true) {
          setavailability(true);
        }
        else {
          setavailability(false);
          setPopupMessage(true);
          setMessage('Already You Applied this Scheme.');
          console.log(popupMessage);
          console.log(message);
        }
      })
      .catch(err => console.log(err))
  }, [userId, id])


  useEffect(() => {
    if (popupMessage && download && (formData.applicationNumber === null || formData.applicationNumber === undefined)) {
      
      }
    }
  )
  // useEffect to handle any side effects
  useEffect(() => {
    if (popupMessage && download && (formData.applicationNumber === null || formData.applicationNumber === undefined)) {
      const updatedFormData = { ...formData, applicationNumber: '12asd2345erxs' };
      renderFormDataAsPDF(updatedFormData);
    }
  }, [download]);

  return (
    <div>
      {
        availability &&
        <div className="apply-form">
          <div className="headding">
            <h2>Fill out the form:</h2>
          </div>
          <form className='scheme-form'>
            <div className="form-group">
              <label htmlFor="field1">Name:</label>
              <input type="text" id="field1" name="name" value={formData.name} onChange={handleChange} placeholder='Enter your Name' required />
            </div>
            <div className="form-group">
              <label htmlFor="field2">Aadhar number:</label>
              <input type="text" id="field2" name="aadharnumber" value={formData.aadharnumber} onChange={handleChange} placeholder='Enter your Aadhar number' required />
            </div>
            <div className="form-group">
              <label htmlFor="field3">Phone number:</label>
              <input type="text" id="field3" name="phonenumber" value={formData.phonenumber} onChange={handleChange} placeholder='Enter your phone number' required />
            </div>
            <div className="form-group">
              <label htmlFor="field5">Mail ID:</label>
              <input type="text" name="mailid" value={formData.mailid} onChange={handleChange} placeholder='neter your mailid' required />
            </div>
            <div className="form-group">
              <label htmlFor="field6">Age:</label>
              <input type="text" name="age" value={formData.age} onChange={handleChange} placeholder='enter your age' required />
            </div>
            <div className="form-group">
              <label htmlFor="field7">Dtae-of-Birth :</label>
              <input type="date" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} placeholder='enter your date of birth' required />
            </div>
            <div className="form-group">
              <label htmlFor="field8">PAN Number :</label>
              <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder='enter your pan' required />
            </div>

            <div className="form-group">
              <label htmlFor="file1">Upload File 1:</label>
              <input type="file" id="file1" name="image" accept=".pdf,.docx" onChange={handleFileChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="file2">Upload File 2:</label>
              <input type="file" id="file2" name="chitta" accept=".pdf" onChange={handleFileChange} required />
            </div>
            <div className="btn">
              <button onClick={reviewApplication}>Review Your Application</button>
              <button type="submit" onClick={handleSubmit}>Submit</button>
            </div>
          </form>
        </div>

      }

      {popupMessage && availability && (
        <div className="popup">
          <p>{message}</p>
          <button id='download' onClick={() => setDownload(true)}>Download</button>
          <button id='close' className="popupbtn" onClick={() => { setPopupMessage(false); setDownload(false) }}>Close</button>
          <p>{download}</p>
        </div>
      )}
      {popupMessage && !availability && (
        <div className="popup">
          <p>{message}</p>
          {/* <button id='download' onClick={() => setDownload(true)}>Download</button> */}
          <button id='close' className="popupbtn" onClick={() => { setPopupMessage(false); setDownload(false); navigate('/schemehome') }}>Close</button>
          <p>{download}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
