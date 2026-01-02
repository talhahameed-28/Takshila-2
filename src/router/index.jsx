import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { ROUTES } from "./routes";
import Community from "../pages/Community";
import CommunityProduct from "../pages/CommunityProduct";
import OurStory from "../pages/OurStory";
import Blogs from "../pages/Blogs";
import EmailVerify from "../pages/EmailVerify";
import Orders from "../pages/Orders";
import Catalogue from "../pages/Catalogue";
import MyActivity from "../pages/MyActivity";
import Wishlist from "../pages/Wishlist";
import VerifyOtp from '../pages/ResetPassword';
import DesignStudio from "../pages/DesignStudio";
import ProtectedRoute from "./protectedRoute";
import PrivacyPolicy from "../pages/Privacypolicy"
import Refundpolicy from "../pages/Refundpolicy"
import Shippingpolicy from "../pages/Shippingpolicy"
import TermConditions from "../pages/TermsConditions"
import Faqs from "../pages/Faqs";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderCancel from "../pages/OrderCancel";

import ScrollToTop from "../utils/ScrollToTop";
const MainRoutes = ({setIsMobileMenuOpen,setModalOpen,setModalType,setShowProfileMenu}) => {
    const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };
    return(
        <>
        <ScrollToTop/>

            <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.COMMUNITY} element={<Community handleOpenModal={handleOpenModal} />} />
                <Route path={ROUTES.COMMUNITYPRODUCT} element={<CommunityProduct handleOpenModal={handleOpenModal} />} />
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
                <Route element={<ProtectedRoute handleOpenModal={handleOpenModal}/>}>
                    <Route path={ROUTES.ACTIVITY} element={<MyActivity />} />
                    <Route path={ROUTES.DESIGNSTUDIO} element={<DesignStudio />} />
                    <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
                    <Route path={ROUTES.ORDER} element={<Orders />} />
                    <Route path={ROUTES.CHECKOUT} element={<Checkout/>}/>
                    <Route path={ROUTES.ORDERSUCCESS} element={<OrderSuccess/>}/>
                    <Route path={ROUTES.ORDERCANCEL} element={<OrderCancel/>}/>
                </Route>

            </Routes>
       
        </>
    );
}


export default MainRoutes;