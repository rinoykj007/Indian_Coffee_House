import React, { useEffect, useRef, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../App.css";
import Header from "../sections/Header/Header.jsx";
import About from "../sections/About/About.jsx";
import Recipes from "../sections/Recipes/Recipes.jsx";
import Menu from "../sections/Menu/Menu.jsx";
import FixedImage from "../sections/FixedImage/FixedImage.jsx";
import Reservation from "../sections/Reservation/Reservation.jsx";
import Footer from "../sections/Footer/Footer.jsx";

export default function App() {
  // Loader state
  const [loading, setLoading] = useState(true);
  // Navbar active state
  const [navActive, setNavActive] = useState(false);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImgIdx, setModalImgIdx] = useState(0);
  // Dots state
  const [dotActive, setDotActive] = useState(0);
  const [dotBlack, setDotBlack] = useState([false, false, false]);

  // Refs for scrolling (must be created with useRef and not frozen)
  const headerRef = useRef(null);
  const aboutRef = useRef(null);
  const recipesRef = useRef(null);
  const menuRef = useRef(null);
  const fixedImageRef = useRef(null);
  const footerRef = useRef(null);

  // Debug log after all state declarations
  console.log("loading state:", loading);

  // Loader fade out effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);
  // Scroll/active logic
  useEffect(() => {
    function onScroll() {
      const y = window.pageYOffset;
      // Navbar fixed and logo color
      if (headerRef.current && y > headerRef.current.offsetHeight - 75) {
        setNavActive(true);
      } else {
        setNavActive(false);
      }
      // Dots logic
      if (
        !headerRef.current ||
        !recipesRef.current ||
        !menuRef.current ||
        !fixedImageRef.current ||
        !footerRef.current
      )
        return;
      let active = 0;
      let black = [false, false, false];
      if (y < headerRef.current.offsetHeight * 0.5) {
        active = 0;
      } else if (
        y > headerRef.current.offsetHeight * 0.5 &&
        y < recipesRef.current.offsetTop * 0.72
      ) {
        black = [true, true, true];
      } else if (
        y > recipesRef.current.offsetTop * 0.75 &&
        y < menuRef.current.offsetTop * 0.81
      ) {
        active = 1;
      } else if (
        y > menuRef.current.offsetTop * 0.81 &&
        y < fixedImageRef.current.offsetTop * 0.86
      ) {
        black = [true, true, true];
        active = 1;
      } else if (
        y > fixedImageRef.current.offsetTop * 0.86 &&
        y < footerRef.current.offsetTop * 0.72
      ) {
        active = 2;
      } else if (
        y > footerRef.current.offsetTop * 0.72 &&
        y < footerRef.current.offsetTop * 0.901
      ) {
        black = [true, true, true];
      }
      setDotActive(active);
      setDotBlack(black);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Modal keyboard navigation
  useEffect(() => {
    function onKeyDown(e) {
      if (!modalOpen) return;
      if (e.code === "Escape") setModalOpen(false);
      if (e.code === "ArrowRight")
        setModalImgIdx((idx) => (idx + 1) % menuImages.length);
      if (e.code === "ArrowLeft")
        setModalImgIdx(
          (idx) => (idx - 1 + menuImages.length) % menuImages.length
        );
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  // Smooth scroll helpers
  const scrollToRef = (ref) => {
    window.scrollTo({ top: ref.current.offsetTop - 30, behavior: "smooth" });
  };

  // Navigation bar items
  const navItems = [
    { name: "Home", ref: headerRef },
    { name: "Menu", ref: menuRef },
    { name: "About", ref: aboutRef },
    { name: "Blog", ref: null },
    { name: "Shop", ref: null },
    { name: "Contact", ref: footerRef },
  ];

  return (
    <div>
      {/* Loader */}
      {loading && (
        <div className="loader-wrap">
          <div className="loader">
            {[...Array(10)].map((_, i) => (
              <span className="loader-item" key={i}></span>
            ))}
          </div>
        </div>
      )}
      {/* Dots */}
      <div className="dots">
        {["one", "two", "three"].map((cls, i) => (
          <div
            key={cls}
            className={`${dotActive === i ? "active" : ""} ${
              dotBlack[i] ? "black" : ""
            } ${cls}`}
            onClick={() => {
              if (i === 0) scrollToRef(headerRef);
              if (i === 1) scrollToRef(recipesRef);
              if (i === 2) scrollToRef(fixedImageRef);
            }}
            data-x={i === 0 ? "header" : i === 1 ? ".recipes" : ".fixed-image"}
          ></div>
        ))}
      </div>
      <Header headerRef={headerRef} aboutRef={aboutRef} navItems={navItems} />
      <About aboutRef={aboutRef} />
      <Recipes ref={recipesRef} />
      <Menu menuRef={menuRef} />
      {/* Fixed Image */}
      <FixedImage fixedImageRef={fixedImageRef} />
      <Reservation />
      <Footer footerRef={footerRef} />
    </div>
  );
}
