import React, { useState, useMemo, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import axios from "axios";
import toast from "react-hot-toast";

/* Helpers */
const parsePrice = (p) =>
  typeof p === "string" ? Number(p.replace(/[^0-9.-]+/g, "")) : Number(p || 0);

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : n;


export default function Community() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const [jewelleryData, setJewelleryData] = useState([])
  const [totalProducts, setTotalProducts] = useState()
  const totalPages = Math.ceil(totalProducts / cardsPerPage);


  const [selected, setSelected] = useState(null);

  // Customization states
  const [goldType, setGoldType] = useState("Yellow");
  const [goldKarat, setGoldKarat] = useState("18K");
  const [quality, setQuality] = useState(80);
  const [centerStoneCarat, setCenterStoneCarat] = useState(1);
  const [totalCaratWeight, setTotalCaratWeight] = useState(5);

  // ⭐ Wishlist Context
  const { wishlistItems, toggleWishlist } = useWishlist();

  /* Lock scroll when modal opens */
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [selected]);

  useEffect(() => {
    const loadProducts=async()=>{
      try {
        const {data}=await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product?per_page=9&page=${currentPage}`)
        console.log(data)
        if(data.success) {
          setJewelleryData(data.data.products)
          setTotalProducts(data.data.pagination.total)
        }
        else toast.error("Couldn't fetch products")
      } catch (error) {
        console.log(error)
      }
    }
    loadProducts()
    
  }, [currentPage])
  

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  /* Pricing logic (unchanged) */
  const pricing = useMemo(() => {
    if (!selected) return null;

    const basePrice = parsePrice(selected.price) || 0;
    const baseMat = basePrice * 0.55;
    const baseCraft = basePrice * 0.18;
    const baseOther = basePrice * 0.12;

    const karatM = { "10K": 0.65, "14K": 0.85, "18K": 1.0 };
    const typeM = { White: 1.05, Yellow: 1.0, Rose: 0.98 };

    const kar = karatM[goldKarat] || 1.0;
    const typ = typeM[goldType] || 1.0;

    const metalCost = baseMat * kar * typ * (totalCaratWeight / 5);
    const qualityFactor = 0.5 + (quality / 100) * 1.6;
    const qualityCost = baseCraft * (qualityFactor - 1);
    const workingCharges = 25 * totalCaratWeight;
    const settingCost = 150;
    const certification = 200;
    const shipping = 50;
    const overhead = baseOther;

    const total =
      metalCost +
      qualityCost +
      workingCharges +
      settingCost +
      certification +
      shipping +
      overhead;

    return {
      total: Number(total.toFixed(2)),
      metalCost: Number(metalCost.toFixed(2)),
      qualityCost: Number(qualityCost.toFixed(2)),
      workingCharges: Number(workingCharges.toFixed(2)),
      settingCost,
      certification,
      shipping,
      overhead,
    };
  }, [selected, goldType, goldKarat, quality, totalCaratWeight]);

  const qualityLabel = (q) =>
    q >= 76 ? "Excellent" : q >= 41 ? "Premium" : "Good";

  /* ------------------------------------------------------------------- */

  return (
    <div className="bg-[#e5e2df] text-[#1a1a1a] min-h-screen flex flex-col font-serif">
      {/* Page header */}
      <section className="text-center pt-40 mb-20">
        <h1 className="text-5xl font-light tracking-wide text-[#1a1a1a]">
          EXPLORE THE CREATIONS
        </h1>
        <p className="text-sm mt-3 text-[#1a1a1a]/70">
          Discover designs crafted by our talented community members.
        </p>
      </section>
{/* Pagination */}
        <div className="flex justify-center items-center gap-3 mb-14">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-full text-lg font-bold ${
              currentPage === 1
                ? "text-gray-400"
                : "text-[#1a1a1a] hover:text-[#2E4B45]"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, p) => (
            <button
              key={p}
              onClick={() => goToPage(p + 1)}
              className={`w-9 h-9 rounded-full text-sm flex items-center justify-center ${
                currentPage === p + 1
                  ? "bg-[#2E4B45] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-[#d8d6d3]"
              }`}
            >
              {p + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-full text-lg font-bold ${
              currentPage === totalPages
                ? "text-gray-400"
                : "text-[#1a1a1a] hover:text-[#2E4B45]"
            }`}
          >
            &gt;
          </button>
        </div>
     
      {/* Grid */}
      <main className="flex-grow px-6 md:px-12 lg:px-20 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {jewelleryData.map((item) => {
            const isWishlisted = wishlistItems.some((w) => w.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="cursor-pointer group rounded-3xl border border-[#ccc] bg-[#f7f6f5] hover:bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-t-3xl"
                />

                <div className="p-6 flex flex-col justify-between min-h-[150px]">
                  <div>
                    <h2 className="text-lg font-semibold uppercase">
                      {item.name}
                    </h2>
                    <p className="text-sm text-[#1a1a1a]/80 flex items-center gap-2 mt-1">
                      <img
                        src="assets/user.svg"
                        alt="user"
                        className="w-4 h-4 opacity-70"
                      />
                      {item.designer}
                    </p>
                    <p className="text-xs text-[#1a1a1a]/60 mt-2 italic">
                      Tap to view details
                    </p>
                  </div>

                  {/* Price + Wishlist */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-[#1a1a1a]">
                      {item.price}
                    </span>

                    <div className="flex items-center gap-3">
                      {/* ❤️ Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        className={`w-9 h-9 flex items-center justify-center rounded-full border transition 
        ${
          isWishlisted
            ? "bg-neutral-900 border-neutral-950"
            : "bg-gray-300 border-gray-400 hover:bg-gray-500"
        }`}
                      >
                        <img
                          src="assets/wishlist.svg"
                          alt="wishlist"
                          className="w-5 h-5"
                        />
                      </button>

                      {/* 🛒 Buy Now Button (opens modal only) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(item); // ← opens modal
                        }}
                        className="px-5 py-2 bg-[#555555] hover:bg-[#000000] text-white text-sm rounded-full 
                 transition shadow-md hover:shadow-lg active:scale-95"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-center items-center gap-3 mt-14">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-full text-lg font-bold ${
              currentPage === 1
                ? "text-gray-400"
                : "text-[#1a1a1a] hover:text-[#2E4B45]"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, p) => (
            <button
              key={p}
              onClick={() => goToPage(p + 1)}
              className={`w-9 h-9 rounded-full text-sm flex items-center justify-center ${
                currentPage === p + 1
                  ? "bg-[#2E4B45] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-[#d8d6d3]"
              }`}
            >
              {p + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-full text-lg font-bold ${
              currentPage === totalPages
                ? "text-gray-400"
                : "text-[#1a1a1a] hover:text-[#2E4B45]"
            }`}
          >
            &gt;
          </button>
        </div> */}
      </main>

      {/* MODAL (unchanged except Buy Now removed) */}
      {selected && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50]">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-blurFade z-[40]"
            onClick={() => setSelected(null)}
          />

          {/* MODAL */}
          <div
            className="relative w-full max-w-6xl mx-auto rounded-t-3xl md:rounded-3xl
                       bg-gradient-to-br from-[#2E4B45]/95 to-[#1D5049]/90 text-white font-serif
                       border border-white/10 shadow-2xl p-6 md:p-10 mt-20 overflow-hidden
                       z-[45] animate-slideUp"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* LEFT */}
              <div>
                <div className="rounded-2xl overflow-hidden bg-white/10 p-2">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-[360px] object-cover rounded-xl"
                  />
                </div>
                <h2 className="mt-6 text-3xl font-light tracking-wide">
                  {selected.name}
                </h2>
                <p className="text-[#b6d2c9] text-sm mt-1">
                  Designed by {selected.user.name}
                </p>
                <p className="text-white/80 text-sm mt-4">
                  {selected.description}
                </p>
              </div>

              {/* MIDDLE — customization stays unchanged */}
              <div>{/* ... your customization UI ... */}</div>

              {/* RIGHT — Pricing */}
              <div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                  <h3 className="text-xl font-medium mb-4 text-white">
                    Price Summary
                  </h3>

                  {pricing && (
                    <div className="space-y-3 text-sm text-white/90">
                      <div className="flex justify-between">
                        <span>Metal Cost</span>
                        <span>{fmt(pricing.metalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Cost</span>
                        <span>{fmt(pricing.qualityCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Working Charges</span>
                        <span>{fmt(pricing.workingCharges)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Setting Cost</span>
                        <span>{fmt(pricing.settingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certification</span>
                        <span>{fmt(pricing.certification)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{fmt(pricing.shipping)}</span>
                      </div>
                      <div className="border-t border-white/20 mt-3 pt-3 flex justify-between">
                        <span>Total</span>
                        <span className="text-2xl font-bold text-[#b6d2c9]">
                          {fmt(pricing.total)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Animations */}
          <style>{`
            @keyframes slideUp {
              0% { opacity: 0; transform: translateY(40px) scale(0.97); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes blurFade {
              0% { opacity: 0; backdrop-filter: blur(0px); }
              100% { opacity: 1; backdrop-filter: blur(10px); }
            }
            .animate-slideUp { animation: slideUp 0.6s cubic-bezier(.2,.9,.28,1) both; }
            .animate-blurFade { animation: blurFade 0.6s ease-out both; }
          `}</style>
        </div>
      )}
    </div>
  );
}
