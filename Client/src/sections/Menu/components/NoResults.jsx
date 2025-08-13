import React from "react";

const NoResults = ({ setActiveFilter, setSearchTerm }) => (
  <div className="text-center py-16">
    <i className="fas fa-search text-gray-300 text-6xl mb-4"></i>
    <h3 className="text-2xl font-semibold text-gray-600 mb-2">No dishes found</h3>
    <p className="text-gray-500 mb-6">
      Try adjusting your search or filter criteria
    </p>
    <button
      onClick={() => {
        setActiveFilter("All");
        setSearchTerm("");
      }}
      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300"
    >
      Clear Filters
    </button>
  </div>
);

export default NoResults;
