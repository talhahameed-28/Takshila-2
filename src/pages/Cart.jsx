import React from "react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems } = useCart();

  return (
    <div className="mt-32 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-300">Your cart is currently empty.</p>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-md flex items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-300">{item.designer}</p>
                <p className="text-gray-200 mt-1">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
