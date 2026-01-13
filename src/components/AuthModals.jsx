import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";

export default function AuthModals({ isOpen, type, onClose, switchType }) {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset=async(e)=>{
    try {
      e.preventDefault()
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      axios.defaults.withCredentials = true;
      console.log(values)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/password/forgot`,
        values
      );
      if(data.success){
        toast.success("Reset link sent to email🎉")
      }else{
        toast.error("Couldn't process your request")
      }
    } catch (error) {
      console.log(error)
    }finally {
      setTimeout(() => setIsSubmitting(false), 3000);
    }
  }


  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      axios.defaults.withCredentials = true;
      const {dob}=values
      console.log(dob)
      const [year,month,day]=dob.split("-")
      const formattedDate = `${month}-${day}-${year}` //Formatting in MM-DD-YYYY
      values.dob=formattedDate
      console.log(values)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/register`,
        values
      );
      console.log(data)
      if (data.success) {
        onClose();
        // navigate(`/verifyOtp`, { state: { userId: data.userId } });
        navigate(`/email-verify/${values.email}`)
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong during signup");
    } finally {
      setTimeout(() => setIsSubmitting(false), 3000);
    }
  };

  /* --------------------------------------------------------
     🔥 UPDATED LOGIN (NO PAGE RELOAD)
  ---------------------------------------------------------*/
  const handleLogin = async (e) => {
    try {
      axios.defaults.withCredentials = true;
      e.preventDefault();

      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/login`,
        values
      );
      console.log(data)
      if (data.success) {
        localStorage.setItem("token", data.data.access_token);
        dispatch(setUser(data.data.user))
        toast.success("Logging you in");
        // 🔥 Notify navbar instantly
        // window.dispatchEvent(new Event("auth-changed"));

        // 🔥 Close modal
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err)
      toast.error("Login failed");
    }
  };

  /* --------------------------------------------------------
     🔥 UPDATED FACEBOOK LOGIN
  ---------------------------------------------------------*/
  const handleFacebookAuth = async (response) => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/facebook/verify`,
        { token: response.accessToken }
      );

      if (data.success) {
        dispatch(setUser(data.data.user))
        localStorage.setItem("token", data.data.access_token);
        toast.success("Logged in through Facebook");

        // 🔥 Notify navbar instantly
        // window.dispatchEvent(new Event("auth-changed"));

        onClose();
        navigate("/");
      } else {
        toast.error("Facebook login error");
      }
    } catch (err) {
      toast.error("Facebook authentication failed");
    }
  };

  /* --------------------------------------------------------
     🔥 UPDATED GOOGLE LOGIN
  ---------------------------------------------------------*/
  const handleGoogleAuth = async (credentialResponse) => {
    try {
      axios.defaults.withCredentials = true;

      const token = credentialResponse.credential;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/google/verify`,
        { token }
      );
      console.log(data)
      if (data.success) {
        dispatch(setUser(data.data.user))
        localStorage.setItem("token", data.data.access_token);
        
        // 🔥 Notify navbar instantly
        // window.dispatchEvent(new Event("auth-changed"));
        toast.success("Google auth successful");

        onClose();
        navigate("/");
      } else {
        toast.error("Google authentication failed");
      }
    } catch (err) {
      console.log(err)
      toast.error("Google authentication error");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Centered Modal */}
      <div
        className={`fixed inset-0 z-[1000] flex items-end md:items-center justify-center transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-5 pointer-events-none"
        }`}
      >
        <div
          className={`relative bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl w-[90%] max-w-4xl text-white
  pt-16 px-5 pb-6
  max-h-[85vh] overflow-visible${
    type === "login" ? "flex flex-col md:flex-row" : "flex flex-col"
  }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo Circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black backdrop-blur-md rounded-full w-20 h-20 shadow-xl flex items-center justify-center border border-white/30">
            <img
              src="assets/logoo.svg"
              alt="Logo"
              className="h-14 w-14 rounded-full"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
          >
            ✕
          </button>

          {/* LOGIN MODAL */}
          {type === "login" ? (
            <>
              {/* Left Section */}
              <div className="flex-1 flex flex-col justify-center pr-0 md:pr-10">
                <h2 className="text-2xl font-semibold text-center md:text-left mb-2">
                  Login to Takshila
                </h2>
                <hr className="border-white/30 mb-6" />

                <form className="space-y-4" onSubmit={handleLogin}>
                  <p className="text-xs text-gray-200 text-center md:text-left">
                    Please enter your login information
                  </p>

                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-white/30 text-white px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full bg-white/30 text-white px-4 py-3 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />

                  <p className="text-xs text-gray-300 text-center md:text-left">
                    By continuing, I agree to the{" "}
                    <a href="#" className="underline">
                      Terms of Service
                    </a>{" "}
                    &{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>
                  </p>

                  <button
                    type="submit"
                    className="w-full text-sm bg-black/80 py-3 rounded-full text-white font-medium hover:bg-black transition"
                  >
                    Log In
                  </button>
                </form>

                <hr className="border-white/30 my-6" />
                <p className="text-center text-sm text-gray-300">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => switchType("signup")}
                    className="text-blue-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
                <p className="text-center text-sm text-gray-300">
                  Forgot Password?{" "}
                  <button
                    onClick={() => switchType("forgotPassword")}
                    className="text-blue-400 hover:underline"
                  >
                    Reset
                  </button>
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/30 mx-10"></div>

              {/* Right Section (Social Login) */}
              <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                  <GoogleLogin
                    onSuccess={handleGoogleAuth}
                    onError={() => console.log("Login Failed")}
                  />
                </GoogleOAuthProvider>

                <FacebookLogin
                  style={{
                    backgroundColor: "#4267b2",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                  onSuccess={handleFacebookAuth}
                  onFail={(error) => console.log("Login Failed!", error)}
                >
                  Signup with facebook
                </FacebookLogin>
              </div>
            </>
          ) : type === "signup" ? (
            /* SIGNUP MODAL */
            <div className="w-full flex flex-col justify-center items-center px-0 md:px-16">
              <h2 className="text-3xl font-semibold text-center mb-2">
                Create Account
              </h2>
              <p className="text-center text-sm text-gray-200 mb-6">
                Join Takshila
              </p>

              <form
                onSubmit={handleRegister}
                className="space-y-4 w-full text-xs max-w-2xl"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="Full Name"
                    className=" w-1/2 input-style"
                  />
                  {/* <input
                    name="middleName"
                    type="text"
                    placeholder="Middle Name"
                    className="input-style"
                  /> */}
                  <input
                    name="username"
                    required
                    type="text"
                    placeholder="Username"
                    className="w-1/2 input-style"
                  />
                </div>

                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Email ID"
                  className="input-style"
                />
                <input
                  name="password"
                  required
                  type="password"
                  placeholder="Password"
                  className="input-style"
                />
                <input
                  name="password_confirmation"
                  required
                  type="password"
                  placeholder="Confirm Password"
                  className="input-style"
                />
                <input
                  name="dob"
                  required
                  type="date"
                  placeholder="Date of Birth"
                  className="input-style"
                />
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="input-style"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-full text-white font-medium transition ${
                    isSubmitting
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-black/80 hover:bg-black"
                  }`}
                >
                  {isSubmitting ? "Please wait..." : "Sign Up"}
                </button>
              </form>

              <hr className="border-white/30 my-6 w-full max-w-2xl" />

              <div className="flex flex-col text-sm sm:flex-row justify-center items-center gap-4">
                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                  <GoogleLogin
                    onSuccess={handleGoogleAuth}
                    onError={() => console.log("Login Failed")}
                  />
                </GoogleOAuthProvider>

                <FacebookLogin
                  style={{
                    backgroundColor: "#4267b2",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                  onSuccess={handleFacebookAuth}
                  onFail={(error) => console.log("Login Failed!", error)}
                >
                  Signup with facebook
                </FacebookLogin>
              </div>

              <p className="text-center text-gray-200 text-sm mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => switchType("login")}
                  className="text-blue-400 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-semibold p-2">Forgot Password ?</p>
                <p className="text-sm p-1">
                  No worries! We'll send you reset instructions.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <form
                  className="w-full flex items-center flex-col gap-3"
                  onSubmit={handleReset}
                >
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    className="w-1/2 bg-white/30 text-white px-4 py-2 rounded-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-1/2 py-3 rounded-full text-white font-medium transition ${
                      isSubmitting
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-black/80 hover:bg-black"
                    }`}
                  >
                    {isSubmitting ? "Please wait..." : "Send reset link"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-300">
                  Remember your password?{" "}
                  <button
                    onClick={() => switchType("login")}
                    className="text-blue-400 hover:underline"
                  >
                    Back to login
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
