import React, { useEffect, useState } from "react";
import moment from "moment";
import "./Calender.css"; // Assuming you create a CSS file for styles

const CalendarGrid = ({ solvedDates }) => {
  const months = moment.months();

  const isSolved = (date) => {
    return solvedDates.includes(date.format("YYYY-MM-DD"));
  };
  console.log(solvedDates);
  const generateDays = (month, year) => {
    const firstDay = moment(`${year}-${month + 1}-01`);
    const daysInMonth = firstDay.daysInMonth();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = moment(`${year}-${month + 1}-${i}`);
      days.push(
        <div
          key={i}
          className={`day-box ${isSolved(currentDate) ? "solved" : ""}`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      {months.map((month, index) => (
        <div key={month} className="month-container">
          <h3 className="month-title">{month}</h3>
          <div className="days-container">
            {generateDays(index, moment().year())}
          </div>
        </div>
      ))}
    </div>
  );
};

const CalenderPage = () => {
  const [solvedDates, setSolvedDates] = useState([]);
  const userId = localStorage.getItem("userId"); // Replace with the actual user ID

  // useEffect(() => {
  //   const fetchSolvedDates = async () => {
  //     try {
  //       console.log(userId);
  //       const response = await axios.get(
  //         `http://localhost:8000/solvedate/${userId}`
  //       );
  //       // if (response.data.success) {
  //       //   setSolvedDates(response.data.solvedDates);
  //       // } else {
  //       //   console.error("Failed to fetch solved dates:", response.data.message);
  //       // }
  //       const data = await response.json();
  //       if (data.success) {
  //         const formattedDates = data.solvedDates.map((date) =>
  //           moment(date).format("YYYY-MM-DD")
  //         );
  //         console.log("Formatted Dates:", formattedDates); // Log formatted dates
  //         setSolvedDates(formattedDates);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching solved dates:", error);
  //     }
  //   };

  //   fetchSolvedDates();
  // }, [userId]);
  useEffect(() => {
    const fetchSolvedDates = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}solvedate/${userId}`
        );
        const data = await response.json();
        if (data.success) {
          const formattedDates = data.solvedDates.map((date) =>
            moment(date).format("YYYY-MM-DD")
          );
          console.log("Formatted Dates:", formattedDates); // Log formatted dates
          setSolvedDates(formattedDates);
        }
      } catch (error) {
        console.error("Error fetching solved dates:", error);
      }
    };

    fetchSolvedDates();
  }, [userId]);

  return (
    <div>
      {/* <h1 className=" text-yellow-400">Problem Solving Calendar</h1> */}
      <CalendarGrid solvedDates={solvedDates} />
    </div>
  );
};

export default CalenderPage;
