// SchemeDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/SchemeDetail.css'

function SchemeDetail() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/scheme/${id}`)
      .then(res => {
        setScheme(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Scheme Detail</h1>
      {scheme && (
        <div className='scheme-detail'>
          <h2>{scheme.name}</h2>
          <p>{scheme.description}</p>
          <p>Eligibility Criteria: {scheme.eligibility_criteria}</p>
          <p>Application Deadline: {scheme.application_deadline}</p>
        </div>
      )}
    </div>
  );
}

export default SchemeDetail;
