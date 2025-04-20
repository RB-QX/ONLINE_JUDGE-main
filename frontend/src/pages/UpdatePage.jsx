// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const UpdateProblem = () => {
//   const { id } = useParams(); // Get the problem ID from URL params
//   const navigate = useNavigate(); // For navigation after deletion
//   const [problem, setProblem] = useState({
//     title: "",
//     description: "",
//     difficulty: "",
//     inputExample: "",
//     outputExample: "",
//     constraints: "",
//     testCases: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8000/allproblems/${id}`
//         );
//         if (response.status === 200) {
//           setProblem(response.data);
//           setLoading(false);
//         } else {
//           throw new Error("Failed to fetch problem");
//         }
//       } catch (error) {
//         console.error("Error fetching problem:", error.message);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchProblem();
//   }, [id]);

//   const handleUpdate = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.put(
//         `http://localhost:8000/allproblems/${id}`,
//         problem
//       );
//       if (response.status === 200) {
//         alert("Problem updated successfully");
//       } else {
//         alert("Error updating problem");
//       }
//     } catch (error) {
//       console.error("Error updating problem:", error.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:8000/allproblems/${id}`
//       );
//       if (response.status === 200) {
//         alert("Problem deleted successfully");
//         navigate("/allproblems"); // Navigate back to the problems list
//       } else {
//         alert("Error deleting problem");
//       }
//     } catch (error) {
//       console.error("Error deleting problem:", error.message);
//     }
//   };

//   if (loading) {
//     return <div className="container mx-auto py-8 text-center">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 text-center">
//         <div
//           className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//           role="alert"
//         >
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container bg-white mx-auto py-8 border-spacing-12">
//       <h1 className="text-3xl font-bold mb-4 text-yellow-400 text-center">
//         Edit Problem
//       </h1>
//       <form onSubmit={handleUpdate}>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="title"
//           >
//             Title
//           </label>
//           <input
//             id="title"
//             type="text"
//             value={problem.title}
//             onChange={(e) => setProblem({ ...problem, title: e.target.value })}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="description"
//           >
//             Description
//           </label>
//           <textarea
//             id="description"
//             value={problem.description}
//             onChange={(e) =>
//               setProblem({ ...problem, description: e.target.value })
//             }
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-black text-sm font-bold mb-2"
//             htmlFor="difficulty"
//           >
//             Difficulty
//           </label>
//           <input
//             id="difficulty"
//             type="text"
//             value={problem.difficulty}
//             onChange={(e) =>
//               setProblem({ ...problem, difficulty: e.target.value })
//             }
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="inputExample"
//           >
//             Input Example
//           </label>
//           <textarea
//             id="inputExample"
//             value={problem.inputExample}
//             onChange={(e) =>
//               setProblem({ ...problem, inputExample: e.target.value })
//             }
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="outputExample"
//           >
//             Output Example
//           </label>
//           <textarea
//             id="outputExample"
//             value={problem.outputExample}
//             onChange={(e) =>
//               setProblem({ ...problem, outputExample: e.target.value })
//             }
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="constraints"
//           >
//             Constraints
//           </label>
//           <textarea
//             id="constraints"
//             value={problem.constraints}
//             onChange={(e) =>
//               setProblem({ ...problem, constraints: e.target.value })
//             }
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="testCases"
//           >
//             Test Cases
//           </label>
//           {problem.testCases.map((testCase, index) => (
//             <div key={index} className="mb-2">
//               <label className="block text-gray-700 text-sm font-bold mb-1">
//                 Test Case {index + 1}
//               </label>
//               <textarea
//                 value={testCase.input}
//                 onChange={(e) => {
//                   const newTestCases = [...problem.testCases];
//                   newTestCases[index].input = e.target.value;
//                   setProblem({ ...problem, testCases: newTestCases });
//                 }}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
//                 placeholder="Input"
//                 required
//               />
//               <textarea
//                 value={testCase.output}
//                 onChange={(e) => {
//                   const newTestCases = [...problem.testCases];
//                   newTestCases[index].output = e.target.value;
//                   setProblem({ ...problem, testCases: newTestCases });
//                 }}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 placeholder="Expected Output"
//                 required
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => {
//               setProblem({
//                 ...problem,
//                 testCases: [...problem.testCases, { input: "", output: "" }],
//               });
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//           >
//             Add Test Case
//           </button>
//         </div>
//         <div className="flex space-x-4">
//           <button
//             type="submit"
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Update
//           </button>
//           <button
//             type="button"
//             onClick={handleDelete}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Delete
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateProblem;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProblem = () => {
  const { id } = useParams(); // Get the problem ID from URL params
  const navigate = useNavigate(); // For navigation after deletion
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    difficulty: "",
    topics: "",
    inputExample: "",
    outputExample: "",
    constraints: "",
    testCases: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}allproblems/${id}`
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

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}allproblems/${id}`,
        problem
      );
      if (response.status === 200) {
        alert("Problem updated successfully");
      } else {
        alert("Error updating problem");
      }
    } catch (error) {
      console.error("Error updating problem:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}allproblems/${id}`
      );
      if (response.status === 200) {
        alert("Problem deleted successfully");
        navigate("/allproblems"); // Navigate back to the problems list
      } else {
        alert("Error deleting problem");
      }
    } catch (error) {
      console.error("Error deleting problem:", error.message);
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
    <div className="container mx-auto py-8 px-4 sm:px-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400 text-center">
        Edit Problem
      </h1>
      <form
        onSubmit={handleUpdate}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={problem.title}
            onChange={(e) => setProblem({ ...problem, title: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={problem.description}
            onChange={(e) =>
              setProblem({ ...problem, description: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="topics"
          >
            Topics
          </label>
          <input
            id="topics"
            type="text"
            value={problem.topics}
            onChange={(e) => setProblem({ ...problem, topics: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-black text-sm font-bold mb-2"
            htmlFor="difficulty"
          >
            Difficulty
          </label>
          <input
            id="difficulty"
            type="text"
            value={problem.difficulty}
            onChange={(e) =>
              setProblem({ ...problem, difficulty: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="inputExample"
          >
            Input Example
          </label>
          <textarea
            id="inputExample"
            value={problem.inputExample}
            onChange={(e) =>
              setProblem({ ...problem, inputExample: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="2"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="outputExample"
          >
            Output Example
          </label>
          <textarea
            id="outputExample"
            value={problem.outputExample}
            onChange={(e) =>
              setProblem({ ...problem, outputExample: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="2"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="constraints"
          >
            Constraints
          </label>
          <textarea
            id="constraints"
            value={problem.constraints}
            onChange={(e) =>
              setProblem({ ...problem, constraints: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="2"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="testCases"
          >
            Test Cases
          </label>
          {problem.testCases.map((testCase, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Test Case {index + 1}
              </label>
              <textarea
                value={testCase.input}
                onChange={(e) => {
                  const newTestCases = [...problem.testCases];
                  newTestCases[index].input = e.target.value;
                  setProblem({ ...problem, testCases: newTestCases });
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                placeholder="Input"
                rows="2"
                required
              />
              <textarea
                value={testCase.output}
                onChange={(e) => {
                  const newTestCases = [...problem.testCases];
                  newTestCases[index].output = e.target.value;
                  setProblem({ ...problem, testCases: newTestCases });
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Expected Output"
                rows="2"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setProblem({
                ...problem,
                testCases: [...problem.testCases, { input: "", output: "" }],
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition-colors"
          >
            Add Test Case
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProblem;
