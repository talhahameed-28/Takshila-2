import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  const [tab, setTab] = useState("orders"); // "orders" or "delivered"

  const sampleOrders = [
    {
      id: "xx908290320xx",
      name: "The name of the product",
      date: "dd/mm/yy",
      price: "$ 'Price'",
      status: "In Transit",
      statusColor: "text-gray-500",
    },
    {
      id: "xx908290320xx",
      name: "The name of the product",
      date: "dd/mm/yy",
      price: "$ 'Price'",
      status: "Payment Failed!",
      statusColor: "text-red-500",
    },
    {
      id: "xx908290320xx",
      name: "The name of the product",
      date: "dd/mm/yy",
      price: "$ 'Price'",
      status: "Processed",
      statusColor: "text-gray-500",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#e5e3df] text-black flex flex-col items-center pt-20 px-4">
      {/* --- Page Title --- */}
      <h1 className="text-2xl font-semibold mb-10">Track Your Order</h1>

      {/* --- Tabs --- */}
      <div className="flex items-center justify-center space-x-16 text-lg font-medium mb-8">
        {/* My Orders */}
        <button
          onClick={() => setTab("orders")}
          className={`pb-1 ${
            tab === "orders"
              ? "text-black border-b-[1.5px] border-black"
              : "text-gray-400"
          }`}
        >
          My Orders
        </button>

        {/* Delivered */}
        <button
          onClick={() => setTab("delivered")}
          className={`pb-1 ${
            tab === "delivered"
              ? "text-black border-b-[1.5px] border-black"
              : "text-gray-400"
          }`}
        >
          Delivered
        </button>
      </div>

      {/* --- CONTENT BASED ON TAB --- */}

      {/* ---------- My Orders Tab ---------- */}
      {tab === "orders" && (
        <div className="w-full max-w-3xl space-y-6">
          {sampleOrders.map((o, i) => (
            <div
              key={i}
              className="w-full bg-[#d8d8d8] rounded-2xl p-5 flex items-center justify-between shadow-sm"
            >
              {/* Left Side */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl"></div>

                <div className="flex flex-col text-sm">
                  <span className="font-semibold">{o.name}</span>
                  <span className="text-gray-600">Ordered on : {o.date}</span>
                  <span className="text-gray-600">Order id : {o.id}</span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col text-right text-sm">
                <span className="font-semibold">{o.price}</span>
                <span className={`${o.statusColor} mt-1`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Delivered Tab ---------- */}
      {tab === "delivered" && (
        <div className="w-full max-w-3xl flex flex-col items-center mt-16">
          <p className="text-gray-600 text-lg mb-6">No orders yet</p>

          <Link
            to="/cart"
            className="bg-[#d8d8d8] text-gray-700 px-6 py-2 rounded-full shadow 
                       hover:bg-[#cecece] transition"
          >
            Go to cart !
          </Link>
        </div>
      )}

      {/* --- Footer Help Text --- */}
      <div className="w-full max-w-3xl border-t border-gray-400 mt-20 pt-4 text-center text-gray-700 text-sm">
        Need Help? Call us Now!
      </div>
    </div>
  );
}
