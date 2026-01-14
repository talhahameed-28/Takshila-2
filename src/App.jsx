import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "./store/slices/userSlice";
import MobileTopBar from "./components/MobileTopBar";
import ResponsiveNavbar from "./components/ResponsiveNavbar";

import Footer from "./components/Footer";

import Home from "./pages/Home";
import Community from "./pages/Community";
import Catalogue from "./pages/Catalogue";
import MyActivity from "./pages/MyActivity";
import OurStory from "./pages/OurStory";
import Blogs from "./pages/Blogs";
import ResetPassword from "./pages/ResetPassword";
import Orders from "./pages/Orders";

import EmailVerify from "./pages/EmailVerify";
import Wishlist from "./pages/Wishlist";
import MainRoutes from "./router";

import DesignStudio from "./pages/DesignStudio";

// ⬇️ Video Loader Component
// import VideoLoader from "./components/VideoLoader";
import { HelmetProvider } from "react-helmet-async";

export default function App() {
  const [loading, setLoading] = useState(false); // loader state
  const dispatch = useDispatch();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  const location = useLocation(); // ✅ ADDED

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // ✅ ADDED: routes where footer should be hidden
  const hideFooterRoutes = ["/community"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {/* Loader — shows first, hides automatically 
      {loading && <VideoLoader onFinish={() => setLoading(false)} />}*/}

      {/* Main Website (hidden until loader ends) */}
      {!loading && (
        <div className="bg-[#111] text-white min-h-screen">
          <MobileTopBar />

          <ResponsiveNavbar
            showAboutMenu={showAboutMenu}
            setShowAboutMenu={setShowAboutMenu}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            modalType={modalType}
            setModalType={setModalType}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
          />

          <Routes>
            {/* MainRoutes for Auth related routes */}
            <Route
              path="/*"
              element={
                <MainRoutes
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  setModalOpen={setModalOpen}
                  setModalType={setModalType}
                  setShowProfileMenu={setShowProfileMenu}
                />
              }
            />
          </Routes>

          {/* ✅ Footer hidden on Community */}
          {!shouldHideFooter && <Footer />}
        </div>
      )}
    </>
  );
}
