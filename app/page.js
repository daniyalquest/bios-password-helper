'use client';

import React, { useState, useEffect } from 'react';

// Helper to generate suggestions from seeds + failed guesses
function generateSuggestions(seeds, guesses) {
  let categories = { 4: [], 5: [], 6: [], 7: [], 8: [] };
  const used = new Set(guesses.map((g) => g.value));

  seeds.forEach((item) => {
    const digits = item.value.replace(/\D/g, "");
    Object.keys(categories).forEach((lenStr) => {
      const len = parseInt(lenStr);
      for (let i = 0; i <= digits.length - len; i++) {
        const candidate = digits.substr(i, len);
        if (
          candidate.length === len &&
          !used.has(candidate) &&
          !categories[len].includes(candidate)
        ) {
          categories[len].push(candidate);
        }
      }
    });
  });

  // Only keep the first 3 suggestions per category
  Object.keys(categories).forEach((len) => {
    categories[len] = categories[len].slice(0, 3);
  });

  return categories;
}

export default function Page() {
  const [value, setValue] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [suggestions, setSuggestions] = useState({});

  // Load seeds and guesses from API on first render
  useEffect(() => {
    async function fetchData() {
      const [personalRes, guessesRes] = await Promise.all([
        fetch('/api/personal'),
        fetch('/api/guesses'),
      ]);
      const personalData = await personalRes.json();
      const guessesData = await guessesRes.json();

      setSeeds(personalData);
      setGuesses(guessesData);
      setSuggestions(generateSuggestions(personalData, guessesData));
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = String(value || '').trim();
    if (!trimmed) return;

    // Save guess to the database
    await fetch('/api/guesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: trimmed }),
    });

    // Update local state
    const newGuesses = [{ value: trimmed }, ...guesses];
    setGuesses(newGuesses);
    setSuggestions(generateSuggestions(seeds, newGuesses));
    setValue('');
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          🔐 BIOS Password Helper
        </h1>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter guess"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded w-full bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
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
                    <li key={i} className="font-mono break-all text-gray-100">
                      {s}
                    </li>
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
                <li key={i} className="font-mono break-all text-gray-100">
                  {p.value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
