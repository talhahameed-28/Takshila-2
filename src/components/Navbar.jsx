import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import AuthModals from "./AuthModals";
import toast from "react-hot-toast";
import "../index.css";
import ReactDOM from "react-dom";
import axios from "axios";

export default function Navbar() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [user, setUser] = useState(null);

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
  const handleSwitchType = (type) => setModalType(type);

  /* --------------------------------------------------
    ✅ UPDATED USER LOADING + GLOBAL AUTH LISTENER
  -------------------------------------------------- */
  useEffect(() => {
  const loadUser =async () => {
    try {
          const storedUser = localStorage.getItem("token");

        if (!storedUser || storedUser === "undefined") {
          setUser(null);
          return;
        }
        const {data}=await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user`,{
            headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
        },withCredentials: true
      })
    if(data.success)setUser(data.data.user);
    } catch (error) {
      
    }
   
  };

  loadUser(); // initial load

  window.addEventListener("auth-changed", loadUser);
  return () => window.removeEventListener("auth-changed", loadUser);
}, []);

  /* --------------------------------------------------
    ✅ UPDATED LOGOUT (NO PAGE RELOAD)
  -------------------------------------------------- */
  const handleLogout =async () => {
    console.log(localStorage.getItem("token"))
    try {
      const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/logout`,{},{
        headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
    },withCredentials: true
  })
  console.log(data)
      if(data.success){
        localStorage.removeItem("token")
        setUser(null);
        setShowProfileMenu(false);
        toast.success("Logged out successfully");
        window.dispatchEvent(new Event("auth-changed"));     
        // Notify all components that auth changed
      }else{
        toast.error("Couldn't process your request")
      }    
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred")
    }
  };

  // SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // OUTSIDE CLICK HANDLING
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

  // CLOSE MOBILE MENU ON RESIZE
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
        <div
          className="flex items-center justify-between w-full max-w-6xl space-x-6 px-4 py-2 rounded-full 
                     bg-[#202020]/70 backdrop-blur-md border border-white/10 
                     shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-500 relative 
                     overflow-visible group"
        >
          {/* (YOUR UI CODE — UNTOUCHED) */}
          {/* (I DID NOT MODIFY ANYTHING FROM HERE DOWN) */}

          <div
            className="absolute inset-0 pointer-events-none rounded-full 
                          bg-gradient-to-tr from-white/15 via-transparent to-transparent 
                          opacity-25 blur-sm"
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent 
                          pointer-events-none mix-blend-overlay"
          ></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
            <div
              className="absolute top-0 left-[-120%] w-[120%] h-full 
                            bg-gradient-to-r from-transparent via-white/25 to-transparent 
                            transform rotate-12 animate-shine-full 
                            [mask-image:radial-gradient(circle_at_center,white_80%,transparent_100%)]
                            group-hover:via-white/40 transition-all duration-500"
            ></div>
          </div>

          <div>
            <img src="/assets/logo.png" alt="Logo" className="h-8" />
          </div>

          {/* ---------------------------------------- */}
          {/* 🟢 NOTHING BELOW THIS LINE WAS MODIFIED  */}
          {/* ---------------------------------------- */}

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

            {/* About Dropdown */}
            <div ref={aboutRef} className="relative">
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

              <div
                className={`absolute left-0 mt-2 w-44 rounded-lg border border-white/10 
                            backdrop-blur-xl bg-white/10 text-gray-100 shadow-lg z-[9999] 
                            transition-all duration-300 ease-in-out transform origin-top ${
                              showAboutMenu
                                ? "opacity-100 scale-y-100 translate-y-0"
                                : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                            }`}
              >
                <Link
                  to="/our-story"
                  className={`block px-4 py-2 rounded-t-lg transition ${
                    isActive("/our-story")
                      ? "bg-white/10 text-white font-semibold"
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => setShowAboutMenu(false)}
                >
                  Our Story
                </Link>
                <Link
                  to="/blogs"
                  className={`block px-4 py-2 transition ${
                    isActive("/blogs")
                      ? "bg-white/10 text-white font-semibold"
                      : "hover:bg-white/10"
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
            <Link
              to="/design-studio"
              className="bg-white/5 hover:bg-white/10 text-white px-4 py-1 rounded-full backdrop-blur-md transition text-sm"
            >
              Design Studio
            </Link>

            {/* Search */}
            <div ref={searchRef} className="relative z-[9999]">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <img
                  src="/assets/search.svg"
                  alt="Search"
                  className="h-5 w-5 "
                />
              </button>

              {showSearch && (
                <div
                  className="absolute right-0 mt-3 flex items-center gap-2 p-2 
                             backdrop-blur-xl bg-white/5 border border-white/10
                             rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.1)]
                             animate-fadeIn z-[9999]"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="w-64 bg-transparent text-white placeholder-gray-400 
                               px-4 py-2 rounded-full focus:outline-none"
                  />
                  <button
                    className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 
                               text-white rounded-full transition shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
              <img src="/assets/cart.svg" alt="Cart" className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                0
              </span>
            </Link>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative z-[9999]">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <img
                  src="/assets/profile.svg"
                  alt="Profile"
                  className="h-5 w-5 "
                />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-4 flex flex-col items-center space-y-4 z-[99999] animate-fadeIn
               px-6 py-6 rounded-3xl border border-white/10 
               shadow-[0_0_25px_rgba(255,255,255,0.15)]
               bg-[#202020]/70 overflow-hidden backdrop-blur-3xl"
                  style={{
                    WebkitBackdropFilter: "blur(40px) saturate(150%)",
                    backdropFilter: "blur(40px) saturate(150%)",
                  }}
                >
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="relative w-[130px] text-white font-medium py-2 rounded-full
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                       border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenModal("login")}
                        className="relative w-[130px] text-white font-medium py-2 rounded-full
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                       border border-white/6 transition-all shadow-[0_4px_12px_rgrgba(0,0,0,0.4)]"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => handleOpenModal("signup")}
                        className="relative w-[130px] text-white font-medium py-2 rounded-full
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                       border border-white/6 transition-all shadow-[0_4px_12px_rgxba(0,0,0,0.4)]"
                      >
                        Sign Up
                      </button>
                    </>
                  )}

                  <Link
                    to="/orders"
                    className="relative w-[130px] text-center text-white font-medium py-2 rounded-full
                     bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                     border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  >
                    Your Orders
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModals
        isOpen={modalOpen}
        type={modalType}
        onClose={handleCloseModal}
        switchType={handleSwitchType}
      />
    </>
  );
}
