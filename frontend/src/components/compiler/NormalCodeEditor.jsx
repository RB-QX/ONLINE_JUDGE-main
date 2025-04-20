import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";
import axios from "axios";

const starterCodes = {
  cpp: `// Include the input/output stream library
  #include <iostream>
  using namespace std;

// Define the main function
int main() {
    // Output "Hello World!" to the console
    std::cout << "Hello World!";

    // Return 0 to indicate successful execution
    return 0;
}`,
  c: `#include <stdio.h>

// Define the main function
int main() {
    // Output "Hello, World!" to the console
    printf("Hello, World!");

    // Return 0 to indicate successful execution
    return 0;
}`,
  py: `# Define the main function
def main():
    # Output "Hello, World!" to the console
    print("Hello, World!")

# Call the main function
if __name__ == "__main__":
    main()`,
  java: `public class Main {
    public static void main(String[] args) {
        // Output "Hello, World!" to the console
        System.out.println("Hello, World!");
    }
}`,
  js: `// Define the main function
function helloWorld() {
  console.log("Hello, World!");
}

// Call the function to execute it
helloWorld();`,
};

function NormalCodeEditor({ problemId, userId }) {
  const [code, setCode] = useState(starterCodes.cpp);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(starterCodes[selectedLanguage]);
    setOutput(""); // Clear the output when the language is changed
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit code.");
      return;
    }

    const payload = {
      userId,
      problemId,
      code,
      language,
      input,
    };

    try {
      const { data } = await axios.post(
        "https://compiler.codeinnovate.tech/run",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.error) {
        setOutput(data.error.error); // Display compilation error to the user
      } else {
        setOutput(data.output); // Display normal output
      }
    } catch (error) {
      // console.error("Error running code:", error);
      setOutput(error.response?.data?.error || "Error running code");
    }
  };

  return (
    <div className="h-fit bg-white mx-auto py-8 flex flex-col items-center w-1/2">
      <h1 className="text-3xl text-yellow-400 font-bold mb-4">Code Here</h1>
      <select
        className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500"
        onChange={handleLanguageChange}
        value={language}
      >
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="py">Python</option>
        <option value="java">Java</option>
        <option value="js">JavaScript</option>
      </select>
      <br />
      <div
        className="bg-gray-100 shadow-md w-full max-w-lg mb-4"
        style={{ height: "400px", overflowY: "auto" }}
      >
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) =>
            highlight(code, languages[language] || languages.js)
          }
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            outline: "none",
            border: "none",
            backgroundColor: "#f7fafc",
            height: "100%",
            overflowY: "auto",
          }}
        />
      </div>
      {/* <textarea
        className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded mb-4"
        placeholder="Enter custom input here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ height: "100px" }}
      /> */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="font-semibold text-gray-800 whitespace-pre">
            User Input:
          </label>
          <textarea
            rows="5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="font-semibold text-gray-800 whitespace-pre">
            User Output:
          </label>
          <textarea
            readOnly
            rows="5"
            value={output}
            className="border rounded w-full p-2"
          />
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <button
          onClick={handleSubmit}
          type="button"
          className="text-center inline-flex items-center text-white bg-gradient-to-br from-yellow-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
          Run
        </button>
      </div>
    </div>
  );
}

export default NormalCodeEditor;
