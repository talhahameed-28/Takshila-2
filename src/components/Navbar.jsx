import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import AuthModals from "./AuthModals";
import toast from "react-hot-toast";

export default function Navbar() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  // 🔹 New: track login state
  const [user, setUser] = useState(null);

  // 🔹 Refs for click-outside detection
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const aboutRef = useRef(null);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => setModalOpen(false);

  // ✅ Allow modal to switch between login/signup (and future otp)
  const handleSwitchType = (type) => setModalType(type);

  // ✅ New: Check localStorage for logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ New: Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    setShowProfileMenu(false);
    toast.success("Logged out successfully");
    window.location.reload();
  };

  // 🔹 Navbar scroll blur
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target))
        setShowAboutMenu(false);
      if (profileRef.current && !profileRef.current.contains(event.target))
        setShowProfileMenu(false);
      if (searchRef.current && !searchRef.current.contains(event.target))
        setShowSearch(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Auto-close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileItems = [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community" },
    { name: "Catalogue", path: "/catalogue" },
    { name: "My Activity", path: "/my-activity" },
    { name: "Our Story", path: "/our-story" },
    { name: "Blogs", path: "/blogs" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 🔹 Navbar Header */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-center px-8 py-4 z-50 transition-all duration-500 ${
          isScrolled ? "bg-transparent" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-6xl space-x-6 px-4 py-2 rounded-full bg-[#2E4B45]/60 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-500">
          {/* Logo */}
          <div>
            <img src="assets/logo.png" alt="Logo" className="h-8" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-white">
            {[
              { name: "Home", path: "/" },
              { name: "Community", path: "/community" },
              { name: "Catalogue", path: "/catalogue" },
              { name: "My Activity", path: "/my-activity" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-all ${
                  isActive(item.path)
                    ? "text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* About Us Dropdown */}
            <div ref={aboutRef} className="relative about-dropdown">
              <button
                onClick={() => setShowAboutMenu(!showAboutMenu)}
                className={`flex items-center transition ${
                  location.pathname.includes("/our-story") ||
                  location.pathname.includes("/blogs")
                    ? "text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                About Us ▾
              </button>

              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-2 w-44 rounded-lg border border-white/20 backdrop-blur-xl bg-white/90 text-gray-800 shadow-lg z-50 transition-all duration-300 ease-in-out transform origin-top ${
                  showAboutMenu
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <Link
                  to="/our-story"
                  className={`block px-4 py-2 rounded-t-lg transition ${
                    isActive("/our-story")
                      ? "bg-gray-100 text-black font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setShowAboutMenu(false)}
                >
                  Our Story
                </Link>
                <Link
                  to="/blogs"
                  className={`block px-4 py-2 transition ${
                    isActive("/blogs")
                      ? "bg-gray-100 text-black font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setShowAboutMenu(false)}
                >
                  Blogs
                </Link>
              </div>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded-full backdrop-blur-md transition text-sm">
              Ai Designer
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded-full backdrop-blur-md transition text-sm">
              + Your Design
            </button>

            {/* 🔍 Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <img src="assets/search.svg" alt="Search" className="h-5 w-5" />
              </button>

              {showSearch && (
                <div
                  className="absolute right-0 mt-3 flex items-center gap-2 p-2 
                             backdrop-blur-xl bg-white/10 border border-white/20
                             rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.15)]
                             animate-fadeIn"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="w-64 bg-transparent text-white placeholder-gray-300 
                               px-4 py-2 rounded-full focus:outline-none"
                  />
                  <button
                    className="p-2 bg-white/20 hover:bg-white/30 border border-white/30 
                               text-white rounded-full transition shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* 🛒 Cart */}
            <button className="relative">
              <img src="assets/cart.svg" alt="Cart" className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                0
              </span>
            </button>

            {/* 👤 Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <img
                  src="assets/profile.svg"
                  alt="Profile"
                  className="h-5 w-5"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 flex flex-col items-center space-y-3 z-50 animate-fadeIn">
                  {/* ✅ Conditional login/logout */}
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="relative w-[130px] text-white font-medium py-2 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 hover:from-white/20 hover:to-white/10 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenModal("login")}
                        className="relative w-[130px] text-white font-medium py-2 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 hover:from-white/20 hover:to-white/10 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleOpenModal("signup")}
                        className="relative w-[130px] text-white font-medium py-2 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:from-white/20 hover:to-white/10 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 🔹 Mobile Menu Icon */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/favorites"
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <img
                src="assets/heart.svg"
                alt="Heart"
                className="h-6 w-6 invert"
              />
            </Link>
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
              <img
                src="assets/cart.svg"
                alt="Cart"
                className="h-6 w-6 invert"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full px-1">
                0
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <img
                src={isMobileMenuOpen ? "assets/close.svg" : "assets/menu.svg"}
                alt="Menu"
                className="h-6 w-6 invert"
              />
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-end justify-start pt-24 pr-8 backdrop-blur-sm bg-black/30 transition-all duration-500">
          {mobileItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-right text-white text-lg font-medium px-6 py-2 mb-4 rounded-full border border-white/20 
                         bg-white/10 backdrop-blur-md transition-all w-fit
                         ${
                           isActive(item.path)
                             ? "shadow-[0_0_20px_rgba(255,255,255,0.8)] text-white font-semibold"
                             : "hover:bg-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                         }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Bottom Buttons */}
          <div className="absolute bottom-10 right-8 flex gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => handleOpenModal("login")}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-base hover:bg-white/20 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => handleOpenModal("signup")}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-base hover:bg-white/20 transition"
                >
                  Sign up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-base hover:bg-white/20 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Auth Modals */}
      <AuthModals
        isOpen={modalOpen}
        type={modalType}
        onClose={handleCloseModal}
        switchType={handleSwitchType}
      />
    </>
  );
}
