import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ContestPage = ({ isLoggedIn }) => {
  const [timeLeft, setTimeLeft] = useState(3600); // example: 1 hour in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState({});

  useEffect(() => {
    let timer;
    if (isStarted) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isStarted]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}allcontestproblem`
        );
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    const fetchSolvedStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}solvedproblems`
        );
        const solvedStatus = response.data.reduce((acc, problem) => {
          acc[problem._id] = problem.verdict === "Success";
          return acc;
        }, {});
        setSolvedProblems(solvedStatus);
      } catch (error) {
        console.error("Error fetching solved problems status:", error);
      }
    };

    fetchSolvedStatus();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startTimer = () => {
    setIsStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Ready! to Top in Contest
        </h1>
        <div className="text-2xl font-semibold mb-4">
          Time Left:{" "}
          <span className="text-red-500">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={startTimer}
          className={`bg-green-500 text-white px-4 py-2 rounded-md mb-4 ${
            isStarted ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isStarted}
        >
          Start Contest
        </button>

        <div className="space-y-6">
          {problems.map((problem) => (
            <div key={problem._id} className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-xl font-bold">
                <Link
                  to={`/allcontestproblem/${problem._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {problem.title}
                </Link>
              </h2>
              <p className="mt-2">{problem.description}</p>
              <div className="mt-4">
                {solvedProblems[problem._id] ? (
                  <span className="text-green-500">Solved</span>
                ) : (
                  <span className="text-red-500">Unsolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-right">
          <Link to="/leaderboard">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              LeaderBoard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestPage;
