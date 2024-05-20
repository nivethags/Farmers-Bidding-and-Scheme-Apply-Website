import React, { useState, useEffect } from "react";
import axios from "axios";

const Time = ({ prdid }) => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    // Fetch stored time from the backend
    axios
      .get(`http://localhost:5000/product-time/${prdid}`)
      .then((response) => {
        console.log(response);
        if (response.data.currenttime === null || response.data.currenttime <= 0) {
          if (response.data.timer === 0) {
            // If timer value is 0, set time to 0
            setTime(0);
            // Perform additional actions if needed
            axios
              .put(`http://localhost:5000/productoutdate/${prdid}`)
              .then((res) => console.log("available response", res))
              .catch((err) => console.log("error from available change", err));
          } else {
            // Convert timer value to milliseconds and set time
            const ctime = response.data.timer * 24 * 60 * 60 * 1000;
            setTime(ctime);
          }
        } else {
          // Set current time from response data
          const ctime = response.data.currenttime;
          setTime(ctime);
          console.log("currenttime data", response.data.currenttime);
        }
      })
      .catch((error) => {
        console.error("Error fetching time:", error);
      });
  }, [prdid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only decrement time if it's not already 0
      if (time > 0) {
        setTime((prevTime) => prevTime - 1000);
        // Send updated time to the backend
        axios
          .post(`http://localhost:5000/update-time/${prdid}`, { time: time - 1000 })
          .then((response) => {
            console.log("Time updated successfully", response);
          })
          .catch((error) => {
            console.error("Error updating time:", error);
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, prdid]);

  const getFormattedTime = (milliseconds) => {
    let total_seconds = parseInt(Math.floor(milliseconds / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));
    let days = parseInt(Math.floor(total_hours / 24));

    let seconds = parseInt(total_seconds % 60);
    let minutes = parseInt(total_minutes % 60);
    let hours = parseInt(total_hours % 24);
    return `${days}:${hours}:${minutes}:${seconds}`;
  };

  // return <div>{getForattedTime(time)}</div>;
  return (
    <div>
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
            <td >{getFormattedTime(time).split(':')[0]}</td>
            <td>{getFormattedTime(time).split(':')[1]}</td>
            <td>{getFormattedTime(time).split(':')[2]}</td>
            <td>{getFormattedTime(time).split(':')[3]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

};

export default Time;
