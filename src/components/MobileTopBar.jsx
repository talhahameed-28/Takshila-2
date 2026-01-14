import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const TITLE_MAP = {
  "/": "Home",
  "/community": "Community",
  "/catalogue": "Catalogue",
  "/our-story": "Our Story",
  "/blogs": "Blogs",
  "/my-activity": "My Activity",
};

export default function MobileTopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const title =
    TITLE_MAP[location.pathname] ||
    location.pathname.replace("/", "").replace("-", " ");

  return (
    <div className="fixed top-0 left-0 w-full z-9998 md:hidden">
      <div
        className="relative flex items-center justify-between
                   px-5 py-4
                   bg-[#111]/80 backdrop-blur-xl
                   border-b border-white/10"
      >
        {/* ➕ PLUS */}
        <button
          onClick={() => navigate("/design-studio")}
          className="text-white text-3xl font-light"
        >
          +
        </button>

        {/* PAGE TITLE */}
        <h1
          className="absolute left-1/2 -translate-x-1/2
                       text-white text-lg tracking-[0.35em] uppercase"
        >
          {title}
        </h1>

        {/* 🔍 SEARCH */}
        <button onClick={() => setShowSearch(true)} className="text-white">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>
      </div>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-4">
            <input
              autoFocus
              placeholder="Search..."
              className="flex-1 bg-white/10 text-white px-4 py-3
                         rounded-full focus:outline-none"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="text-white text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
