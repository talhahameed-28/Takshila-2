import React, { useState, useMemo, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* Helpers */
const parsePrice = (p) =>
  typeof p === "string" ? Number(p.replace(/[^0-9.-]+/g, "")) : Number(p || 0);

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : n;


export default function Community() {
  const {isLoggedIn}=useSelector(state=>state.user)

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const [jewelleryData, setJewelleryData] = useState([])
  const [totalProducts, setTotalProducts] = useState()
  const totalPages = Math.ceil(totalProducts / cardsPerPage);


  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState({})
  // Customization states
  const [goldType, setGoldType] = useState("Yellow");
  const [goldKarat, setGoldKarat] = useState("18K");
  const [quality, setQuality] = useState(80);
  const [centerStoneCarat, setCenterStoneCarat] = useState(1);
  const [totalCaratWeight, setTotalCaratWeight] = useState(5);
const [comment, setComment] = useState("")
const [rating, setRating] = useState(0)
  // ⭐ Wishlist Context
  const { wishlistItems, toggleWishlist } = useWishlist();

  /* Lock scroll when modal opens */
  useEffect(() => {
    document.body.style.overflow = selectedProductId ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [selectedProductId]);

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
  
  const loadProduct=async(id)=>{
      try {
        axios.defaults.withCredentials=true
        const {data}=await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/${id}`)
        console.log(data)
        setSelectedProductId(id)
        setSelectedProductDetails(data.data.product)
      } catch (error) {
        toast.error("Couldn't fetch details")
        console.log(error)
      }
    }
  

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  /* Pricing logic (unchanged) */
  // const pricing = useMemo(() => {
  //   if (!selected) return null;

  //   const basePrice = parsePrice(selected.price) || 0;
  //   const baseMat = basePrice * 0.55;
  //   const baseCraft = basePrice * 0.18;
  //   const baseOther = basePrice * 0.12;

  //   const karatM = { "10K": 0.65, "14K": 0.85, "18K": 1.0 };
  //   const typeM = { White: 1.05, Yellow: 1.0, Rose: 0.98 };

  //   const kar = karatM[goldKarat] || 1.0;
  //   const typ = typeM[goldType] || 1.0;

  //   const metalCost = baseMat * kar * typ * (totalCaratWeight / 5);
  //   const qualityFactor = 0.5 + (quality / 100) * 1.6;
  //   const qualityCost = baseCraft * (qualityFactor - 1);
  //   const workingCharges = 25 * totalCaratWeight;
  //   const settingCost = 150;
  //   const certification = 200;
  //   const shipping = 50;
  //   const overhead = baseOther;

  //   const total =
  //     metalCost +
  //     qualityCost +
  //     workingCharges +
  //     settingCost +
  //     certification +
  //     shipping +
  //     overhead;

  //   return {
  //     total: Number(total.toFixed(2)),
  //     metalCost: Number(metalCost.toFixed(2)),
  //     qualityCost: Number(qualityCost.toFixed(2)),
  //     workingCharges: Number(workingCharges.toFixed(2)),
  //     settingCost,
  //     certification,
  //     shipping,
  //     overhead,
  //   };
  // }, [selected, goldType, goldKarat, quality, totalCaratWeight]);

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
                onClick={() => loadProduct(item.id)}
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
                          loadProduct(item.id); // ← opens modal
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
      {/* MODAL */}
      {selectedProductId && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50]">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-blurFade z-[40]"
            onClick={() => setSelectedProductId(null)}
          />

          {/* MODAL PANEL */}
          <div
            className="relative w-full overflow-y-auto max-h-[90vh]
            max-w-6xl mx-auto rounded-t-3xl md:rounded-3xl
          bg-[#f7f6f5] text-[#1a1a1a] font-serif
            border border-[#dcdcdc] shadow-2xl p-6 md:p-10 mt-24 mb-24 overflow-hidden
            z-[45] animate-slideUp"
            role="dialog"
            aria-modal="true"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedProductId(null)}
              className="absolute top-6 right-6 text-black/50 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            {/* ROW 1 — DETAILS LEFT + PRICE / COMMISSION / IMAGE RIGHT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* LEFT DETAILS */}
              <div>
                <h2 className="text-3xl font-light">{selectedProductDetails.name}</h2>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <img src={selectedProductDetails.user.avatar} className="w-4 opacity-70" />
                  {selectedProductDetails.user.name}
                </p>

                <div className="mt-6 text-sm leading-7">
                  <div className="flex justify-between">
                    <span>Gold Type</span>
                    <span>{selectedProductDetails.meta_data.goldType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold Karat</span>
                    <span>{selectedProductDetails.meta_data.goldKarat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ring Size</span>
                    <span>{selectedProductDetails.meta_data.ringSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diamond Shape</span>
                    <span>{selectedProductDetails.meta_data.diamondShape}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality</span>
                    <span>{selectedProductDetails.meta_data.quality}</span>
                    
                  </div>
                  <div className="flex justify-between">
                    <span>Center Stone Carat</span>
                    <span>{selectedProductDetails.meta_data.centerStoneCarat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Carat Weight</span>
                    <span>{selectedProductDetails.meta_data.totalCaratWeight}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT — PRICE, COMMISSION, IMAGE */}
              <div className="flex flex-col items-end">
                {/* PRICE BLOCK */}
                <div className="text-right mb-6">
                  {/* Total Price */}
                  <div className="flex items-center gap-3 justify-end">
                    <img
                      src="/assets/price-icon.svg"
                      className="w-6 h-6 opacity-80"
                    />
                    <span className="text-3xl font-semibold tracking-wide">
                      {selectedProductDetails.price}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-32 h-px bg-gray-400/50 my-3 ml-auto"></div>

                  {/* Commission (5%) */}
                  <div className="flex items-center gap-3 justify-end">
                    <img
                      src="/assets/commission-icon.svg"
                      className="w-6 h-6 opacity-80"
                    />
                    <span className="text-2xl font-medium">
                      {selectedProductDetails.meta_data.commission}
                    </span>
                  </div>
                </div>

                {/* IMAGE */}
                <div className="rounded-xl overflow-hidden border shadow-md w-full max-w-md">
                  <img src={selectedProductDetails.image} className="w-full object-cover" />
                </div>

                <p className="text-xs italic mt-4 text-gray-600 leading-relaxed text-right">
                  Wanna fine-tune your design? Checkout and work with our CAD
                  team for a 3D preview before casting.
                </p>
              </div>
            </div>

            {/* ROW 2 — ATTRIBUTES */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Attributes</h3>

              {/* Gold Type + Gold Karat (Side by Side) */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Gold Type */}
                <div>
                  <label className="font-medium">Gold Type</label>
                  <div className="flex flex-row gap-2 mt-2">
                    {["Rose", "Yellow", "White"].map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          checked={goldType === t}
                          onChange={() => setGoldType(t)}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gold Karat */}
                <div>
                  <label className="font-medium">Gold Karat</label>
                  <div className="flex flex-row gap-2 mt-2">
                    {["10K", "14K", "18K"].map((k) => (
                      <label
                        key={k}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          checked={goldKarat === k}
                          onChange={() => setGoldKarat(k)}
                        />
                        {k}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quality Slider */}
              {/* Quality Slider */}
              <div className="mb-6">
                <label className="font-medium block mb-2">Quality</label>

                <div className="w-full">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-3/4" /* smaller but aligned left */
                  />

                  {/* Checkpoint labels */}
                  <div className="w-3/4 flex justify-between text-xs text-gray-600 mt-1 px-1">
                    <span>Good</span>
                    <span>Premium</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Selected Quality Text */}
                <p className="text-sm mt-2 font-semibold ">
                  {qualityLabel(quality)}
                </p>
              </div>

              {/* Carat Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Center Stone Carat</label>
                  <input
                    type="number"
                    step="0.01" // ⭐ increments in 0.01
                    className="w-full border mt-2 rounded-lg p-2"
                    value={centerStoneCarat}
                    onChange={(e) =>
                      setCenterStoneCarat(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="font-medium">Total Carat Weight</label>
                  <input
                    type="number"
                    step="0.01" // ⭐ increments in 0.01
                    className="w-full border mt-2 rounded-lg p-2"
                    value={totalCaratWeight}
                    onChange={(e) =>
                      setTotalCaratWeight(Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>

            {/* BUY NOW BUTTON BELOW ATTRIBUTES */}
            <div className="w-full flex justify-end mt-6">
              <button
                onClick={() => {
                  // addToCart({
                  //   ...selected,
                  //   finalPrice: pricing.total,
                  //   goldType,
                  //   goldKarat,
                  //   quality,
                  //   centerStoneCarat,
                  //   totalCaratWeight,
                  // });
                  setSelectedProductId(null);
                  navigate("/wishlist");
                }}
                className="px-10 py-3 bg-[#2E4B45] hover:bg-[#1d5049] text-white text-lg rounded-full shadow-md transition"
              >
                Buy Now 
              </button>
            </div>

            {/* ROW 3 — COMMENTS */}
            <div className="mt-12 border-t border-gray-300 pt-10 w-full">
              {!isLoggedIn && (
                <div>
                  <p className="text-gray-700 text-lg">
                    Please{" "}
                    <a
                      href="/login"
                      className="text-[#6ac7c2] underline hover:text-[#2E4B45]"
                    >
                      login
                    </a>{" "}
                    to leave a comment.
                  </p>
                  <p className="text-gray-600 mt-4 italic">No comments yet.</p>
                </div>
              )}

              {isLoggedIn && (
                <div className="w-full">
                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        onClick={() => setRating(s)}
                        className={`text-2xl cursor-pointer transition ${
                          rating >= s ? "text-[#2E4B45]" : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-gray-600">{rating}/5</span>
                  </div>

                  {/* Comment Box */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 border border-gray-300 rounded-xl p-4 text-gray-700 bg-white/40 placeholder-gray-500 outline-none focus:border-[#2E4B45]"
                    placeholder="Write your comment here..."
                  ></textarea>

                  <div className="w-full flex justify-end mt-4">
                    <button
                      className="px-8 py-3 bg-gradient-to-r from-[#1E5F57] to-[#2E4B45] text-white text-lg rounded-full shadow-lg hover:opacity-90 transition"
                      onClick={() => {
                        console.log({ rating, likes, comment });
                        setComment("");
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ANIMATIONS */}
            <style>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blurFade {
          0% { opacity: 0; backdrop-filter: blur(0px); }
          100% { opacity: 1; backdrop-filter: blur(10px); }
        }
        .animate-slideUp { animation: slideUp .6s both ease-out; }
        .animate-blurFade { animation: blurFade .6s both; }
      `}</style>
          </div>
        </div>
      )}


    </div>
  );
}
