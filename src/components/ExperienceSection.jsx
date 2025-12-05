import React, { useState } from "react";

export default function ExperienceSection() {
  const [active, setActive] = useState("luxury");

  return (
    <section className="flex justify-center items-center py-16 bg-[#111]">
      <div className="relative w-[96%] max-w-[1600px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
        {/* Toggle Switch (on top of images) */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative bg-gray-300/60 rounded-full w-[220px] h-[20px] flex items-center p-[2px] shadow-md cursor-pointer">
            {/* Sliding Knob */}
            <div
              onClick={() =>
                setActive(active === "luxury" ? "jewelry" : "luxury")
              }
              className={`absolute top-[2px] left-[2px] h-[16px] w-[100px] bg-black rounded-full transition-transform duration-500 ease-in-out ${
                active === "luxury" ? "translate-x-0" : "translate-x-[104px]"
              }`}
            ></div>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-[85vh] flex justify-center items-center p-[10px]">
          <div className="relative w-[94%] h-[94%] rounded-2xl overflow-hidden">
            <img
              src="assets/e1.webp"
              alt="Experience Personal Luxury"
              className={`absolute inset-0 w-full h-full object-contain rounded-2xl transition-all duration-700 ${
                active === "luxury" ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
            <img
              src="assets/e2.webp"
              alt="Start Your Jewelry Line"
              className={`absolute inset-0 w-full h-full object-contain rounded-2xl transition-all duration-700 ${
                active === "jewelry" ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
