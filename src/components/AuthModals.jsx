import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
export default function AuthModals({ isOpen, type, onClose, switchType }) {
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target); // e.target = form
      const values = Object.fromEntries(formData.entries());
      console.log(values);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/register`,
        values
      );
      console.log(data);
      if (data.success) {
        onClose();
        navigate(`/verifyOtp`, { state: { userId: data.userId } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (e) => {
    try {
      axios.defaults.withCredentials = true;
      e.preventDefault();
      const formData = new FormData(e.target); // e.target = form
      const values = Object.fromEntries(formData.entries());
      console.log(values);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/login`,
        values
      );
      console.log(data);
      if (data.success) {
        toast.success("Logging you in");
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFacebookAuth = async (response) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/facebook`,
        { id_token: response.accessToken }
      );
      console.log(data);
      if (data.success) {
        onClose();
        toast.success("Logged in through facebook");
        navigate("/");
      } else toast.error("Error");
    } catch (err) {
      console.log(err);
    }
  };
  const handleGoogleAuth = async (credentialResponse) => {
    try {
      axios.defaults.withCredentials = true;
      const id_token = credentialResponse.credential;
      console.log(credentialResponse);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/google`,
        { id_token }
      );
      console.log(data); // { token, user }
      if (data.success) {
        onClose();
        toast.success("Google auth done");
        navigate("/");
      } else toast.error("Error");
    } catch (err) {
      console.log(err);
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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Centered Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-5 pointer-events-none"
        }`}
      >
        <div
          className={`relative bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl w-[90%] max-w-4xl text-white p-10 ${
            type === "login" ? "flex flex-col md:flex-row" : "flex flex-col"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo Circle */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black backdrop-blur-md rounded-full w-20 h-20 shadow-xl flex items-center justify-center border border-white/30">
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
                  appId="1299732128027988"
                  onSuccess={handleFacebookAuth}
                  onFail={(error) => {
                    console.log("Login Failed!", error);
                  }}
                >
                  Signup with facebook
                </FacebookLogin>
              </div>
            </>
          ) : (
            /* SIGNUP MODAL (same width, single column) */
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
                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-3">
                  <input
                    name="firstName"
                    required
                    type="text"
                    placeholder="First Name"
                    className="input-style"
                  />
                  <input
                    name="middleName"
                    type="text"
                    placeholder="Middle Name"
                    className="input-style"
                  />
                  <input
                    name="lastName"
                    required
                    type="text"
                    placeholder="Last Name"
                    className="input-style"
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
                  name="dateOfBirth"
                  required
                  type="date"
                  placeholder="Date of Birth"
                  className="input-style"
                />
                <input
                  name="phoneNumber"
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="input-style"
                />

                <button
                  type="submit"
                  className="w-full bg-black/80 py-3 rounded-full text-white font-medium hover:bg-black transition"
                >
                  Sign Up
                </button>
              </form>

              <hr className="border-white/30 my-6 w-full max-w-2xl" />

              {/* Social Signup */}
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
                  appId="1299732128027988"
                  onSuccess={handleFacebookAuth}
                  onFail={(error) => {
                    console.log("Login Failed!", error);
                  }}
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
          )}
        </div>
      </div>
    </>
  );
}
