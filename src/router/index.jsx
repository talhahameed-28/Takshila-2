import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { ROUTES } from "./routes";
import Community from "../pages/Community";
import OurStory from "../pages/OurStory";
import Blogs from "../pages/Blogs";
import EmailVerify from "../pages/EmailVerify";
import Orders from "../pages/Orders";
import Catalogue from "../pages/Catalogue";
import MyActivity from "../pages/MyActivity";
import Wishlist from "../pages/Wishlist";
import VerifyOtp from '../pages/ResetPassword';

const MainRoutes = () => {
    return(
        <>
         <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.COMMUNITY} element={<Community />} />
            <Route path={ROUTES.CATALOGUE} element={<Catalogue />} />
            <Route path={ROUTES.ACTIVITY} element={<MyActivity />} />
            <Route path={ROUTES.ABOUT} element={<OurStory />} />
            <Route path={ROUTES.BLOG} element={<Blogs />} />
            {/* <Route path={ROUTES.EMAILVERIFY} element={<EmailVerify />} /> */}
           <Route path="/email-verify/:email" element={<EmailVerify />} />
            <Route path="/reset-password/:token" element={<VerifyOtp />} />

            <Route path={ROUTES.WISHLIST} element={<Wishlist />} />

            <Route path={ROUTES.ORDER} element={<Orders />} />
        </Routes>
        </>
    );
}


export default MainRoutes;