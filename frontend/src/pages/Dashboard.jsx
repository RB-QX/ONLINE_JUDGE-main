// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [pendingProblems, setPendingProblems] = useState(0);
  const [contestProblems, setContestProblems] = useState(0);

  useEffect(() => {
    // Fetch total users
    fetch(`${process.env.REACT_APP_BACKEND_URL}totaluser`)
      .then((response) => response.json())
      .then((data) => setTotalUsers(data.length))
      .catch((error) => console.error("Error fetching total users:", error));

    // Fetch total problems
    fetch(`${process.env.REACT_APP_BACKEND_URL}allproblems`)
      .then((response) => response.json())
      .then((data) => setTotalProblems(data.length))
      .catch((error) => console.error("Error fetching total problems:", error));

    // Fetch totla contest problems
    fetch(`${process.env.REACT_APP_BACKEND_URL}allcontestproblem`)
      .then((response) => response.json())
      .then((data) => setContestProblems(data.length))
      .catch((error) => console.error("Error fetching total problems:", error));

    // Fetch pending problems
    fetch(`${process.env.REACT_APP_BACKEND_URL}allpendinguserproblems`)
      .then((response) => response.json())
      .then((data) => setPendingProblems(data.length))
      .catch((error) =>
        console.error("Error fetching pending problems:", error)
      );
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Problems</h2>
          <p className="text-2xl ">{totalProblems}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Pending Problems</h2>
          <p className="text-2xl">{pendingProblems}</p>
          <Link to="/pendingproblems" className="text-blue-500 underline">
            View Pending Problems
          </Link>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Contest</h2>
          <p className="text-2xl">{contestProblems}</p>
          <Link to="/contestproblemform" className="text-blue-500 underline">
            Click to Add Question to Contest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
