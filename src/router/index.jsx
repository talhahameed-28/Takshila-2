import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import ScrollToTop from "../utils/ScrollToTop";

// Lazy load all pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Community = lazy(() => import("../pages/Community"));
const CommunityProduct = lazy(() => import("../pages/CommunityProduct"));
const OurStory = lazy(() => import("../pages/OurStory"));
const Blogs = lazy(() => import("../pages/Blogs"));
const EmailVerify = lazy(() => import("../pages/EmailVerify"));
const Orders = lazy(() => import("../pages/Orders"));
const Catalogue = lazy(() => import("../pages/Catalogue"));
const MyActivity = lazy(() => import("../pages/MyActivity"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const VerifyOtp = lazy(() => import("../pages/ResetPassword"));
const DesignStudio = lazy(() => import("../pages/DesignStudio"));
const ProtectedRoute = lazy(() => import("./protectedRoute"));
const PrivacyPolicy = lazy(() => import("../pages/Privacypolicy"));
const Refundpolicy = lazy(() => import("../pages/Refundpolicy"));
const Shippingpolicy = lazy(() => import("../pages/Shippingpolicy"));
const TermConditions = lazy(() => import("../pages/TermsConditions"));
const Faqs = lazy(() => import("../pages/Faqs"));
const Checkout = lazy(() => import("../pages/Checkout"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const OrderCancel = lazy(() => import("../pages/OrderCancel"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#111]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
);
const MainRoutes = ({
  setIsMobileMenuOpen,
  setModalOpen,
  setModalType,
  setShowProfileMenu,
  setHideMobileNavbar,
}) => {
  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.COMMUNITY} replace />}
        />
        <Route
          path={ROUTES.COMMUNITY}
          element={
            <Community
              handleOpenModal={handleOpenModal}
              setHideMobileNavbar={setHideMobileNavbar}
            />
          }
        />
        <Route
          path={ROUTES.COMMUNITYPRODUCT}
          element={<CommunityProduct handleOpenModal={handleOpenModal} />}
        />
        <Route path={ROUTES.CATALOGUE} element={<Catalogue />} />
        <Route path={ROUTES.ABOUT} element={<OurStory />} />
        <Route path={ROUTES.BLOG} element={<Blogs />} />
        <Route path={ROUTES.FAQS} element={<Faqs />} />
        <Route path={ROUTES.EMAILVERIFY} element={<EmailVerify />} />
        <Route path={ROUTES.RESETPASSWORD} element={<VerifyOtp />} />
        <Route path={ROUTES.PRIVACYPOLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.TERMSCONDITIONS} element={<TermConditions />} />
        <Route path={ROUTES.REFUNDPOLICY} element={<Refundpolicy />} />
        <Route path={ROUTES.SHIPPINGPOLICY} element={<Shippingpolicy />} />
        <Route element={<ProtectedRoute handleOpenModal={handleOpenModal} />}>
          <Route path={ROUTES.ACTIVITY} element={<MyActivity />} />
          <Route path={ROUTES.DESIGNSTUDIO} element={<DesignStudio />} />
          <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
          <Route path={ROUTES.ORDER} element={<Orders />} />
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
          <Route path={ROUTES.ORDERSUCCESS} element={<OrderSuccess />} />
          <Route path={ROUTES.ORDERCANCEL} element={<OrderCancel />} />
        </Route>
      </Routes>
      </Suspense>
    </>
  );
};


export default MainRoutes;