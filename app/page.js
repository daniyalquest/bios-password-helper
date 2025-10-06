'use client';

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [value, setValue] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [suggestions, setSuggestions] = useState({});

  async function fetchData() {
    try {
      const res = await fetch('/api/guesses');
      const data = await res.json();
      setGuesses(data.guesses || []);
      setSuggestions(data.suggestions || {});
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;

    await fetch('/api/guesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });

    setValue('');
    fetchData(); // refresh
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">🔐 BIOS Password Helper</h1>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
          <input
            type="password"
            placeholder="Enter guess"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded w-full bg-gray-700 text-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Save
          </button>
        </form>

        {/* Suggestions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Suggestions</h2>
          {Object.keys(suggestions).length === 0 ? (
            <p className="text-gray-300">No suggestions yet.</p>
          ) : (
            Object.entries(suggestions).map(([len, list]) => (
              <div key={len} className="mb-3">
                <h3 className="font-medium text-gray-200">{len}-digit options:</h3>
                <ul className="list-disc ml-4 overflow-x-auto">
                  {list.map((s, i) => (
                    <li key={i} className="font-mono break-all text-gray-100">{s}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Previous Attempts */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">Previous Attempts</h2>
          {guesses.length === 0 ? (
            <p className="text-gray-300">No previous attempts.</p>
          ) : (
            <ul className="list-disc ml-4 overflow-x-auto">
              {guesses.map((p, i) => (
                <li key={i} className="font-mono break-all text-gray-100">{p.value}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
