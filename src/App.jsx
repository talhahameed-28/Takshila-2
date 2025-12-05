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
import ResetPassword from "./pages/ResetPassword"; 
import Orders from "./pages/Orders";
import EmailVerify from "./pages/EmailVerify";
import Wishlist from "./pages/Wishlist"
import MainRoutes from "./router";
 

export default function App() {
  return (
    <div className="bg-[#111] text-white min-h-screen">
      <Navbar />

        <MainRoutes />

      <Footer />
    </div>
  );
}
