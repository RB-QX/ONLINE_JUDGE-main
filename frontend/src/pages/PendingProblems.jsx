import React, { useEffect, useState } from "react";

const PendingProblems = () => {
  const [pendingProblems, setPendingProblems] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}allpendinguserproblems`)
      .then((response) => response.json())
      .then((data) => setPendingProblems(data))
      .catch((error) =>
        console.error("Error fetching pending problems:", error)
      );
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}approveproblem/${id}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setPendingProblems(
          pendingProblems.filter((problem) => problem._id !== id)
        );
      } else {
        alert("Error approving problem");
      }
    } catch (error) {
      alert("Error approving problem");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}rejectproblem/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPendingProblems(
          pendingProblems.filter((problem) => problem._id !== id)
        );
      } else {
        alert("Error rejecting problem");
      }
    } catch (error) {
      alert("Error rejecting problem");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400 text-center">
        Pending Problems
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {pendingProblems.map((problem) => (
          <div key={problem._id} className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            <p>{problem.description}</p>
            <h3 className="font-bold mt-2">Difficulty:</h3>
            <p>{problem.difficulty}</p>
            <h3 className="font-bold mt-2">Topics Related:</h3>
            <p>{problem.topics}</p>
            <h3 className="font-bold mt-2">Input Example:</h3>
            <p>{problem.inputExample}</p>
            <h3 className="font-bold mt-2">Output Example:</h3>
            <p>{problem.outputExample}</p>
            <h3 className="font-bold mt-2">Constraints:</h3>
            <p>{problem.constraints}</p>
            <h3 className="font-bold mt-2">Test Cases:</h3>
            <div className="space-y-2">
              {problem.testCases.map((testCase, index) => (
                <div key={index} className="bg-white p-2 rounded shadow-sm">
                  <p>
                    <strong>Input:</strong> {testCase.input}
                  </p>
                  <p>
                    <strong>Expected Output:</strong> {testCase.output}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleApprove(problem._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(problem._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingProblems;
