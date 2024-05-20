import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Timer.css'

const Timer = ({ prdid }) => {
  const [days, setDays] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [currentTime,setTime]=useState(null);
  useEffect(() => {
    axios.get(`http://localhost:5000/gettime/${prdid}`)
      .then(res => {
        if (res.data && res.data.timer !== null && !isNaN(res.data.timer)) {
          const initialSeconds = res.data.timer * 24 * 60 * 60;
          setDays(res.data.timer);
          setSeconds(initialSeconds);
          setTime(res.data.currenttime);
          console.log("current time ",res.data.currenttime)

        } else {
          if (res.data && res.data.timer === 0) {
            setDays(0);
            const initialSeconds = 0;
            setSeconds(initialSeconds);
          }
        }
      })
      .catch(err => console.log('Error from timer API:', err.response.data.message));
  }, [prdid]);

  useEffect(() => {
    if (seconds !== null&&seconds!==0) {
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [seconds]);

  useEffect(()=>{
    // console.log("seconds",seconds);
    axios.put(`http://localhost:5000/updatecurrenttime/${seconds}`,{prdid})
    // .then(res=>console.log("Current Time Is Updated",res))
    .then(res=>{
      
      console.log("days",(Math.floor(res.data.currenttime / (24 * 60 * 60))) );
      console.log('hours',Math.floor((currentTime % (24 * 60 * 60)) / (60 * 60)));
      console.log("minutes",Math.floor((currentTime % (60 * 60)) / 60));
      console.log("Seconds",seconds%60);
    })
    .catch(err=>console.log("error from current time update",err))
  },[currentTime, seconds, prdid])

  // if (days === null || seconds === null) {
  //   return <p>Loading...</p>;
  // }

  const remainingDays =currentTime ?  (Math.floor(currentTime / (24 * 60 * 60))) : (Math.floor(seconds / (24 * 60 * 60))) ;
  const remainingHours =currentTime? Math.floor((currentTime % (24 * 60 * 60)) / (60 * 60)):Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const remainingMinutes = currentTime? Math.floor((currentTime % (60 * 60)) / 60):Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;



  return (
    <table>
      <thead>
        <tr>
          <th>Days</th>
          <th>Hours</th>
          <th>Minutes</th>
          <th>Seconds</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{remainingDays}</td>
          <td>{remainingHours}</td>
          <td>{remainingMinutes}</td>
          <td>{remainingSeconds}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Timer;
