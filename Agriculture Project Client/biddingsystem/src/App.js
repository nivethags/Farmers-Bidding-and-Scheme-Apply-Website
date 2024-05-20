import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BidForm from './components/BidForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import NavBar from './components/NavBar';
import BidItemDisplay from './components/BidItemDisplay';
import FirstMainPage from './components/FirstMainPage';
import Footer from './components/Footer';
import ProductDetailsPage from './components/ProductDetailsPage';
import PriceCode from './components/PriceCode';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import ProfileMain from './components/ProfileMain';
import EditProfile from './components/EditProfile';
import FormData from './components/FormData';
import Confirmation from './components/Confirmation';
import EditProduct from './components/EditProduct';
import ForgetPass from './components/ForgetPass';
import ContactUs from './components/ContactUs';
import Scheme from './components/Scheme';
import SchemeHome from './components/SchemeHome';
import SchemeDetail from './components/SchemeDetail';
import ApplicationForm from './components/ApplicationForm';
import DisplayCustomer from './components/DisplayCustomer';
import BuyerDetail from './components/BuyerDetail';
function App() {
  var statusItem = localStorage.getItem('status');
  var userId;
  const [prdID,setPrdID]=useState('');

  
  if (statusItem !== null) {
      var statusObject = JSON.parse(statusItem);
      userId = statusObject.loginid;
  } else {
      console.error("'status' key is null or not present in localStorage");
      userId = false; 
  }
  
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>

      <BrowserRouter>
        <Header  login={userId} />
        <Routes>
          <Route path='/' element={<FirstMainPage />} />
          <Route path='/login' element={<LoginForm/>} />
          <Route path='/forgetpass' element={<ForgetPass/>}/>
          <Route path='/profile' element={<Profile userid={userId} /> } />
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/market' element={<BidItemDisplay userid={userId}   setPrdID={setPrdID}/>} />         
          <Route path='/bidform' element={<BidForm userid={userId} />} /> 
          <Route path="/product/:id" element={<ProductDetailsPage />} ></Route>
          <Route path='/product/:id/code' element={<PriceCode userid={userId} />} />
          <Route path='/profilemain'element={<ProfileMain/>}/>
          <Route path='/editprofile' element={<EditProfile userid={userId}/>}/>
          <Route path='/formdata'  element={<FormData/>}/>
          <Route path='/confirmation' element={<Confirmation/>}/>
          <Route path='/editproduct' element={<EditProduct/>}/>
          <Route path='/schemehome' element={< SchemeHome/>}/>
          <Route path="/scheme/:id" element={<SchemeDetail/>} />
          <Route path="/apply/:id" element={<ApplicationForm/>} />
          <Route path='/contact' element={<ContactUs/>}/>
          <Route path='/buyerdetail' element={<BuyerDetail/>}/>
          <Route path='/viewcustomer' element={<DisplayCustomer prdID={prdID} userId={userId} />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>

    </div>
  );
}

export default App;
