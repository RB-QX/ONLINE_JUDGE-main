import React, { useState } from "react";

const AddContestProblem = ({ isLoggedIn }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [inputExample, setInputExample] = useState("");
  const [outputExample, setOutputExample] = useState("");
  const [constraints, setConstraints] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [topics, setTopics] = useState([]);
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
    const problem = {
      title,
      description,
      difficulty,
      inputExample,
      outputExample,
      constraints,
      testCases,
      topics,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}addcontestproblem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(problem),
        }
      );

      if (response.ok) {
        alert("Problem added successfully");
        // Reset the form
        setTitle("");
        setDescription("");
        setDifficulty("Easy");
        setInputExample("");
        setOutputExample("");
        setConstraints("");
        setTestCases([{ input: "", output: "" }]);
        setTopics([]);
      } else {
        console.log("cant add0");
        alert("Error adding problem");
      }
    } catch (error) {
      console.log("cant add");
      alert("Error adding problem");
    }
  };
  if (!isLoggedIn) {
    return <p className="text-yellow-400">Please log in to add a problem.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-6/12 p-6 bg-yellow-100 shadow-lg rounded-lg"
    >
      <h1 className="text-3xl  font-bold mb-6 text-center text-blue-600">
        Add New Problem
      </h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Topics
        </label>
        <input
          type="text"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter topics separated by commas"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Difficulty
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mt-1 block w-full p-3 border bg-white-500 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Input Example
        </label>
        <input
          type="text"
          value={inputExample}
          onChange={(e) => setInputExample(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Input Example"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Output Example
        </label>
        <input
          type="text"
          value={outputExample}
          onChange={(e) => setOutputExample(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Output Example"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Constraints
        </label>
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Constraints"
          rows={4}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Test Cases
        </label>
        {testCases.map((testCase, index) => (
          <div
            key={index}
            className="mb-2 p-2 border border-gray-200 rounded bg-gray-50"
          >
            <input
              type="text"
              name="input"
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(index, e)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Test Case Input"
              required
            />
            <input
              type="text"
              name="output"
              value={testCase.output}
              onChange={(e) => handleTestCaseChange(index, e)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Test Case Output"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addTestCase}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Test Case
        </button>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Problem
      </button>
    </form>
  );
};

export default AddContestProblem;

// import React from "react";

// const AddContestProblem = () => {
//   return <div className="text-yellow-400">AddContestProblem</div>;
// };

// export default AddContestProblem;
