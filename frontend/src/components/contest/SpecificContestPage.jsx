import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CodeEditor from "../compiler/CodeEditor";

const SpecificContestPage = () => {
  const { id } = useParams(); // Get the problem ID from URL params
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}allcontestproblembyid/${id}`
        );
        if (response.status === 200) {
          setProblem(response.data);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch problem");
        }
      } catch (error) {
        console.error("Error fetching problem:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

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

  if (!problem) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">No Problem Found:</strong>
          <span className="block sm:inline">
            {" "}
            The problem with ID {id} does not exist.
          </span>
        </div>
      </div>
    );
  }
  // Determine the number of test cases to show
  const visibleTestCases =
    problem.testCases.length === 1
      ? problem.testCases
      : problem.testCases.slice(0, 2);

  return (
    <div className="container mx-auto py-8 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
        <h1 className="text-3xl font-bold  text-yellow-400 mb-4 text-center ml-20lg:text-left">
          {problem.title}
        </h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-lg text-gray-700 mb-4">{problem.description}</p>
          <h2 className="text-xl font-bold mb-2">Difficulty</h2>
          <p className="text-gray-600 mb-4">{problem.difficulty}</p>
          <h2 className="text-xl font-bold mb-2">Topics Related</h2>
          <p className="text-gray-600 mb-4">{problem.topics}</p>
          <h2 className="text-xl font-bold mb-2">Input Example</h2>
          <p className="text-gray-600 mb-4">{problem.inputExample}</p>
          <h2 className="text-xl font-bold mb-2">Output Example</h2>
          <p className="text-gray-600 mb-4">{problem.outputExample}</p>
          <h2 className="text-xl font-bold mb-2">Constraints</h2>
          <p className="text-gray-600 mb-4">{problem.constraints}</p>
          <h2 className="text-xl font-bold mb-2">Test Cases</h2>
          <div className="grid grid-cols-1 gap-4">
            {visibleTestCases.map((testCase, index) => (
              <div
                key={index}
                className="bg-gray-100 border border-gray-300 p-3 rounded-md"
              >
                <p className="text-gray-600">
                  <strong>Input:</strong> {testCase.input}
                </p>
                <p className="text-gray-600">
                  <strong>Expected Output:</strong> {testCase.output}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 pl-0 lg:pl-8">
        <CodeEditor problemId={id} userId={userId} />
      </div>
    </div>
  );
};

export default SpecificContestPage;
