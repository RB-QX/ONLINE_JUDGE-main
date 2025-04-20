// frontend/src/pages/UpdatePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch existing problem data
    fetch(`${process.env.REACT_APP_BACKEND_URL}problems/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load problem');
        return res.json();
      })
      .then(data => {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setDifficulty(data.difficulty || 'Easy');
        setTags((data.tags || []).join(', '));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      difficulty,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}problems/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('Update failed');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Update Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Updating…' : 'Update Problem'}
        </button>
      </form>
    </div>
  );
}