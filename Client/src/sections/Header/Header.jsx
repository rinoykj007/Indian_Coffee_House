import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./Header.css";

export default function Header({ headerRef, aboutRef, navItems }) {
  const [navActive, setNavActive] = useState(false);
  const [navShow, setNavShow] = useState(false);
  const [navActiveIndex, setNavActiveIndex] = useState(0);
  const navigate = useNavigate();

  const scrollToRef = (ref) => {
    if (ref?.current) {
      window.scrollTo({ top: ref.current.offsetTop - 30, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset;
      setNavActive(
        headerRef.current && y > headerRef.current.offsetHeight - 75
      );
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef]);
  return (
    <header
      ref={headerRef}
      className="relative h-screen bg-black bg-cover bg-center"
    >
      {/* Overlay removed for brighter background image */}
      <nav
        aria-label="Main Navigation"
        className="absolute top-0 left-0 right-0 z-[101]"
      >
        {/* Mobile Toggle */}
        <div className="absolute top-6 right-8 z-[102]">
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={navShow}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 cursor-pointer"
            onClick={() => setNavShow(!navShow)}
          >
            <span
              className={`block w-8 h-1 bg-yellow-500 rounded transition-all duration-300 ${
                navShow ? "rotate-45 translate-y-2" : "mb-1"
              }`}
            />
            <span
              className={`block w-8 h-1 bg-yellow-500 rounded transition-all duration-300 ${
                navShow ? "opacity-0" : "mb-1"
              }`}
            />
            <span
              className={`block w-8 h-1 bg-yellow-500 rounded transition-all duration-300 ${
                navShow ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-end px-8 py-6 pt-0">
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
                <span
                  className={`absolute left-6 right-6 -bottom-1 h-0.5 bg-yellow-500 rounded transition-all duration-300 ${
                    navActiveIndex === idx ? "opacity-100" : "opacity-0"
                  }`}
                />
              </li>
            ))}
            <li className="relative">
              <button
                className={`flex items-center gap-2 text-base font-semibold tracking-wide px-4 py-2 rounded-full transition-all duration-200 shadow-sm ${
                  navActive
                    ? "text-black hover:text-amber-600 hover:bg-amber-100"
                    : "text-white hover:text-amber-400 hover:bg-amber-900/30"
                } border border-amber-500/30`}
                onClick={() => navigate("/management")}
                title="Staff Access"
              >
                <Settings className="w-4 h-4" />
                Staff
              </button>
            </li>
          </ul>
        </div>
        {/* Mobile Nav */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-90 flex flex-col items-center pt-24 z-[99] ${
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
      <div className="header-logo flex items-center justify-center w-full h-full px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-5 w-full gap-8 md:gap-1 animate-fade-in-down relative">
          {/* Logo */}
          <div className="col-span-1 flex items-center justify-center">
            <img
              src={logo}
              alt="Payasam Kitchen"
              className="w-[45%] sm:w-[50%] md:w-[80%] lg:w-[90%] object-contain hover:scale-105 transition-transform duration-300 animate-float"
            />
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-4 flex flex-col justify-center items-center md:items-start animate-slide-in-right">
            <h1 className="gold text-center md:text-start mb-2">
              Payasam Kitchen
            </h1>
            <h6 className="gold text-center md:text-start gold-subtitle mb-4">
              Catering
            </h6>
            <p className="text-center md:text-start text-yellow-100 text-xl font-medium tracking-wider animate-fade-in relative md:pl-4 md:border-l-2 md:border-amber-500 md:ml-1 tagline-font">
              <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-amber-500/0 after:via-amber-500 after:to-amber-500/0">
                Enjoy the best food with us...
              </span>
            </p>
            <button className="mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full w-max flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg animate-pulse-subtle">
              <span className="font-medium text-sm sm:text-base">
                Order Now
              </span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          {/* Reviews Section */}
          <div className="md:absolute md:bottom-8 md:right-8 lg:right-12 bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-amber-500/20 shadow-lg animate-fade-in mt-8 md:mt-0 mx-auto md:mx-0 w-max">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User 1"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User 2"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/65.jpg"
                  alt="User 3"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white object-cover"
                />
              </div>
              <div className="text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold text-white">4.7</span>
                  <span className="text-yellow-100 hidden xs:inline">
                    (323 reviews)
                  </span>
                </div>
                <div className="text-yellow-100">300+ happy customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
