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
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}allproblems/${id}`);
        setProblem(resp.data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-600 font-medium">Loading…</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-medium">Error: {error}</div>;
  if (!problem) return <div className="text-center py-10 text-yellow-600 font-medium">No Problem Found (ID: {id})</div>;

  const {
    title = "Untitled",
    description = "No description.",
    difficulty = "Unknown",
    topics = [],
    inputExample = "N/A",
    outputExample = "N/A",
    constraints = "None",
    testCases = [],
  } = problem;

  const visibleTestCases = testCases.slice(0, 2);
  const topicList = Array.isArray(topics)
    ? topics
    : typeof topics === "string"
    ? topics.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f9fafb] font-inter">
      {/* Left: Problem Panel */}
      <aside className="w-full lg:w-1/2 p-6 lg:sticky top-0 overflow-y-auto h-screen border-r border-gray-200 bg-white">
        <h1 className="text-3xl font-bold text-[#6366f1] mb-6">{title}</h1>

        <div className="space-y-6 text-gray-800 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold">📝 Description</h2>
            <p className="mt-1">{description}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">🎯 Difficulty</h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {difficulty}
            </span>
          </section>

          <section>
            <h2 className="text-lg font-semibold">🏷️ Topics</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {topicList.length > 0
                ? topicList.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))
                : "None"}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">📥 Input Example</h2>
            <pre className="bg-gray-100 rounded p-3 mt-1 text-sm">{inputExample}</pre>
          </section>

          <section>
            <h2 className="text-lg font-semibold">📤 Output Example</h2>
            <pre className="bg-gray-100 rounded p-3 mt-1 text-sm">{outputExample}</pre>
          </section>

          <section>
            <h2 className="text-lg font-semibold">📌 Constraints</h2>
            <p className="mt-1">{constraints}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">🧪 Test Cases</h2>
            {visibleTestCases.length > 0 ? (
              <div className="space-y-3 mt-2">
                {visibleTestCases.map((tc, idx) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded bg-gray-50">
                    <p>
                      <strong>Input:</strong> <code>{tc.input ?? "—"}</code>
                    </p>
                    <p>
                      <strong>Expected:</strong> <code>{tc.output ?? "—"}</code>
                    </p>
                  </div>
                ))}
                {testCases.length > 2 && (
                  <p className="text-sm text-gray-500">
                    …and {testCases.length - 2} more test case(s)
                  </p>
                )}
              </div>
            ) : (
              <p>No test cases available.</p>
            )}
          </section>
        </div>
      </aside>

      {/* Right: Code Editor */}
      <main className="w-full lg:w-1/2 h-screen overflow-y-auto p-4 bg-[#f9fafb]">
        <div className="h-full bg-white rounded-xl shadow-md p-4">
          <CodeEditor problemId={id} userId={userId} />
        </div>
      </main>
    </div>
  );
};

export default SpecificPage;
