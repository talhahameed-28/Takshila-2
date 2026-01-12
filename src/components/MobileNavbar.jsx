import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function MobileNavbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] md:hidden">
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
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            Profile
          </Link>

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
        </div>
      )}

      {/* NAVBAR */}
      <div
        className="relative flex items-center justify-between
             px-10 py-2
             w-[360px]
             rounded-full bg-[#202020]/80 backdrop-blur-xl
             border border-white/10 shadow-lg"
      >
        <Link
          to="/community"
          className={`p-3 rounded-full -ml-5 ${isActive("/community")}`}
        >
          <img src="/assets/community.png" className="w-6 h-6 object-contain" />
        </Link>

        <Link
          to="/my-activity"
          className={`p-3 rounded-full ${isActive("/my-activity")}`}
        >
          <img src="/assets/activity.png" className="w-6 h-6 object-contain" />
        </Link>

        {/* CENTER BUTTON */}
        <Link
          to="/design-studio"
          className="absolute left-1/2 -translate-x-1/2 -top-6
             flex items-center justify-center
             w-16 h-16 rounded-full
             bg-[#2a2a2a]
             border border-white/20
             shadow-[0_0_30px_rgba(255,255,255,0.35)]"
        >
          <img
            src="/assets/logoo.svg"
            alt="Design Studio"
            className="w-12 h-12 object-contain"
          />
        </Link>

        <Link
          to="/our-story"
          className={`p-3 rounded-full ml-20 ${isActive("/our-story")}`}
        >
          <img src="/assets/story.png" className="w-6 h-6 object-contain" />
        </Link>

        {/* ☰ MENU BUTTON */}
        <button
          ref={menuButtonRef}
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`p-3 rounded-full transition -mr-5
            ${
              menuOpen
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
        >
          <img src="/assets/menu.png" className="w-6 h-6 object-contain" />
        </button>
      </div>
    </div>
  );
}
