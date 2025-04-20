// src/components/compiler/NormalCodeEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FiPlay,
  FiLoader,
  FiMenu,
  FiX,
  FiCpu,
  FiTrash2,
} from "react-icons/fi";

// Starter code templates per language
const starterCodes = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout<<"Hello, World!";\n  return 0;\n}`,
  c: `#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}`,
  py: `def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  js: `function main() {\n  console.log("Hello, World!");\n}\nmain();`,
};

// Code snippets per language
const snippets = {
  cpp: [
    { label: "for-loop", code: "for (int i = 0; i < N; ++i) {\n  \n}" },
    { label: "if", code: "if (cond) {\n  \n}" },
  ],
  js: [
    { label: "for-of", code: "for (const x of arr) {\n  \n}" },
    { label: "async", code: "async function foo() {\n  await bar();\n}" },
  ],
  py: [{ label: "def", code: "def func():\n    pass" }],
  java: [{ label: "class", code: "class MyClass {\n}" }],
  c: [{ label: "printf", code: 'printf("format\\n");' }],
};

export default function NormalCodeEditor({ problemId, userId }) {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterCodes.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [logs, setLogs] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const [loading, setLoading] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [version, setVersion] = useState("v1.0.0");
  const [showSnippets, setShowSnippets] = useState(false);
  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const editorRef = useRef();

  // Axios instance for compiler service
  const compilerApi = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_COMPILER_URL || "http://localhost:5000",
      timeout: 20000,
      withCredentials: true,
    })
  ).current;

  // Load or reset code when language changes
  useEffect(() => {
    if (autoSave) {
      const saved = localStorage.getItem(`code_${problemId}_${language}`);
      if (saved) {
        setCode(saved);
        return;
      }
    }
    setCode(starterCodes[language]);
  }, [language, autoSave, problemId]);

  // Auto-save & bump version on code change
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem(`code_${problemId}_${language}`, code);
      setVersion((v) => {
        const [maj, min, pat] = v.slice(1).split('.').map(Number);
        return `v${maj}.${min}.${pat + 1}`;
      });
    }
  }, [code, autoSave, problemId, language]);

  // Run code handler
  const runCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to run code");
      return;
    }
    setLoading(true);
    setOutput("");
    setLogs("");

    try {
      const res = await compilerApi.post(
        "/run",
        { userId, problemId, code, language, input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = res.data.error
        ? { type: "error", msg: res.data.error.stderr || res.data.error }
        : { type: "success", msg: res.data.output };

      toast[result.type](
        result.type === "success" ? "Run successful" : "Compile error"
      );

      // Save to history
      setHistory((h) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          type: result.type,
          msg: result.msg,
          code,
          input,
        },
        ...h,
      ]);

      // Display appropriate tab
      if (result.type === "error") {
        setLogs(result.msg);
        setActiveTab("logs");
      } else {
        setOutput(result.msg);
        setActiveTab("output");
      }
    } catch (err) {
      toast.error("Network error");
      setLogs(err.message);
      setActiveTab("logs");
    } finally {
      setLoading(false);
    }
  };

  // Insert snippet at cursor
  const insertSnippet = (snippet) => {
    const pos = editorRef.current._input.selectionStart;
    const before = code.slice(0, pos);
    const after = code.slice(pos);
    setCode(before + snippet + after);
    setShowSnippets(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <FiMenu
            onClick={() => setDrawerOpen(true)}
            className="cursor-pointer text-gray-600 dark:text-gray-300"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {Object.keys(starterCodes).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={() => setAutoSave(!autoSave)}
              className="mr-1"
            />
            Auto‑save
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {version}
          </span>
        </div>
        <button
          onClick={runCode}
          disabled={loading}
          className="flex items-center space-x-1 bg-gradient-to-tr from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white px-4 py-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 transition"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiPlay />}
          <span className="sr-only">Run Code</span>
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* History Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } z-40`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              Run History
            </h2>
            <FiX
              onClick={() => setDrawerOpen(false)}
              className="cursor-pointer text-gray-600 dark:text-gray-300"
            />
          </div>
          <ul className="p-2 overflow-y-auto h-full">
            {history.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
                No runs yet.
              </p>
            )}
            {history.map((h, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2 mb-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setCode(h.code);
                  setInput(h.input);
                  // ✅ Use if/else instead of ternary for side effects
                  if (h.type === "error") {
                    setLogs(h.msg);
                    setActiveTab("logs");
                  } else {
                    setOutput(h.msg);
                    setActiveTab("output");
                  }
                  setDrawerOpen(false);
                }}
              >
                <span className="flex items-center space-x-1">
                  {h.type === "success" ? (
                    <FiCpu className="text-green-500" />
                  ) : (
                    <FiTrash2 className="text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {h.timestamp}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor Pane */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 overflow-auto relative">
          <div className="grid grid-cols-[auto_1fr] h-full">
            {/* Gutter */}
            <div className="pr-2 text-right select-none text-gray-500 dark:text-gray-400">
              {code.split("\n").map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            {/* Code Editor */}
            <Editor
              ref={editorRef}
              value={code}
              onValueChange={setCode}
              highlight={(c) => highlight(c, languages[language])}
              padding={10}
              className="font-mono text-sm bg-transparent outline-none whitespace-pre"
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === " ") setShowSnippets(true);
              }}
            />
          </div>
          {/* Snippet Dropdown */}
          {showSnippets && (
            <ul className="absolute top-16 left-16 bg-white dark:bg-gray-700 shadow rounded p-2 z-30">
              {snippets[language].map((s) => (
                <li
                  key={s.label}
                  onClick={() => insertSnippet(s.code)}
                  className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                >
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* I/O Pane */}
        <div className="w-full sm:w-1/3 bg-white dark:bg-gray-900 p-4 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-2">
            {['input', 'output', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-orange-500 text-orange-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === "input" && (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter custom input..."
                className="w-full h-full p-2 border border-gray-300 dark:border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            )}
            {activeTab === "output" && (
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {output || "— no output —"}
              </pre>
            )}
            {activeTab === "logs" && (
              <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
                {logs || "— no logs —"}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
