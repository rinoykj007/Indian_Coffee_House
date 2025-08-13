import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Menu({ menuRef }) {
  const menuImages = [
    "https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988517/big-menu-thumb-1.jpg",
    "https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988526/big-menu-thumb-2.jpg",
    "https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988525/big-menu-thumb-4.jpg",
    "https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988524/big-menu-thumb-6.jpg",
  ];
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImgIdx, setModalImgIdx] = useState(0);
  return (
    <div className="menu" ref={menuRef}>
      {/* Modal Box Model */}
      <div
        className={`box-model backdrop-blur-sm bg-black/80 transition-all duration-300${
          modalOpen ? " active" : ""
        }`}
        onClick={(e) => {
          if (
            e.target.classList.contains("close") ||
            e.target.classList.contains("box-model")
          )
            setModalOpen(false);
        }}
      >
        <i className="fas fa-times fa-2x close text-white hover:text-amber-400 transition-colors duration-200 cursor-pointer"></i>
        <div className="arrow">
          <div
            className="arrow arrow-right bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            onClick={() =>
              setModalImgIdx((idx) => (idx + 1) % menuImages.length)
            }
          ></div>
          <div
            className="arrow arrow-left bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            onClick={() =>
              setModalImgIdx(
                (idx) => (idx - 1 + menuImages.length) % menuImages.length
              )
            }
          ></div>
        </div>
        <div className="box-image-container">
          <div className="box-image">
            <img
              src={menuImages[modalImgIdx]}
              alt="Food Photo"
              className="active rounded-lg shadow-2xl transition-all duration-300"
            />
          </div>
        </div>
      </div>
      <div className="menu-image-container">
        {menuImages.map((src, idx) => (
          <div
            className={`image transform transition-all duration-300 hover:scale-105 hover:shadow-xl${
              modalImgIdx === idx && modalOpen ? " active" : ""
            }`}
            key={src}
          >
            <img
              src={src}
              alt="Food Photo"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => {
                setModalOpen(true);
                setModalImgIdx(idx);
              }}
            />
          </div>
        ))}
      </div>
      <div className="text animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-greatvibes text-amber-600 hover:text-amber-700 transition-colors duration-300 cursor-pointer animate-pulse hover:animate-none">
          Discover
        </h2>
        <h3 className="text-4xl md:text-6xl font-oxanium font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent hover:from-amber-600 hover:via-orange-500 hover:to-red-500 transition-all duration-500 cursor-pointer">
          Menu
        </h3>
        <div className="my-4">
          <i className="fas fa-asterisk text-amber-500 text-2xl animate-spin hover:animate-pulse transition-all duration-300"></i>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg hover:text-gray-900 transition-colors duration-300 animate-slide-in-right">
          For those with pure food indulgence in mind, come next door and sate
          your desires with our ever changing internationally and seasonally
          inspired small plates. We love food, lots of different food, just like
          you.
        </p>
        <div className="mt-6">
          <Link
            to="/MenuList"
            className="a-CTA inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View The Full Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
