import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "./store/slices/userSlice";
import { HelmetProvider } from "react-helmet-async";

// Lazy load components
const MobileTopBar = lazy(() => import("./components/MobileTopBar"));
const ResponsiveNavbar = lazy(() => import("./components/ResponsiveNavbar"));
const Footer = lazy(() => import("./components/Footer"));
const MainRoutes = lazy(() => import("./router"));

// Loading fallback component
const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#111]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(false); // loader state
  const dispatch = useDispatch();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [hideMobileNavbar, setHideMobileNavbar] = useState(false);
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
          <Suspense fallback={<ComponentLoader />}>
            <MobileTopBar />

            <ResponsiveNavbar
              hideMobileNavbar={hideMobileNavbar}
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
                    setHideMobileNavbar={setHideMobileNavbar}
                  />
                }
              />
            </Routes>

            {/* ✅ Footer hidden on Community */}
            {!shouldHideFooter && <Footer />}
          </Suspense>
        </div>
      )}
    </>
  );
}
