import React, { useEffect, useState } from "react";
import { Asterisk, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ headerRef, aboutRef, navItems }) {
  // Navigation state
  const [navActive, setNavActive] = useState(false);
  const [navShow, setNavShow] = useState(false);
  const [navActiveIndex, setNavActiveIndex] = useState(0);
  const navigate = useNavigate();

  // Navigation bar items
  // The navItems prop will be used instead of the hardcoded array

  // Smooth scroll helper
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      window.scrollTo({ top: ref.current.offsetTop - 30, behavior: "smooth" });
    }
  };

  // Scroll/active logic for navbar
  useEffect(() => {
    function onScroll() {
      const y = window.pageYOffset;
      if (headerRef.current && y > headerRef.current.offsetHeight - 75) {
        setNavActive(true);
      } else {
        setNavActive(false);
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef]);
  return (
    <header
      ref={headerRef}
      className="relative h-screen bg-cover bg-center flex flex-col justify-between"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988534/header.jpg")',
      }}
    >
      {/* Overlay removed for brighter background image */}
      <nav aria-label="Main Navigation" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 ">
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-4 items-center bg-white/10 rounded-xl px-4 py-2 shadow-lg">
            {navItems.map((item, idx) => (
              <li key={item.name} className="relative">
                <a
                  href="#"
                  className={`flex items-center text-base font-semibold tracking-wide px-4 py-2 rounded-full transition-all duration-200 shadow-sm ${
                    navActiveIndex === idx
                      ? "bg-yellow-500 text-white shadow-md"
                      : navActive
                      ? "text-black hover:text-yellow-600 hover:bg-yellow-100"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900/30"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setNavActiveIndex(idx);
                    item.ref && scrollToRef(item.ref);
                  }}
                >
                  {item.name}
                </a>
                {/* Animated underline for active nav */}
                <span
                  className={`absolute left-6 right-6 -bottom-1 h-0.5 bg-yellow-500 rounded transition-all duration-300 ${
                    navActiveIndex === idx ? "opacity-100" : "opacity-0"
                  }`}
                ></span>
              </li>
            ))}
            {/* Management Access Button */}
            <li className="relative">
              <button
                className={`flex items-center gap-2 text-base font-semibold tracking-wide px-4 py-2 rounded-full transition-all duration-200 shadow-sm ${
                  navActive
                    ? "text-black hover:text-amber-600 hover:bg-amber-100"
                    : "text-white hover:text-amber-400 hover:bg-amber-900/30"
                } border border-amber-500/30`}
                onClick={() => navigate('/management')}
                title="Staff & Admin Access"
              >
                <Settings className="w-4 h-4" />
                Staff
              </button>
            </li>
          </ul>
          {/* Mobile Toggle */}
          <button
            aria-label="Toggle navigation menu z-10"
            aria-expanded={navShow}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 cursor-pointer ml-auto"
            onClick={() => setNavShow((s) => !s)}
          >
            <span
              className={`block w-8 h-1 bg-yellow-500 rounded transition-all duration-300 ${
                navShow ? "rotate-45 translate-y-2" : "mb-1"
              }`}
            ></span>
            <span
              className={`block w-8 h-1 bg-yellow-500 rounded transition-all duration-300 ${
                navShow ? "opacity-0" : "mb-1"
              }`}
            ></span>
            <span
              className={`block w-8 h-1 bg-yellow-500 rounded transition-all duration-300 ${
                navShow ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
        {/* Mobile Nav */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-90  flex flex-col items-center pt-24 ${
            navShow ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col items-center gap-8">
            {navItems.map((item, idx) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={`text-lg font-semibold tracking-wide text-yellow-100 px-4 py-2 rounded-lg transition-all duration-200 ${
                    navActiveIndex === idx
                      ? "bg-yellow-500 text-white"
                      : "hover:bg-yellow-700/30 hover:text-yellow-300"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setNavActiveIndex(idx);
                    item.ref && scrollToRef(item.ref);
                    setNavShow(false);
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
            {/* Mobile Management Access */}
            <li>
              <button
                className="flex items-center gap-2 text-lg font-semibold tracking-wide text-amber-100 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-amber-700/30 hover:text-amber-300 border border-amber-500/30"
                onClick={() => {
                  navigate('/management');
                  setNavShow(false);
                }}
              >
                <Settings className="w-5 h-5" />
                Staff Access
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center text-center mt-28 md:mt-40 relative">
        <h2 className="text-[80px] md:text-[100px] font-normal italic text-yellow-400 font-[Herr Von Muellerhoff,cursive] mb-2 md:mb-4 drop-shadow-lg">
          Welcome
        </h2>
        <h1 className="text-[40px] md:text-[60px] font-extrabold tracking-[9.4px] text-white font-sans mb-4 drop-shadow-lg">
          The Indian Coffee House
        </h1>
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="block w-10 h-1 bg-yellow-500 rounded"></span>
          <Asterisk className="text-yellow-500 w-6 h-6 mx-2 drop-shadow-lg" />
          <span className="block w-10 h-1 bg-yellow-500 rounded"></span>
        </div>
        <span className="text-yellow-100 text-lg mb-4 drop-shadow">
          Ready To Be Opened
        </span>
        <div className="mt-4">
          <button className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-xl hover:bg-yellow-600 transition-all duration-200 text-lg tracking-wide">
            Explore
          </button>
        </div>
      </div>
    </header>
  );
}
