import React, { useState } from 'react'
import '../CSS/Advantage.css';
import image1 from '../images/userfriendly.png';
import price from '../images/price.png';
import notify from '../images/notif.png';
import collabrate from '../images/collabrate.png';
const Advantage = () => {

    const [feature, setFeature] = useState([{ imagepath: `${image1}`, content: 'User Friendly' }, { imagepath: `${price}`, content: 'Transparent Pricing' }, { imagepath:`${notify}`, content: 'Customizable Notifications' }, { imagepath: `${collabrate}`, content: 'Collaborative Opportunities' }])

    return (
        <div className='ad'>
            <h1>Benifits of This Website</h1>
            <div className="each-item">
                {
                    feature.map((item, index) => (
                        <div className="advantage" key={index}>
                            <div className="feat-img">
                                <img className='feat-img'src={item.imagepath} alt={index} />
                            </div>
                            <div className="feat-cont">
                                <p>
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Advantage
