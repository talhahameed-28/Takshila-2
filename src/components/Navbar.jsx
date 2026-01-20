import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import AuthModals from "./AuthModals";
import toast from "react-hot-toast";
import "../index.css";
import ReactDOM from "react-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/userSlice";

export default function Navbar({isMobileMenuOpen,setIsMobileMenuOpen,modalOpen,setModalOpen,modalType,setModalType,showProfileMenu, setShowProfileMenu}) {
  const location = useLocation();
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const [showSearch, setShowSearch] = useState(false);
  // const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalType, setModalType] = useState("login");
  // const [user, setUser] = useState(null);

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
//   useEffect(() => {
//   const loadUser =async () => {
//     try {
//           const storedUser = localStorage.getItem("token");

//         if (!storedUser || storedUser === "undefined") {
//           setUser(null);
//           return;
//         }
//         const {data}=await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user`,{
//             headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//         },withCredentials: true
//       })
//     if(data.success)setUser(data.data.user);
//     } catch (error) {
//       console.log(error)
//     }
   
//   };

//   loadUser(); // initial load

//   window.addEventListener("auth-changed", loadUser);
//   return () => window.removeEventListener("auth-changed", loadUser);
// }, []);

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
        // setUser(null);
        dispatch(logout())
        setShowProfileMenu(false);
        handleCloseModal()
        navigate("/")
        toast.success("Logged out successfully");
        // window.dispatchEvent(new Event("auth-changed"));     
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
        className={`fixed top-0 left-0 w-full flex justify-center 
              px-4 sm:px-6 md:px-8 py-4 
              z-1000 transition-all duration-500 ${
                isScrolled ? "bg-transparent" : "bg-transparent"
              }`}
      >
        <div
          className="flex items-center justify-between w-full 
               max-w-[95%] sm:max-w-150 md:max-w-225 lg:max-w-6xl 
               space-x-3 sm:space-x-4 md:space-x-6 
               px-3 sm:px-4 py-2 rounded-full 
               bg-[#202020]/70 backdrop-blur-md border border-white/10 
               shadow-[0_0_25px_rgba(255,255,255,0.1)] 
               transition-all duration-500 relative overflow-visible group"
        >
          {/* (YOUR UI CODE — UNTOUCHED) */}
          {/* (I DID NOT MODIFY ANYTHING FROM HERE DOWN) */}

          <div
            className="absolute inset-0 pointer-events-none rounded-full 
                          bg-linear-to-tr from-white/15 via-transparent to-transparent 
                          opacity-25 blur-sm"
          ></div>
          <div
            className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent 
                          pointer-events-none mix-blend-overlay"
          ></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
            <div
              className="absolute top-0 left-[-120%] w-[120%] h-full 
                            bg-linear-to-r from-transparent via-white/25 to-transparent 
                            transform rotate-12 animate-shine-full 
                            mask-[radial-gradient(circle_at_center,white_80%,transparent_100%)]
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
            <div ref={aboutRef} className="relative z-9999">
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

              {showAboutMenu && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-6
        flex flex-col items-center space-y-4 z-99999 animate-fadeIn
        px-3 py-3 rounded-3xl border border-white/10
        shadow-[0_0_25px_rgba(255,255,255,0.15)]
        bg-[#202020]/70 overflow-hidden backdrop-blur-3xl"
                  style={{
                    WebkitBackdropFilter: "blur(40px) saturate(150%)",
                    backdropFilter: "blur(40px) saturate(150%)",
                  }}
                >
                  <Link
                    to="/our-story"
                    onClick={() => setShowAboutMenu(false)}
                    className="relative w-32.5 text-center text-white font-medium py-2 rounded-full
          bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
          border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  >
                    Our Story
                  </Link>

                  <Link
                    to="/blogs"
                    onClick={() => setShowAboutMenu(false)}
                    className="relative w-32.5 text-center text-white font-medium py-2 rounded-full
          bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
          border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  >
                    Blogs
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/design-studio"
              className="bg-green-gradiant hover:bg-white/10 text-white px-4 py-2 rounded-full backdrop-blur-md transition text-sm"
            >
              Design Studio
            </Link>

            {/* Search */}
            <div ref={searchRef} className="relative z-9999">
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
                             backdrop-blur-3xl bg-black/70 border border-white/10
                             rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.1)]
                             animate-fadeIn z-9999"
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

            {/* <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
              <img src="/assets/cart.svg" alt="Cart" className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                0
              </span>
            </Link> */}

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative z-9999">
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
                  className="absolute right-0 mt-4 flex flex-col items-center space-y-4 z-99999 animate-fadeIn
               px-3 py-3 rounded-3xl border border-white/10 
               shadow-[0_0_25px_rgba(255,255,255,0.15)]
               bg-[#202020]/70 overflow-hidden backdrop-blur-3xl"
                  style={{
                    WebkitBackdropFilter: "blur(40px) saturate(150%)",
                    backdropFilter: "blur(40px) saturate(150%)",
                  }}
                >
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="relative w-32.5 text-white font-medium py-2 rounded-full
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                       border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenModal("login")}
                        className="relative w-32.5 text-white font-medium py-2 rounded-full
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                       border border-white/6 transition-all shadow-[0_4px_12px_rgrgba(0,0,0,0.4)]"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => handleOpenModal("signup")}
                        className="relative w-32.5 text-white font-medium py-2 rounded-full
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                       border border-white/6 transition-all shadow-[0_4px_12px_rgxba(0,0,0,0.4)]"
                      >
                        Sign Up
                      </button>
                    </>
                  )}

                  <Link
                    to="/orders"
                    className="relative w-32.5 text-center text-white font-medium py-2 rounded-full
                     bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                     border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  >
                    Your Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    className="relative w-32.5 text-center text-white font-medium py-2 rounded-full
                     bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/12
                     border border-white/6 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  >
                    Your Wishlist
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 
             backdrop-blur-md border border-white/10 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-9990 md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Content */}
          <div className="absolute top-24 right-4 w-[90%] max-w-sm flex flex-col items-end space-y-6 animate-fadeIn">
            {/* Search Bar */}
            <div
              className="w-full flex items-center gap-2 px-4 py-3 mb-14 mt-10 rounded-full
                   bg-white/10 border border-white/10 backdrop-blur-xl"
            >
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent text-white placeholder-gray-400
                     focus:outline-none"
              />
              <button
                className="p-2 bg-white/10 hover:bg-white/20
                     border border-white/10 text-white rounded-full transition"
              >
                →
              </button>
            </div>

            {/* Main Navigation */}
            {mobileItems
              .filter(
                (item) => item.name !== "Our Story" && item.name !== "Blogs"
              )
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-fit ml-auto text-right px-20 py-3 rounded-full
                        text-lg font-medium transition
              ${
                isActive(item.path)
                  ? "bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
                >
                  {item.name}
                </Link>
              ))}

            {/* Your Orders (after My Activity) */}
            {isLoggedIn && (
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-fit ml-auto text-right px-20 py-3 rounded-full
                     text-lg bg-white/10 hover:bg-white/20
                     text-white transition"
              >
                Your Orders
              </Link>
            )}

            {/* Design Studio */}
            <Link
              to="/design-studio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-fit ml-auto text-right px-20 py-3 rounded-full
                   text-lg bg-[#2E4B45] hover:bg-[#1f332e]
                   text-white transition shadow-md"
            >
              Design Studio
            </Link>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex gap-4 pt-4 ml-auto">
                <button
                  onClick={() => handleOpenModal("login")}
                  className="px-14 py-2 rounded-full
                       bg-white/10 hover:bg-white/20
                       text-white transition"
                >
                  Login
                </button>

                <button
                  onClick={() => handleOpenModal("signup")}
                  className="px-14 py-2 rounded-full
                       bg-white/10 hover:bg-white/20
                       text-white transition"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-fit ml-auto px-20 py-3 rounded-full
                     bg-red-500/20 hover:bg-red-500/30
                     text-white transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModals
        isOpen={modalOpen}
        type={modalType}
        onClose={handleCloseModal}
        switchType={handleSwitchType}
      />
    </>
  );
}
