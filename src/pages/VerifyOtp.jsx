import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("Enter OTP");

    try {
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/verifyOtp`,
        { userId, otp }
      );

      if (data.success) {
        toast.success("OTP Verified Successfully 🎉");
        localStorage.setItem("authUser", JSON.stringify(data.user)); // 🔹 Save login session
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/"); // redirect to home
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/resendOtp`,
        { userId }
      );
      if (data.success) toast.success("New OTP sent!");
      else toast.error("Failed to resend OTP");
    } catch (err) {
      console.error(err);
      toast.error("Error resending OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Account</h2>
        <p className="text-gray-300 mb-6">
          Enter the OTP sent to your registered email or phone.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full text-center text-lg tracking-widest bg-white/30 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-gray-300"
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
            disabled={isSubmitting}
            className="text-blue-400 hover:underline disabled:opacity-50"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
//hi