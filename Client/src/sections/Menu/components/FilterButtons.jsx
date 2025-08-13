import React from "react";

const FilterButtons = ({ categories, activeFilter, handleFilterClick }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-8">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => handleFilterClick(category)}
        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
          activeFilter === category
            ? "bg-amber-600 text-white shadow-lg"
            : "bg-white text-gray-700 border border-gray-200 hover:border-amber-600 hover:text-amber-600"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default FilterButtons;
