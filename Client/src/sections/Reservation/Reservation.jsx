import React from "react";

export default function Reservation() {
  return (
    <div className="reservation">
      <div className="text animate-fade-in-up">
        <h2 className="text-4xl md:text-6xl font-greatvibes bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-pulse hover:animate-none hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 transition-all duration-500 cursor-pointer">
          Culinary
        </h2>
        <h3 className="text-5xl md:text-7xl font-oxanium font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent animate-slide-in-right hover:from-amber-600 hover:via-orange-500 hover:to-red-500 transition-all duration-700 cursor-pointer">
          Delight
        </h3>
        <div className="my-4">
          <i className="fas fa-asterisk text-emerald-500 text-2xl animate-spin hover:animate-pulse transition-all duration-300"></i>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg hover:text-gray-900 transition-colors duration-300 animate-slide-in-right">
          We promise an intimate and relaxed dining experience that offers
          something different to local and foreign patrons and ensures you enjoy
          a memorable food experience every time.
        </p>
        <div className="mt-6">
          <a className="a-CTA inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" href="#">
            Make a Reservation
          </a>
        </div>
      </div>
      <div className="image-container relative h-96 md:h-[500px] flex flex-wrap gap-3 p-4">
        {/* Top row */}
        <div className="flex gap-3 w-full h-1/2">
          {/* Top left - medium rectangle */}
          <div className="image image1 w-2/5 h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up border-4 border-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-lg relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-lg animate-spin" style={{ animation: 'spin 3s linear infinite' }}></div>
            <img
              src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop"
              alt="Indian Curry Dishes"
              className="w-full h-full object-cover rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10 m-1"
            />
          </div>
          
          {/* Top right - tall rectangle */}
          <div className="image image2 flex-1 h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up relative overflow-hidden rounded-lg" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-lg" style={{ animation: 'spin 4s linear infinite reverse' }}></div>
            <img
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=400&fit=crop"
              alt="Butter Chicken"
              className="w-full h-full object-cover rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10 m-1"
            />
          </div>
        </div>
        
        {/* Bottom row */}
        <div className="flex gap-3 w-full h-1/2">
          {/* Bottom left - tall rectangle */}
          <div className="image image3 w-1/3 h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up relative overflow-hidden rounded-lg" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-lg" style={{ animation: 'spin 2.5s linear infinite' }}></div>
            <img
              src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=250&h=350&fit=crop"
              alt="Biryani"
              className="w-full h-full object-cover rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10 m-1"
            />
          </div>
          
          {/* Bottom right - wide rectangle */}
          <div className="image image4 flex-1 h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up relative overflow-hidden rounded-lg" style={{ animationDelay: '0.8s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-lg" style={{ animation: 'spin 3.5s linear infinite reverse' }}></div>
            <img
              src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=350&h=250&fit=crop"
              alt="Indian Naan & Dal"
              className="w-full h-full object-cover rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10 m-1"
            />
          </div>
        </div>
        
        {/* Floating accent elements */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-emerald-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-teal-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 bg-cyan-400/35 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
