import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

export default function AuthModals({ isOpen, type, onClose, switchType }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState(null);

  // 🧠 Handle Signup
  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());

      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/register`,
        values
      );

      if (data.success) {
        setTempUserId(data.userId);
        toast.success("OTP sent to your email/phone");
        switchType("otp"); // 🔄 Show OTP modal
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error during signup");
    } finally {
      setTimeout(() => setIsSubmitting(false), 3000);
    }
  };

  // 🧠 Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length < 4) return toast.error("Enter valid OTP");

    try {
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/verifyOtp`,
        { userId: tempUserId, otp }
      );

      if (data.success) {
        toast.success("OTP Verified! 🎉");
        onClose();
        navigate("/");
      } else toast.error(data.message || "Invalid OTP");
    } catch (err) {
      console.log(err);
      toast.error("OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🧠 Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/resendOtp`,
        { userId: tempUserId }
      );

      if (data.success) toast.success("New OTP sent!");
      else toast.error(data.message || "Failed to resend OTP");
    } catch (err) {
      console.log(err);
      toast.error("Error resending OTP");
    } finally {
      setTimeout(() => setIsResending(false), 3000);
    }
  };

  // 🧠 Handle Login
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/login`,
        values
      );

      if (data.success) {
        toast.success("Logging you in...");
        window.location.reload();
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed");
    } finally {
      setTimeout(() => setIsSubmitting(false), 3000);
    }
  };

  // 🧠 Social Logins
  const handleFacebookAuth = async (response) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/facebook`,
        { id_token: response.accessToken }
      );
      if (data.success) {
        onClose();
        toast.success("Logged in through Facebook");
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
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/google`,
        { id_token }
      );
      if (data.success) {
        onClose();
        toast.success("Google authentication successful");
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

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-5 pointer-events-none"
        }`}
      >
        <div
          className={`relative bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl w-[90%] max-w-4xl text-white p-10 flex flex-col items-center`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black backdrop-blur-md rounded-full w-20 h-20 shadow-xl flex items-center justify-center border border-white/30">
            <img
              src="assets/logoo.svg"
              alt="Logo"
              className="h-14 w-14 rounded-full"
            />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
          >
            ✕
          </button>

          {/* 🔹 LOGIN */}
          {type === "login" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Login to Takshila</h2>
              <form
                onSubmit={handleLogin}
                className="space-y-4 w-full max-w-sm"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="input-style"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input-style"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-full font-medium transition ${
                    isSubmitting
                      ? "bg-gray-600 cursor-not-allowed text-white/70"
                      : "bg-black/80 text-white hover:bg-black"
                  }`}
                >
                  {isSubmitting ? "Please wait..." : "Log In"}
                </button>
              </form>

              <hr className="border-white/30 my-6 w-full max-w-sm" />

              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin
                  onSuccess={handleGoogleAuth}
                  onError={() => console.log("Login Failed")}
                />
              </GoogleOAuthProvider>

              <p className="mt-6 text-sm">
                Don’t have an account?{" "}
                <button
                  onClick={() => switchType("signup")}
                  className="text-blue-400 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}

          {/* 🔹 SIGNUP */}
          {type === "signup" && (
            <>
              <h2 className="text-3xl font-semibold text-center mb-2">
                Create Account
              </h2>
              <p className="text-center text-sm text-gray-200 mb-6">
                Join Takshila
              </p>

              <form
                onSubmit={handleRegister}
                className="space-y-4 w-full max-w-2xl text-xs"
              >
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
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-full font-medium transition ${
                    isSubmitting
                      ? "bg-gray-600 cursor-not-allowed text-white/70"
                      : "bg-black/80 text-white hover:bg-black"
                  }`}
                >
                  {isSubmitting ? "Please wait..." : "Sign Up"}
                </button>
              </form>

              <p className="text-center text-gray-200 text-sm mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => switchType("login")}
                  className="text-blue-400 hover:underline"
                >
                  Login
                </button>
              </p>
            </>
          )}

          {/* 🔹 OTP VERIFICATION */}
          {type === "otp" && (
            <>
              <h2 className="text-2xl font-semibold mt-2">
                Verify Your Account
              </h2>
              <p className="text-sm text-gray-300 mt-2 mb-6">
                Enter the OTP sent to your registered email or phone.
              </p>

              <form
                onSubmit={handleVerifyOtp}
                className="space-y-5 w-full max-w-sm"
              >
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-white/30 text-white px-4 py-3 rounded-full text-center text-lg tracking-widest placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-full font-medium transition ${
                    isSubmitting
                      ? "bg-gray-600 cursor-not-allowed text-white/70"
                      : "bg-black/80 text-white hover:bg-black"
                  }`}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-300">
                Didn’t receive OTP?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className={`underline ${
                    isResending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isResending ? "Resending..." : "Resend"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
