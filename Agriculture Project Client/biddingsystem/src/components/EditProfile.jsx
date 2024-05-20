import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/EditProfile.css';
import avatar from '../images/avatar.png'

const EditProfile = ({ userid }) => {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState({ firstname: '', lastname: '' });
    const [userdata, setUserData] = useState({ fullname: '', password: '', mail: '', image: null });
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [emailConfirmation, setEmailConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [defaultImage, setDefaultImage] = useState(null);
    // const [profileUpdate, setUpdate] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/getuserdata/${userid}`)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                const userData = res.data;
                setName({ firstname: userData.name, lastname: '' });
                // this is not implemented ( 'if  am not select the profile image it passing null value ' )
                if (userData.image !== null) {
                    setProfile(`http://localhost:5000/` + res.data.image);
                    setDefaultImage(res.data.image);
                    setUserData({ ...userdata, image: userData.image })

                }
                else {
                    setProfile(res.data.image);
                    setDefaultImage(res.data.image);

                }
                setUserData({ fullname: userData.firstname + ' ' + userData.lastname, password: userData.password, mail: userData.email });
                setPasswordConfirmation(userData.password);
                setEmailConfirmation(userData.email);
                console.log("response", res.data);
            })
            .catch((err) => {
                console.log("error", err.stack);
            })
    }, [userid]);
    console.log("1");
    console.log("pro", profile);
    console.log("defult image", defaultImage);

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setName(prevName => ({ ...prevName, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const newValue = e.target.value;
        setPasswordConfirmation(newValue);
    };

    const handleEmailChange = (e) => {
        const newValue = e.target.value;
        setEmailConfirmation(newValue);
    };
    const handleProfileChange = (e) => {
        if (e.target.files.length > 0) {
            console.log("changing");
            const selectedImage = e.target.files[0];
            const imageUrl = URL.createObjectURL(selectedImage);
            setProfile(imageUrl);
            // console.log("image ",selectedImage);
            // console.log("image url",imageUrl);
            setUserData({ ...userdata, image: selectedImage }); 
        }
    }
 
    const makeEdit = () => {
        if (userdata.password !== passwordConfirmation) {
            setMessage("Passwords don't match");
            return;
        }

        if (userdata.mail !== emailConfirmation) {
            setMessage("Emails don't match");
            return;
        }

        const formData = new FormData();
        formData.append('username', name.firstname + ' ' + name.lastname);
        formData.append('password', userdata.password);
        formData.append('email', userdata.mail);
        if (userdata.image === null) {
            // Append previous image URL to form data
            formData.append("image", profile.substring(profile.indexOf('/profile')));
        } else {
            // Append new image to form data
            formData.append('image', userdata.image);
        }
        console.log("userdata image", userdata.image);

        console.log("formdata", formData);
        axios.put(`http://localhost:5000/updatedata/${userid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(({ data }) => {
                console.log("response edit ", data)
                setMessage(`Profile updated successfully: ${data}`);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='edit-profile'>
            <div className="edit-heading">
                <h1>Edit Profile</h1>
                <div className="profile-img">
                    <img src={profile || avatar} alt="pro_img" id="profile" />
                    <div className="round">
                        <input type="file" title='choose profile' name="profile_img" id="profile_img" className='profile_img' accept="image/*" onChange={handleProfileChange} />
                        {/* <input type="file" title='choose profile' name="profile_img" id="profile_img" className='profile_img' accept="image/*" onChange={() => {
                            handleProfileChange(); setUpdate(true);
                        }} /> */}
                        <div className='img_icon'></div>
                    </div>
                </div>
            </div>
            <div className="edit-data">
                <div className="username">
                    <div className="firstname">
                        <label htmlFor="f-name">First Name</label>
                        <input type="text" name="firstname" id="firstname" value={name.firstname} onChange={handleNameChange} />
                    </div>
                    <div className="lastname">
                        <label htmlFor="l-name">Last Name</label>
                        <input type="text" name="lastname" id="lastname" value={name.lastname} onChange={handleNameChange} />
                    </div>
                </div>
                <div className="password">
                    <div className="main">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={userdata.password} onChange={(e) => setUserData({ ...userdata, password: e.target.value })} />
                    </div>
                    <div className="confirmation">
                        <label htmlFor="con-password">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" value={passwordConfirmation} onChange={handlePasswordChange} />
                    </div>
                </div>

                <div className="mail">
                    <div className="main">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" value={userdata.mail} onChange={(e) => setUserData({ ...userdata, mail: e.target.value })} />
                    </div>
                    <div className="confirmation">
                        <label htmlFor="confirmEmail">Confirm Email Address</label>
                        <input type="email" name="confirmEmail" id="confirmEmail" value={emailConfirmation} onChange={handleEmailChange} />
                    </div>
                </div>
                <div className="edit-btn">
                    <button onClick={makeEdit}>Make Edit</button>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default EditProfile;
