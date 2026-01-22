import React, { useState } from 'react';
import { searchIgboWord } from '../services/igboService';

const IgboHelper = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    const data = await searchIgboWord(searchTerm);
    if (data && data.length > 0) {
      setResult(data[0]); // Returns the first matching word object
    } else {
      setResult({ word: "Not found", definitions: ["No match found in IgboAPI"] });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Igbo Dictionary Helper</h3>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Type English word..." 
          className="border p-2 rounded w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-2 bg-white rounded border">
          <p className="font-bold text-green-700">{result.word}</p>
          <p className="text-sm italic">{result.definitions[0]}</p>
        </div>
      )}
    </div>
  );
};

export default IgboHelper;