import React from "react";
import { Asterisk } from "lucide-react";

const HeaderSection = () => (
  <div className="text-center mb-8 relative overflow-hidden">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-10 left-1/4 w-32 h-32 bg-amber-100 rounded-full opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-5 right-1/4 w-24 h-24 bg-orange-100 rounded-full opacity-30 animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>

    {/* Subtitle with slide-in animation */}
    <span
      className="inline-block text-amber-600 text-sm font-semibold tracking-[0.2em] uppercase mb-2 transform transition-all duration-1000 ease-out animate-fade-in-up opacity-0"
      style={{ animation: "fadeInUp 0.8s ease-out 0.2s forwards" }}
    >
      Discover Our Culinary
    </span>

    {/* Main Title with staggered animation */}
    <h1
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 leading-tight transform transition-all duration-1000 ease-out opacity-0"
      style={{
        animation: "fadeInUp 1s ease-out 0.5s forwards",
        fontFamily: "serif",
      }}
    >
      <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent animate-gradient-x">
        Menu
      </span>
      <br />
      <span className="text-slate-700">Collection</span>
    </h1>

    {/* Decorative divider with animation */}
    <div
      className="flex items-center justify-center gap-3 mb-4 opacity-0"
      style={{ animation: "fadeInUp 0.8s ease-out 0.8s forwards" }}
    >
      <span
        className="block w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500 transform origin-left scale-x-0"
        style={{ animation: "scaleX 0.8s ease-out 1.2s forwards" }}
      ></span>
      <Asterisk className="text-amber-500 w-6 h-6 animate-spin-slow" />
      <span
        className="block w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500 transform origin-right scale-x-0"
        style={{ animation: "scaleX 0.8s ease-out 1.2s forwards" }}
      ></span>
    </div>

    {/* Description with fade-in */}
    <p
      className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-light opacity-0 transform translate-y-4"
      style={{ animation: "fadeInUp 0.8s ease-out 1s forwards" }}
    >
      Explore our extensive collection of{" "}
      <span className="text-amber-600 font-medium">
        authentic Indian dishes
      </span>
      , carefully crafted with traditional recipes and the finest ingredients
      sourced from across India.
    </p>

    {/* Floating elements for ambiance */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        className="absolute top-1/4 left-10 w-2 h-2 bg-amber-400 rounded-full opacity-40 animate-ping"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-3/4 right-16 w-1 h-1 bg-orange-400 rounded-full opacity-50 animate-ping"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-30 animate-ping"
        style={{ animationDelay: "4s" }}
      ></div>
    </div>

    {/* Custom CSS animations */}
    <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes scaleX {
        from {
          transform: scaleX(0);
        }
        to {
          transform: scaleX(1);
        }
      }
      
      @keyframes gradient-x {
        0%, 100% {
          background-size: 200% 200%;
          background-position: left center;
        }
        50% {
          background-size: 200% 200%;
          background-position: right center;
        }
      }
      
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 3s ease infinite;
      }
      
      .animate-spin-slow {
        animation: spin 4s linear infinite;
      }
    `}</style>
  </div>
);

export default HeaderSection;
