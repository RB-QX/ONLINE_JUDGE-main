import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const DeleteProblem = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch problems from the server
  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}allproblems`
      );
      if (response.status === 200) {
        setProblems(response.data);
      } else {
        throw new Error("Failed to fetch problems");
      }
    } catch (error) {
      console.error("Error fetching problems:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Handle problem deletion
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as an admin to delete problems.");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}delete-problem/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Problem deleted successfully");
        fetchProblems(); // Refresh the list of problems
      } else {
        throw new Error("Failed to delete problem");
      }
    } catch (error) {
      console.error("Error deleting problem:", error.message);
      alert("Failed to delete problem. Please try again.");
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
      {problems.map((problem) => (
        <div
          key={problem._id}
          className="bg-white shadow-md rounded-lg p-4 mb-4"
        >
          <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
          <p className="text-gray-600 mb-2">{problem.description}</p>
          <button
            onClick={() => handleDelete(problem._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
          <Link to={`/update/${problem._id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-10">
              Update
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DeleteProblem;
