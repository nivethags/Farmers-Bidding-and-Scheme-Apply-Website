import { useEffect, useState } from 'react';
import '../CSS/FirstMainPage.css'
import Advantage from './Advantage';
import LimitItems from './LimitItems';
import { Link } from 'react-router-dom';
import ContactUs from './ContactUs';


const FirstMainPage = () => {
    const bg = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/image/bg2.jpg)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        opacity: '0.8',
        width: '100vw',
    }

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
    const [numberOfProducts, setNumber] = useState(0);

    useEffect(() => {
        function handleResize() {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {


        if (windowSize.width >= 1044 && windowSize.width < 2000) {
            setNumber(2 * 4);
        } else if (windowSize.width <= 913 && windowSize.width > 540) {
            setNumber(2 * 3);

        } else if (windowSize.width <= 540) {
            setNumber(2 * 2);
        }


    }, [windowSize]);
    // console.log("number",numberOfProducts);

    //412 ----> navigation bar media Query
    return (
        <>
            <div className="mainpage">
                <div className="headers" style={{ ...bg, display: "flex", flexDirection: 'column', rowGap: '40px', width: '100%', alignItems: 'center' }}>
                    <h1 style={{ color: 'rgb(183, 0, 255)' }}>
                        Warm Welcome to All Farmers And Consumers
                    </h1>
                    <div className="header-cont" id="header-cont" style={{ display: 'flex', columnGap: '20px', justifyContent: 'space-evenly', alignItems: 'center', textAlign: 'center' }}>
                        <h4 className='description' id='description' style={{ color: 'rgb(214, 184, 50)', fontSize: '30px', backgroundColor: 'tranparent' }}>"Harvest Hub: Empowering Farmers, Connecting Buyers - Your Ultimate Bidding Platform!" </h4>
                        <img src={process.env.PUBLIC_URL + '/image/bid.png'} alt="biddingimage" className="bidimg" style={{ height: '300px', width: '300px', alignContent: 'center' }} />
                    </div>
                </div>
            </div>

            <div className="two" >
                {/* <BidItemDisplay className='two-cont'  /> */}
                <LimitItems className='two-cont' count={numberOfProducts} />
                <Link to='/market?type=all' style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10%' }} >More products</Link>
            </div>

            <div className="features">
                <Advantage />
            </div>
            <div className="contact-us">
                <ContactUs />
            </div>
        </>

    )
}
export default FirstMainPage;