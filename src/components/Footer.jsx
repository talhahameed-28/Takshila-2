import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ✅ Outer Background */}
      <div className="bg-[#e5e2df] pb-6 flex justify-center px-6 transition-colors duration-500">
        {/* 🌌 Dark Glass Footer */}
        <footer
          className="relative w-full max-w-[1400px] rounded-3xl 
          bg-[#202020]/70 backdrop-blur-3xl border border-white/10 text-gray-200 
          shadow-2xl py-14 px-8 md:px-20 overflow-hidden transition-all duration-500"
        >
          {/* ✨ Glass Shine Layers */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl 
                          bg-gradient-to-tr from-white/15 via-transparent to-transparent 
                          opacity-30 blur-md"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 blur-sm opacity-50"></div>

          {/* Content Grid */}
          <div className="relative z-10 max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-20">
            {/* Logo + Info */}
            <div className="space-y-6">
              <img
                src="assets/logoo.svg"
                alt="Takshila Logo"
                className="h-14 w-14 drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
              />
              <p className="text-sm leading-relaxed text-gray-400">
                Takshila is a company focused on creating decentralized shared
                P2P economic systems to enable freedom in digital business
                environments for all stakeholders.
              </p>

              <div className="flex space-x-4 pt-2">
                {["facebook.svg", "instagram.svg", "linkedin.svg"].map(
                  (icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition backdrop-blur-md shadow-sm hover:shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                    >
                      <img
                        src={`assets/${icon}`}
                        alt={icon}
                        className="h-4 w-4 invert"
                      />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Customer Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]">
                CUSTOMER SERVICES
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Our Story", "FAQ's", "Contact us", "Blogs"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:underline hover:text-white transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]">
                Privacy & Legal
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  {name:"Privacy Policy",path:"/privacy-policy"},
                  {name:"Terms & Conditions",path:"/terms-&-conditions"},
                  {name:"Refund Policy",path:"/refund-policy"},
                  {name:"Shipping Policy",path:"/shipping-policy"},
                ].map((item) => (
                  <li key={item.name}>
                    <NavLink
                        to={item.path}
                        className={({isActive})=>`${isActive?"underline":""} transition-all text-gray-300 hover:text-white` }
                      >{item.name}</NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]">
                Subscribe Newsletter
              </h3>
              <p className="text-sm mb-4 text-gray-400">
                Sign up for the latest offers and exclusives.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-l-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-md"
                />
                <button className="px-4 rounded-r-lg bg-white/10 hover:bg-white/20 transition">
                  <img
                    src="assets/mail.svg"
                    alt="Send"
                    className="h-5 w-5 invert"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Gloss Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {/* Copyright */}
          <div className="relative mt-12 text-center text-xs border-t pt-6 border-white/10 text-gray-500">
            Copyright © 2025 Takshila. All Rights Reserved.
          </div>
        </footer>
      </div>

      {/* Scroll Progress Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full 
                   bg-[#202020]/80 backdrop-blur-md border border-white/10 
                   shadow-lg hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] 
                   flex items-center justify-center transition-all duration-300"
      >
        <svg
          className="absolute w-12 h-12 transform -rotate-90"
          viewBox="0 0 36 36"
        >
          <path
            stroke="#cfcfcf"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset={100 - scrollProgress}
            d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
            style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 z-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </>
  );
}
