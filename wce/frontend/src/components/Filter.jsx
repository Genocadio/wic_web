import React from 'react';

const Filter = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <label htmlFor="searchInput" className="mr-2 text-gray-700">Search:</label>
      <input
        id="searchInput"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        className="py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        style={{ height: '2.5rem' }}
      />
    </div>
  );
};

export default Filter;
