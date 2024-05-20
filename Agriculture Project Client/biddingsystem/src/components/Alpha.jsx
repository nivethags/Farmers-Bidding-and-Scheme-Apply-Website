import React, { useState } from 'react'
import Sub from '../components/Sub';
import {Link} from 'react-router-dom';
function Alpha() {
  const [auth,setAuth]=useState(false);

  return (
    <div>
      <button isAuth={auth} onClick={()=>{ console.log(auth); setAuth(!auth)}} >Alpha Page</button>
      <Sub auth={auth}></Sub>
    </div>
  )
}

export default Alpha
