import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Community from "./pages/Community";
import Catalogue from "./pages/Catalogue";
import MyActivity from "./pages/MyActivity";
import OurStory from "./pages/OurStory";
import Blogs from "./pages/Blogs";
import VerifyOtp from "./pages/VerifyOtp";
import Orders from "./pages/Orders";

// ✅ Replace Cart with Wishlist
import Wishlist from "./pages/Wishlist";

export default function App() {
  return (
    <div className="bg-[#111] text-white min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/my-activity" element={<MyActivity />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />

        {/* ⭐ Updated Wishlist Route */}
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </div>
  );
}
