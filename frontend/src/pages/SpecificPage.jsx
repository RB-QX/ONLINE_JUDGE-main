// frontend/src/pages/SpecificPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CodeEditor from "../components/compiler/CodeEditor";

const SpecificPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchProblem() {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}allproblems/${id}`
        );
        setProblem(resp.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  // 1. Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        Loading…
      </div>
    );
  }

  // 2. Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  // 3. Not found
  if (!problem) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>No Problem Found:</strong> ID {id} does not exist.
        </div>
      </div>
    );
  }

  // 4. Derive fields with safe fallbacks
  const title = problem.title ?? "Untitled";
  const description = problem.description ?? "No description.";
  const difficulty = problem.difficulty ?? "Unknown";
  const topics = Array.isArray(problem.topics)
    ? problem.topics
    : typeof problem.topics === "string"
    ? problem.topics.split(",").map((t) => t.trim())
    : [];
  const inputExample = problem.inputExample ?? "N/A";
  const outputExample = problem.outputExample ?? "N/A";
  const constraints = problem.constraints ?? "None";
  const testCases = Array.isArray(problem.testCases)
    ? problem.testCases
    : [];
  const visibleTestCases = testCases.slice(0, 2);

  return (
    <div className="container mx-auto py-8 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center lg:text-left">
          {title}
        </h1>
        <div className="bg-white shadow rounded-lg p-6">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{description}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Difficulty</h2>
            <p>{difficulty}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Topics</h2>
            {topics.length > 0 ? (
              <ul className="list-disc list-inside">
                {topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            ) : (
              <p>None</p>
            )}
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Input Example</h2>
            <pre className="bg-gray-100 p-2 rounded">{inputExample}</pre>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Output Example</h2>
            <pre className="bg-gray-100 p-2 rounded">{outputExample}</pre>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Constraints</h2>
            <p>{constraints}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Test Cases</h2>
            {visibleTestCases.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {visibleTestCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 p-4 rounded"
                  >
                    <p>
                      <strong>Input:</strong>{" "}
                      <code>{tc.input ?? "—"}</code>
                    </p>
                    <p>
                      <strong>Expected:</strong>{" "}
                      <code>{tc.output ?? "—"}</code>
                    </p>
                  </div>
                ))}
                {testCases.length > 2 && (
                  <p className="text-gray-500 mt-2">
                    and {testCases.length - 2} more…
                  </p>
                )}
              </div>
            ) : (
              <p>No test cases available.</p>
            )}
          </section>
        </div>
      </div>

      <div className="w-full lg:w-1/2 lg:pl-8">
        <CodeEditor problemId={id} userId={userId} />
      </div>
    </div>
  );
};

export default SpecificPage;
