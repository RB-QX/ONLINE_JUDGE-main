// frontend/src/pages/ProblemsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const url = difficulty
          ? `${process.env.REACT_APP_BACKEND_URL}problemsdifficulty?difficulty=${difficulty}`
          : `${process.env.REACT_APP_BACKEND_URL}allproblems`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch problems");
        const data = await res.json();
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [difficulty]);

  // Client‑side filtering by title
  const filtered = useMemo(() => {
    return problems.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [problems, searchTerm]);

  // Difficulty badge colors
  const diffColor = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Problems
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="text"
          aria-label="Search problems"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"  /* :contentReference[oaicite:1]{index=1} */
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"  /* :contentReference[oaicite:2]{index=2} */
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
        >
          {filtered.map((p) => (
            <article
              key={p._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
              role="listitem"
              aria-labelledby={`title-${p._id}`}  /* :contentReference[oaicite:3]{index=3} */
            >
              <header>
                <h2
                  id={`title-${p._id}`}
                  className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100"
                >
                  {p.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {p.description.slice(0, 80)}...
                </p>
              </header>
              <footer className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${diffColor(
                    p.difficulty
                  )}`}
                >
                  {p.difficulty}
                </span>
                <Link
                  to={`/problems/${p._id}`}
                  className="text-orange-500 hover:underline"
                >
                  View
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
