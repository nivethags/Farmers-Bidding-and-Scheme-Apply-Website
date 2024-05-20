  import React, { useEffect, useState } from 'react'
  import { Link } from 'react-router-dom'
  import axios from 'axios';
  import '../CSS/Profile.css'
  import avatar from '../images/avatar.png'
  import ProfileNavBar from './ProfileNavBar';

  function Profile({ userid }) {

    const [profile, setProfile] = useState(null);

    const [details, setDetails] = useState({ prd_count: '',buyerCount:'' });

    const [userData, setUserData] = useState(null);

    useEffect(() => {
      axios.get(`http://localhost:5000/getuserdata/${userid}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error('Network response was not ok');
          }
          setProfile(res.data.image);
          setUserData(res.data);
        })
        .catch((err) => {
          console.log("error", err.stack);
        })
    }, [userid])

// console.log("userdata",userData);
    useEffect(() => {
      axios.get(`http://localhost:5000/countprd/${userData && userData.id}`)
        .then(res => {
          setDetails({ ...details, prd_count: res.data.prdCount });
        })
        .catch(error => {
          console.error('Error fetching prd  count:', error);
        });
    }, [userData])

    useEffect(()=>{
      axios.get(`http://localhost:5000/buyerdetail/${userid}`)
      .then(res=>{console.log(res.data.buyer_count);
        setDetails({...details,buyerCount:res.data.buyer_count})
      })
      .catch(err=>console.log(err))
    },[userid])

    const handleProfileChange = (e) => {
      if (e.target.files.length > 0) {
        setProfile(e.target.files[0]);
      }
    };
    
    useEffect(() => {
      const profilepic = document.getElementById('profile');
      if (profile && profilepic) {
          const imageUrl = profile.replace(/\\/g, '/');
          profilepic.src = `http://localhost:5000/${imageUrl}`;
      }
      return () => {
          if (profile) {
              URL.revokeObjectURL(profile);
          }
      };
  }, [profile]);

    return (
      <div className='profile-page'>
        {userData?

          <div className='pro-main'>
            <div className="navbar" >
              <ProfileNavBar className="sub-navbar" />
            </div>
            <div className='main-pro'>
              <div className="profile">
                <img src={profile||avatar} alt="pro_img" id='profile' />
                <div className="round">
                  <input type="file" title='chooce profile' name="profile_img" id="profile_img" className='profile_img' accept="image/*" onChange={handleProfileChange} />
                  <div className='img_icon' ></div>
                </div>
                <div className="name">
                  <h2>{userData.name}</h2>
                </div>
                <div className='des'>
                  <div className="owner">
                    <h4>{details.prd_count} </h4>
                    <h5>Ownership Products</h5>
                  </div>
                  <div className="user">
                      <h4>{details.buyerCount}</h4>
                    <h5>Buyer Products</h5>
                  </div>
                </div>
              </div>
              <div className="description">
                <div className="owner">
                  <p>Ownership Product Count:</p>
                  <p>{details.prd_count} </p>
                </div>
                <div className="user">
                  <p>Buyer Product Count :</p>
                  <p>{details.buyerCount}</p>
                </div>
                <div className="owner-prd">
                  <p>ownership Products: </p>
                  <Link to='/market?type=ownership'>Click Here !</Link>
                </div>
                <div className="buyer-prd">
                  <p>Buyer Products:</p>
                  <Link to='/market?type=buyer'>Click Here !</Link>
                </div>
                <div className="displayalprd">
                  <p>Display All Products</p>
                  <Link to='/market?type=all'>Click Here !</Link>
                </div>
                <div className="add-prd">
                  <p>Out Dated Products</p>
                  <Link to='/expired' >Click Here !</Link>
                  {/* {ownerid ? ownerid.mail : "not available"}
                      {username ? username : "not available"} */}
                </div>
              </div>
            </div>
          </div>

          :
          (
            <div className='lo gin-message'>
              <p className="blink">Please Login To Enter Into Profile </p>
              <Link to='/login'> Login </Link>
            </div>
            // {props.login && <EditProfile auth={username} mailid={mail} secretkey={ownerid.password} />}  
          )
          
        }
      </div>
    )
  }

  export default Profile
