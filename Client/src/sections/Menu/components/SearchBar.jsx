import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="max-w-md mx-auto mb-12">
    <div className="relative">
      <input
        type="text"
        placeholder="Search for dishes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <i className="fas fa-search text-gray-400"></i>
      </div>
    </div>
  </div>
);

export default SearchBar;
