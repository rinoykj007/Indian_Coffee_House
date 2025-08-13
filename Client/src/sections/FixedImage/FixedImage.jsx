import React from "react";

export default function FixedImage({ fixedImageRef }) {
  return (
    <div className="fixed-image" ref={fixedImageRef}>
      <div className="text animate-fade-in-up">
        <h2 className="text-5xl md:text-7xl font-greatvibes text-white animate-pulse hover:animate-none transition-all duration-500 cursor-pointer drop-shadow-2xl">
          The Perfect
        </h2>
        <h3 className="text-6xl md:text-8xl font-oxanium font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent animate-slide-in-right hover:from-amber-500 hover:via-yellow-400 hover:to-orange-500 transition-all duration-700 cursor-pointer drop-shadow-lg">
          Blend
        </h3>
      </div>
    </div>
  );
}
