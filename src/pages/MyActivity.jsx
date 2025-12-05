import React, { useState } from "react";

export default function MyActivity() {
  const [activeSection, setActiveSection] = useState("Section 1");

  const imagesSection1 = [
    "assets/design1.jpg",
    "assets/design2.jpg",
    "assets/design3.jpg",
    "assets/design4.jpg",
    "assets/design5.jpg",
    "assets/design6.jpg",
  ];
  const imagesSection2 = [
    "assets/necklace1.jpg",
    "assets/necklace2.jpg",
    "assets/necklace3.jpg",
    "assets/necklace4.jpg",
  ];
  const imagesSection3 = [
    "assets/ring1.jpg",
    "assets/ring2.jpg",
    "assets/ring3.jpg",
  ];

  const getImages = () => {
    if (activeSection === "Section 1") return imagesSection1;
    if (activeSection === "Section 2") return imagesSection2;
    return imagesSection3;
  };

  return (
    <div className="bg-[#e5e2df] min-h-screen w-full flex flex-col items-center text-[#1a1a1a] font-sans overflow-x-hidden">
      {/* 🔹 Backdrop */}
      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-black flex justify-center items-center relative">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
          Backdrop
        </h1>
      </div>

      {/* 🔹 Profile Section */}
      <div className="relative w-full max-w-6xl flex flex-col items-center -mt-14 sm:-mt-16 md:-mt-20 px-4 sm:px-6 md:px-8">
        {/* Circular Image/Video Placeholder */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-[#d8d8d8] rounded-full border-4 border-white flex justify-center items-center text-center text-xs sm:text-sm md:text-base text-gray-600 overflow-hidden">
          <span>
            Image + <br className="sm:hidden" /> Introductory <br /> Video
          </span>
        </div>

        {/* Username & Handle */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-600">@talha_028</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
            TALHA HAMEED
          </h2>
        </div>

        {/* Description Box */}
        <div className="w-full max-w-3xl mt-5 sm:mt-6 bg-[#dcdada] rounded-xl py-4 sm:py-6 px-5 sm:px-8 text-center text-gray-800 text-sm sm:text-base">
          Description
        </div>

        {/* 🔹 Vertical Social Icons (Right Side) */}
        <div className="absolute right-4 sm:right-10 top-[50%] translate-y-[-50%] hidden md:flex flex-col items-center space-y-4">
          {/* Facebook */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md border border-[#1a1a1a]/10 flex justify-center items-center hover:bg-[#202020] transition-all duration-300 hover:scale-110"
          >
            <img src="assets/facebook.svg" alt="Facebook" className="h-4 w-4" />
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md border border-[#1a1a1a]/10 flex justify-center items-center hover:bg-[#202020] transition-all duration-300 hover:scale-110"
          >
            <img
              src="assets/instagram.svg"
              alt="Instagram"
              className="h-4 w-4"
            />
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md border border-[#1a1a1a]/10 flex justify-center items-center hover:bg-[#202020] transition-all duration-300 hover:scale-110"
          >
            <img src="assets/linkedin.svg" alt="LinkedIn" className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* 🔹 Section Buttons (Always Horizontal) */}
      <div className="w-full max-w-3xl mt-10 sm:mt-12 flex justify-between items-center px-2">
        {["Section 1", "Section 2", "Section 3"].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`text-sm sm:text-base md:text-lg font-medium py-2 px-6 rounded-full transition-all duration-300 ${
              activeSection === section
                ? "bg-[#202020] text-white shadow-md"
                : "bg-transparent text-gray-600 hover:text-[#1a1a1a]"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* 🔹 Image Grid */}
      <div className="w-full max-w-6xl px-4 sm:px-6 mt-8 sm:mt-10 pb-16 sm:pb-24 transition-all duration-500 ease-in-out">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {getImages().map((src, index) => (
            <div
              key={index}
              className="w-full max-w-[420px] aspect-square bg-[#e2e2e2] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={src}
                alt={`Design ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
