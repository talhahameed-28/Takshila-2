import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#d8d3cc] px-4">
      {/* Card */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg px-10 py-12 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-6">
          Payment Failed
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          We couldn't process your payment. Please try again or contact
          support.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#2f5d62] hover:bg-[#24484c] text-white font-semibold px-8 py-3 rounded-full transition duration-200"
        >
          Go to Homepage
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-800 text-sm">
        Copyright © 2024. All Right Reserved
      </footer>
    </div>
  );
};

export default OrderCancel;

