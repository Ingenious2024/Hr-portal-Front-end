import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Updates.css";

const formatDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date); 
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Updates = () => {
  const [updatesData, setUpdatesData] = useState([]);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based, so +1 for the current month
    axios.get("https://hrportal-backend.onrender.com/api/employees")
      .then((response) => {
        // Filter out employees whose birthdays are in the current month
        const filteredData = response.data.filter((employee) => {
          const employeeMonth = new Date(employee.birthday).getMonth() + 1; // +1 since getMonth() returns month in 0-11
          return employeeMonth === currentMonth;
        });
        setUpdatesData(filteredData);
        console.log(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to ensure this effect runs only once on mount

  return (
    <div className="Updates">
      {updatesData.map((update) => {
        return (
          <div className="update" key={update.id}>
            <img src={update.img} alt="profile" />
            <div className="noti">
              <div style={{ marginBottom: "0.5rem" }}>
                <span>{update.name}</span>
                <span> {update.noti}</span>
              </div>
              <span>DOB: {formatDate(update.birthday)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Updates;
