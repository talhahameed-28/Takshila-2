import React, { useState,useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/slices/userSlice";

import Navbar from "./components/Navbar";
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
import Wishlist from "./pages/Wishlist"
import MainRoutes from "./router";

import DesignStudio from "./pages/DesignStudio";


// ⬇️ Video Loader Component
import VideoLoader from "./components/VideoLoader";
import { HelmetProvider } from "react-helmet-async";


export default function App() {
  const [loading, setLoading] = useState(true); // loader state
  const dispatch = useDispatch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showAboutMenu, setShowAboutMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("login");
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
 
  return (
    <>
      {/* Loader — shows first, hides automatically */}
      {loading && <VideoLoader onFinish={() => setLoading(false)} />}


      {/* Main Website (hidden until loader ends) */}
      {!loading && (
        <div className="bg-[#111] text-white min-h-screen">
          <Navbar
            showAboutMenu={showAboutMenu}
            setShowAboutMenu={setShowAboutMenu}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            modalType={modalType}
            setModalType={setModalType} 
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}/>
            
          <Routes>
            {/* MainRoutes for Auth related routes */}
            <Route path="/*" element={<MainRoutes  
            setIsMobileMenuOpen={setIsMobileMenuOpen}    
            setModalOpen={setModalOpen}
            setModalType={setModalType}     
            setShowProfileMenu={setShowProfileMenu}/>} />
          </Routes>

          <Footer />
        </div>
      )}
    </>

  );
}
