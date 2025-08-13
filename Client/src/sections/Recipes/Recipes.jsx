import React from "react";

export default function Recipes() {
  return (
    <div className="recipes">
      <div className="image" />
      <div className="text">
        <h2 className="text-4xl md:text-6xl font-greatvibes text-amber-600 animate-fade-in-up hover:scale-110 transition-transform duration-300 cursor-pointer">
          Tasteful
        </h2>
        <h3 className="text-5xl md:text-7xl font-oxanium font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent animate-slide-in-right hover:from-amber-700 hover:via-orange-600 hover:to-red-600 transition-all duration-500 cursor-pointer">
          Recipes
        </h3>
      </div>
    </div>
  );
}
