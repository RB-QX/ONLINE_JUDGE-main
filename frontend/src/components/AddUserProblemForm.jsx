import React, { useState } from "react";

const AddUserProblemForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [inputExample, setInputExample] = useState("");
  const [outputExample, setOutputExample] = useState("");
  const [constraints, setConstraints] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [topics, setTopics] = useState("");

  const handleTestCaseChange = (index, event) => {
    const newTestCases = testCases.map((testCase, i) =>
      i === index
        ? { ...testCase, [event.target.name]: event.target.value }
        : testCase
    );
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedTopics = topics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    const problem = {
      title,
      description,
      difficulty,
      inputExample,
      outputExample,
      constraints,
      testCases,
      topics: formattedTopics,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}adduserproblem`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(problem),
        }
      );

      if (response.ok) {
        alert("✅ Problem added successfully!");
        setTitle("");
        setDescription("");
        setDifficulty("Easy");
        setInputExample("");
        setOutputExample("");
        setConstraints("");
        setTestCases([{ input: "", output: "" }]);
        setTopics("");
      } else {
        alert("❌ Error adding problem.");
      }
    } catch (error) {
      alert("❌ Error connecting to server.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-md font-inter"
    >
      <h1 className="text-3xl font-bold text-[#6366f1] mb-8 text-center font-poppins">
        ✏️ Add a New Problem
      </h1>

      {/* TITLE */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter problem title"
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Explain the problem"
          required
        />
      </div>

      {/* TOPICS */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">Topics</label>
        <input
          type="text"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. arrays, sorting, dynamic programming"
          required
        />
      </div>

      {/* DIFFICULTY */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>
      </div>

      {/* EXAMPLES */}
      <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Input Example</label>
          <input
            type="text"
            value={inputExample}
            onChange={(e) => setInputExample(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Example input"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Output Example</label>
          <input
            type="text"
            value={outputExample}
            onChange={(e) => setOutputExample(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Expected output"
            required
          />
        </div>
      </div>

      {/* CONSTRAINTS */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">Constraints</label>
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 1 ≤ n ≤ 10⁴"
          required
        />
      </div>

      {/* TEST CASES */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Test Cases</label>
        {testCases.map((testCase, index) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <input
              type="text"
              name="input"
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(index, e)}
              className="mb-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Input"
              required
            />
            <input
              type="text"
              name="output"
              value={testCase.output}
              onChange={(e) => handleTestCaseChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Expected Output"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addTestCase}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500"
        >
          ➕ Add Another Test Case
        </button>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full py-3 bg-[#6366f1] text-white text-lg rounded-lg hover:bg-indigo-600 transition focus:ring-2 focus:ring-indigo-500"
      >
        🚀 Submit Problem
      </button>
    </form>
  );
};

export default AddUserProblemForm;
