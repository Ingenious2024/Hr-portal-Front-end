import React, { useEffect, useState } from "react";
import "./Cards.css";
import { cardsData } from "../../Data/Data";
import Card from "../Card/Card";

const Cards = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todaysAttendance, setTodaysAttendance] = useState([]);

  useEffect(() => {
    // Fetch Total Employees
    fetch('/api/employees/total')
      .then(response => response.json())
      .then(data => setTotalEmployees(data.totalEmployees));

    // Fetch Today's Attendance
    fetch('/api/attendance/today')
      .then(response => response.json())
      .then(data => setTodaysAttendance(data.attendanceToday));
  }, []);

  return (
    <div className="Cards">
      {/* Display Total Employees */}
     {/* <div>Total Employees: {totalEmployees}</div>

      {/* Display Today's Attendance Count */}
     {/* <div>Today's Attendance: {todaysAttendance.length}</div>

      {/* Existing cardsData Map */}
      {cardsData.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            png={card.png}
            series={card.series}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
