import React from "react";

export const MenuFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-amber-600 text-white"
              : "bg-white text-slate-700 hover:bg-amber-50 border border-amber-200"
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedCategory === category
                ? "bg-amber-600 text-white"
                : "bg-white text-slate-700 hover:bg-amber-50 border border-amber-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
