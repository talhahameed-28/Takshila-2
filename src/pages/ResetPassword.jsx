import React, { useState } from "react";
import { useLocation, useNavigate,useSearchParams,useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const {token}=useParams()
  const [searchParams]=useSearchParams()
  const email=searchParams.get("email")
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleVerify = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;
       const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      values.token=token
      values.email=email
      console.log(values)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/password/reset`,
        values
      );
      console.log(data)
      if (data.success) {
        toast.success("Password reset Successfully 🎉");
        // localStorage.setItem("authUser", JSON.stringify(data.user)); // 🔹 Save login session
        // window.dispatchEvent(new Event("auth-changed"));
        navigate("/"); // redirect to home
      } else {
        toast.error(data.message || "Could not reset password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not reset password");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Reset password</h2>
        <p className="text-gray-300 mb-6">
          Set a new password for your account
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            defaultValue={email}
            // onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter email"
            // maxLength={6}
            className="w-full text-center text-lg tracking-widest bg-white/30 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-gray-300"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full font-medium transition ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed text-white/70"
                : "bg-black/80 text-white hover:bg-black"
            }`}
          >
            {isSubmitting ? "Please wait..." : "Reset password"}
          </button>
        </form>

       
          <button
            onClick={()=>navigate("/")}

            className="text-blue-400 hover:underline disabled:opacity-50"
          >
            Back to home
          </button>
      </div>
    </div>
  );
}
