import React, { useState } from 'react'

const FormData = () => {

    const [userData,setUserData] = useState({name:'',password:'',image:''})
    const upload = () => {
        const formData = new FormData();
        formData.append("username", userData.name);
        formData.append('password', userData.password);
        formData.append('image', userData.image);
        console.log(formData);
        console.log(formData instanceof FormData); // Check if formData is an instance of FormData
    }
    

  return (
    <div>
      <input type="text" name="name" id="" value={userData.name} onChange={(e)=>{setUserData({...userData,name:e.target.value})}}/>
      <input type="password" name="password" id="" value={userData.password} onChange={(e)=>{setUserData({...userData,password:e.target.value})}} />
      <input type="file" name="image" id="" onChange={e=>{setUserData({...userData,image:e.target.files[0]})}} />
      <button onClick={upload}>upload</button>
    </div>
  )
}

export default FormData
