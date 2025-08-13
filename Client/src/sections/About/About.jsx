import React from "react";

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-15 lg:gap-20 items-center">
        {/* Content Section */}
        <div className="lg:pr-5 text-center lg:text-left">
          {/* Header Section */}
          <div className="mb-8">
            <span className="inline-block text-amber-600 text-sm font-medium tracking-widest uppercase mb-3">
              Discover
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-5 leading-tight font-serif">
              Our Story
            </h2>
            <div className="flex items-center justify-center lg:justify-start mb-5">
              <i className="fas fa-utensils text-amber-600 text-xl mr-4"></i>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-600 to-transparent max-w-xs"></div>
            </div>
          </div>

          {/* Description and Features */}
          <div className="mb-10">
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-light">
              Welcome to our culinary haven, where tradition meets innovation.
              Nestled in the heart of Ireland, our restaurant celebrates the
              rich flavors of authentic Irish cuisine while embracing modern
              culinary techniques. Every dish tells a story of our heritage,
              crafted with locally sourced ingredients and served with genuine
              Irish hospitality.
            </p>

            <div className="flex items-center justify-between flex-row">
              <div className="flex flex-col space-y-4">
                <span className="text-slate-800 font-medium">
                  Farm-to-Table Fresh
                </span>
                <span className="text-slate-800 font-medium">
                  Made with Love
                </span>
                <span className="text-slate-800 font-medium">
                  Family Tradition
                </span>
              </div>
              {/* Call-to-Action Buttons */}
              <div className="flex flex-col items-center justify-center lg:justify-start gap-5">
                <a
                  href="#contact"
                  className="text-amber-600 font-medium text-base relative transition-colors duration-300 hover:text-amber-700 group w-full sm:w-auto text-center"
                >
                  Visit Us Today
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#menu"
                  className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-2 rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-600/30 w-full sm:w-auto text-center max-w-xs"
                >
                  Explore Our Menu
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-5 h-96 lg:h-[500px]">
            {/* Main Restaurant Image */}
            <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-2 group">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Elegant restaurant interior with warm lighting"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-5 left-5 bg-black/70 text-white px-5 py-2 rounded-full backdrop-blur-sm">
                <span className="font-medium text-sm">Warm & Welcoming</span>
              </div>
            </div>

            {/* Secondary Images Column */}
            <div className="flex flex-col gap-5">
              {/* Food Image */}
              <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 group">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Delicious Irish cuisine plated beautifully"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Chef Image */}
              <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 group">
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Chef preparing fresh ingredients"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
