import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/SchemeHome.css';

function ScehemeHome() {
    const [schemes, setSchemes] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/schemes')
            .then(res => {
                console.log(res.data);
                setSchemes(res.data)
            })
            .catch(err => console.log(err))

    }, []);

    return (
        <div className="container">
            <h1 className="title">Schemes</h1>
            {schemes.map((scheme) => (
                <div className="scheme-item" key={scheme.id}>
                    <h2 className="scheme-name">{scheme.name} </h2>
                    <p className="scheme-description" >{scheme.description}</p>
                    <div className="apply-detaile"  >
                        <div className="eligibility">
                            <h4>Eligibility Critiria</h4>
                            <p className="scheme-eligibility">{scheme.eligibility_criteria}</p>
                        </div>
                        <div className="dead-line">
                            <p className="scheme-deadline">Application Deadline: {scheme.application_deadline}</p>
                            <button className='apply-btn' onClick={()=>{navigate(`/apply/${scheme.id}`)}} >Apply</button>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default ScehemeHome;