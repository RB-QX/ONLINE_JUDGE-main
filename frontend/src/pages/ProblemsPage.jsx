import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [verdicts, setVerdicts] = useState({});
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in local storage

  useEffect(() => {
    const fetchProblems = async () => {
      let url = `${process.env.REACT_APP_BACKEND_URL}allproblems`;
      if (difficulty) {
        url = `${process.env.REACT_APP_BACKEND_URL}problemsdifficulty?difficulty=${difficulty}`;
      }
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProblems(data);
        } else {
          throw new Error("Failed to fetch problems");
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, [difficulty]);

  useEffect(() => {
    const fetchVerdicts = async () => {
      if (userId) {
        const newVerdicts = {};
        for (const problem of problems) {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}verdict/${userId}/${problem._id}`
            );
            if (response.ok) {
              const data = await response.json();
              newVerdicts[problem._id] = data.verdict;
            } else {
              newVerdicts[problem._id] = "Unsolved";
            }
          } catch (error) {
            newVerdicts[problem._id] = "Unsolved";
          }
        }
        setVerdicts(newVerdicts);
      }
    };

    if (problems.length > 0) {
      fetchVerdicts();
    }
  }, [problems, userId]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-200 text-green-800";
      case "Medium":
        return "bg-yellow-200 text-yellow-800";
      case "Hard":
        return "bg-red-200 text-red-800";
      default:
        return "";
    }
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case "Solved":
        return { color: "green" }; // Solved
      case "Unsolved":
        return { color: "red" }; // Unsolved
      default:
        return {};
    }
  };

  return (
    <div className="bg-yellow-100 w-full min-h-screen">
      <div className="container mx-auto px-4 py-8 text-black-400">
        <h1 className="text-3xl font-bold mb-4">Problems</h1>

        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-yellow-600"
          >
            Filter by Difficulty:
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-50 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-yellow-200">
            <tr>
              <th className="py-2 px-4 border-r border-gray-200 text-center">
                Title
              </th>
              <th className="py-2 px-4 border-r border-gray-200 text-center">
                Topics
              </th>
              <th className="py-2 px-4 border-r border-gray-200 text-center">
                Difficulty
              </th>
              <th className="py-2 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} className="border-b">
                <td className="py-2 px-4 border-r border-gray-200 text-center">
                  <Link
                    to={`/problems/${problem._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="py-2 px-4 border-r border-gray-200 text-center">
                  {problem.topics}
                </td>
                <td
                  className={`py-2 px-4 border-r border-gray-200 text-center ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </td>
                <td
                  className="py-2 px-4 text-center"
                  style={getVerdictStyle(verdicts[problem._id] || "Unsolved")}
                >
                  {verdicts[problem._id] || "Unsolved"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemsPage;

