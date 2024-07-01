// SearchService.js
// src/components/SearchService.js
import React from 'react';

const SearchService = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-gray-200 border p-2 rounded-md mr-2"
        />
        {/* Visible button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-sm">
          Search
        </button>
      </div>
    </>
  );
};

export default SearchService;
