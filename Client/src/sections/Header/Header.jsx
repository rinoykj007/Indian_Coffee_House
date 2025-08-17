import React, { useEffect, useState } from "react";
import { Asterisk, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import header from "../../assets/header.png";

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
      className="relative h-screen bg-cover bg-center flex flex-col justify-center pt-8"
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
                onClick={() => navigate("/management")}
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
                  navigate("/management");
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
      <div className="flex flex-col lg:flex-row items-center justify-between relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-20 gap-8 sm:gap-12 lg:gap-32">
        <div className="flex flex-col items-center lg:items-start justify-center lg:w-1/2 z-10 lg:pr-12 w-full">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[52px] font-bold text-white mb-2 sm:mb-3 leading-tight text-center lg:text-left">
            Enjoy the best
            <br />
            <span className="text-yellow-400">food</span> with
            <br />
            us... 🍔
          </h1>
          <p className="text-yellow-100 text-sm sm:text-base mb-4 sm:mb-6 max-w-md leading-relaxed text-center lg:text-left">
            Experience authentic Indian flavors crafted with love and tradition.
            From aromatic coffee to delicious meals, we bring you the taste of
            India.
          </p>
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl mb-4 sm:mb-0">
            Order Now →
          </button>

          <div className="flex items-center gap-3 mt-4 sm:mt-6">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-300 border-2 border-white"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500 border-2 border-white"></div>
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold text-white">4.7</span>
                <span className="text-yellow-100">(323 reviews)</span>
              </div>
              <div className="text-yellow-100">300+ happy customers</div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center lg:justify-end relative w-full">
          <div className="relative max-w-xs sm:max-w-sm lg:max-w-none">
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-yellow-400/20 rounded-full w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96"></div>
            <img
              src={header}
              alt="Indian Coffee House Chef"
              className="relative z-10 w-40 sm:w-56 lg:w-80 h-auto object-contain rounded-2xl"
            />

            {/* Floating elements - hidden on mobile */}
            <div className="hidden sm:block absolute top-4 lg:top-8 -left-4 lg:-left-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 lg:p-3 text-xs lg:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">🚀</span>
                <span className="font-semibold">Fastest Delivery</span>
              </div>
            </div>

            <div className="hidden sm:block absolute bottom-4 lg:bottom-8 -right-4 lg:-right-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 lg:p-3 text-xs lg:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500 rounded"></div>
                <div>
                  <div className="font-semibold">Best Coffee</div>
                  <div className="text-gray-600">₹45</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
