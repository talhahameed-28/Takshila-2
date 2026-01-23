import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthModals from "./AuthModals";


import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function MobileNavbar({modalOpen,setModalOpen,modalType,setModalType,hideMobileNavbar,}) {
  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalType, setModalType] = useState("login");

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setMenuOpen(false);
  };
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        localStorage.removeItem("token");
        dispatch(logout());
        setMenuOpen(false);
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        toast.error("Couldn't process your request");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    }
  };

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path ? "bg-white/20 text-white" : "text-gray-400";

  // ✅ Close menu when clicking outside (but NOT on menu button)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    


    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  // const handleOpenModal = (type) => {
  //   setModalType(type);
  //   setModalOpen(true);
  //   setMenuOpen(false);
  // };

  return (
    <>
      <div
        className={`fixed bottom-1 left-1/2 -translate-x-1/2 z-9999 md:hidden
    transition-all duration-300 ease-out
    ${
      hideMobileNavbar
        ? "opacity-0 translate-y-10 pointer-events-none"
        : "opacity-100 translate-y-0"
    }
  `}
      >
        {/* MENU */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-20 right-2
               flex flex-col gap-3
               px-4 py-4 rounded-3xl
               bg-[#202020]/90 backdrop-blur-2xl
               border border-white/10
               shadow-[0_0_30px_rgba(255,255,255,0.15)]
               animate-fadeIn"
          >
            {/* Common links */}
            {/* <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              Profile
            </Link> */}

            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              Orders
            </Link>

            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              Blogs
            </Link>

            {/* <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              Wishlist
            </Link> */}

            {/* AUTH SECTION */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => handleOpenModal("login")}
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Login
                </button>

                <button
                  onClick={() => handleOpenModal("signup")}
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-white"
              >
                Logout
              </button>
            )}
          </div>
        )}

        {/* NAVBAR */}
        <div
          className="relative flex items-center justify-between
             px-10 py-2
             w-90
             rounded-full bg-[#202020]/80 backdrop-blur-xl
             border border-white/10 shadow-lg"
        >
          <Link
            to="/community"
            className={`p-2 rounded-full -ml-5 ${isActive("/community")}`}
          >
            <img src="/assets/Grp34.svg" className="w-5 h-5 object-contain" />
          </Link>

          <Link
            to="/my-activity"
            className={`p-2 rounded-full ${isActive("/my-activity")}`}
          >
            <img src="/assets/Grp33.svg" className="w-5 h-5 object-contain" />
          </Link>

          {/* CENTER BUTTON */}
          <Link
            to="/design-studio"
            className="absolute left-1/2 -translate-x-1/2 
             flex items-center justify-center
             w-12 h-12 rounded-full
             bg-[#2a2a2a]
             border border-white/20
             shadow-[0_0_30px_rgba(255,255,255,0.35)]"
          >
            <img
              src="/assets/logoo.svg"
              alt="Design Studio"
              className="w-10 h-10 object-contain"
            />
          </Link>

          <Link
            to="/our-story"
            className={`p-2 rounded-full ml-20 ${isActive("/our-story")}`}
          >
            <img src="/assets/Grp22.svg" className="w-5 h-5 object-contain" />
          </Link>

          {/* ☰ MENU BUTTON */}
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-full transition -mr-5
            ${
              menuOpen
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            <img src="/assets/menu.png" className="w-5 h-5 object-contain" />
          </button>
        </div>
      </div>
      <AuthModals
        isOpen={modalOpen}
        type={modalType}
        onClose={() => setModalOpen(false)}
        switchType={setModalType}
      />
    </>
  );
}
