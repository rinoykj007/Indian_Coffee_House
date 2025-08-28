import React from "react";

export default function Footer({ footerRef }) {
  return (
    <div>
      {/* Top Contact Bar */}
      <div className="bg-slate-800 text-white py-3 px-6">
        <div className=" mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-white text-sm"></i>
            </div>
            <div>
              <div className="text-sm text-gray-300">Find us</div>
              <div className="text-sm font-medium">
                123 Spice Street, Dublin, Ireland
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <i className="fas fa-phone text-white text-sm"></i>
            </div>
            <div>
              <div className="text-sm text-gray-300">Call us</div>
              <div className="text-sm font-medium">+353 89 483 3944</div>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <i className="fas fa-envelope text-white text-sm"></i>
            </div>
            <div>
              <div className="text-sm text-gray-300">Mail us</div>
              <div className="text-sm font-medium">info@Payasam.ie</div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Footer */}
      <footer ref={footerRef} className="bg-slate-900 text-white py-8 px-6">
        <div className=" mx-auto flex flex-wrap justify-between gap-6">
          {/* Restaurant Info */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-start">
                <h3 className="text-xl font-bold text-white">Payasam</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 text-start">
              Experience authentic Indian flavors in the heart of Dublin. From
              traditional spices to modern presentations, we bring you the best
              of Indian cuisine.
            </p>
          </div>
          {/* Useful Links */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center align-center">
              <div className="flex flex-col space-y-2 text-start">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Our Services
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Contact Us
                </a>
              </div>
              <div className="flex flex-col space-y-2 text-start">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Portfolio
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Expert Team
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  Latest News
                </a>
              </div>
            </div>
          </div>
          {/* Subscribe */}
          <div className="flex-2 min-w-[300px] justify-start align-center  text-start">
            <h4 className="text-white font-semibold mb-3">Follow us</h4>
            <div className="flex flex-wrap justify-start items-center gap-3 mb-6">
              <a
                href="https://facebook.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
              >
                <i className="fab fa-facebook-f text-white text-sm"></i>
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors duration-300"
              >
                <i className="fab fa-twitter text-white text-sm"></i>
              </a>
              <a
                href="https://plus.google.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
              >
                <i className="fab fa-google-plus-g text-white text-sm"></i>
              </a>
              <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300"
              >
                <i className="fab fa-instagram text-white text-sm"></i>
              </a>
              <a
                href="https://youtube.com/yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
              >
                <i className="fab fa-youtube text-red-500 text-sm"></i>
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
              >
                <i className="fab fa-linkedin-in text-white text-sm"></i>
              </a>
            </div>

            <h3 className="text-white font-semibold text-lg mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Don't miss to subscribe to our new feeds, kindly fill the form
              below.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 transition-colors duration-300"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        {/* Copyright */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Indian Coffee House. All rights reserved. | Designed with ❤️
            for authentic Indian cuisine
          </p>
        </div>
      </footer>
    </div>
  );
}
