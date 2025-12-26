import React, { useState, useMemo, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ================= DIAMOND SHAPE OPTIONS =================
const DIAMOND_SHAPES = [
  { name: "Round", icon: "/assets/shapes/round.png" },
  { name: "Princess", icon: "/assets/shapes/princess.png" },
  { name: "Emerald", icon: "/assets/shapes/emerald.png" },
  { name: "Oval", icon: "/assets/shapes/oval.png" },
  { name: "Marquise", icon: "/assets/shapes/marquise.png" },
  { name: "Cushion", icon: "/assets/shapes/cushion.png" },
  { name: "Radiant", icon: "/assets/shapes/radiant.png" },
  { name: "Pear", icon: "/assets/shapes/pear.png" },
  { name: "Asscher", icon: "/assets/shapes/asscher.png" },
  { name: "Heart", icon: "/assets/shapes/heart.png" },
];

// ================= DROPDOWN COMPONENT =================
const ShapeDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = DIAMOND_SHAPES.find((s) => s.name === value);

  return (
    <div className="relative w-52">
      {/* Selected button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-[#D9D9D9] text-black w-full h-11 px-4 rounded-full
                   flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {selected && (
            <img src={selected.icon} alt={value} className="w-5 h-5" />
          )}
          <span className="text-sm">{value}</span>
        </div>
        <span className="text-gray-500 text-xs">▼</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white text-black rounded-xl shadow-lg overflow-hidden">
          {DIAMOND_SHAPES.map((shape) => (
            <button
              key={shape.name}
              type="button"
              onClick={() => {
                onChange(shape.name);
                setOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-left"
            >
              <img src={shape.icon} alt={shape.name} className="w-5 h-5" />
              <span className="text-sm">{shape.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};



export default function Community({handleOpenModal}) {
  const navigate=useNavigate()

  const { isLoggedIn } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const [jewelleryData, setJewelleryData] = useState([]);
  const [totalProducts, setTotalProducts] = useState();
  const totalPages = Math.ceil(totalProducts / cardsPerPage);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState({});
  // Customization states
  const [customData, setCustomData] = useState(null);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [adding, setAdding] = useState(false)
  // ⭐ Wishlist Context
  const { wishlistItems, toggleWishlist } = useWishlist();

  /* Lock scroll when modal opens */
  useEffect(() => {
    document.body.style.overflow = selectedProductId ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [selectedProductId]);

  // ⭐ INITIALIZE CUSTOMDATA FROM PRODUCT
useEffect(() => {
  if (selectedProductDetails?.meta_data) {
    setCustomData({
      goldType: selectedProductDetails.meta_data.goldType,
      goldKarat: selectedProductDetails.meta_data.goldKarat,
      ringSize: selectedProductDetails.meta_data.ringSize,
      diamondShape: selectedProductDetails.meta_data.diamondShape,
      quality: selectedProductDetails.meta_data.quality,
      centerStoneCarat: selectedProductDetails.meta_data.centerStoneCarat,
      totalCaratWeight: selectedProductDetails.meta_data.totalCaratWeight,
    });
  }
}, [selectedProductDetails]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/product?per_page=9&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(data);
        if (data.success) {
          setJewelleryData(data.data.products);
          setTotalProducts(data.data.pagination.total);
        } else toast.error("Couldn't fetch products");
      } catch (error) {
        console.log(error);
      }
    };
    loadProducts();
  }, [currentPage]);

  const loadProduct = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/product/${id}`,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      console.log(data);
      setSelectedProductId(id);
      setSelectedProductDetails(data.data.product);
    } catch (error) {
      toast.error("Couldn't fetch details");
      console.log(error);
    }
  };

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
  // SHARE POPUP STATE
  const [showShare, setShowShare] = useState(false);

  // SHARE URL
  const shareUrl = `${window.location.origin}/product/${selectedProductId}`;



  const handleLike = async() => {
    try {
     
        axios.defaults.withCredentials=true
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/${selectedProductId}/like`,
         {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setSelectedProductDetails({
          ...selectedProductDetails,
          user_liked: data.liked,
          likes_count:data.likes_count
        });
      } else toast.error("Couldn't process request");
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred")
    }

  };

  const handleComment=async()=>{
      try {
        axios.defaults.withCredentials=true
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/${selectedProductId}/review`,
          {review:comment,
            rating:rating
          },
        {
        headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
    },withCredentials: true
  })
  console.log(data)
  if(data.success) toast.success("Review added successfully")
    else toast.error("Couldn't process request")
      } catch (error) {
        console.log(error)
        toast.error("Some error occurred")
      }
    }


    const handleAddToWishlist=async()=>{
      setAdding(true)
      try {
        axios.defaults.withCredentials=true
        console.log(customData)
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
            {product_id:selectedProductId,
              ...customData
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          console.log(data)
          if(data.success){
            toast.success("Proceeding to checkout")
            navigate("/checkout")
          }
      } catch (error) {
        toast.error("Some error occurred")
        console.log(error)
      }finally{
        setAdding(false)
      }
    }



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
      </main>

      {/* MODAL */}
      {selectedProductId && (
        <>
          <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50]">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md animate-blurFade z-[40]"
              onClick={() => setSelectedProductId(null)}
            />

            {/* MODAL PANEL */}
            <div
              className="
          relative w-full max-w-7xl mx-auto
          max-h-[85vh] overflow-y-auto
          rounded-t-3xl md:rounded-3xl
          bg-[#E5E1DA] text-[#1a1a1a] font-serif
          border border-[#dcdcdc] shadow-2xl
          p-6 md:p-10 mt-32 mb-20
          z-[45] animate-slideUp
        "
            >
              {/* CLOSE */}
              <button
                onClick={() => setSelectedProductId(null)}
                className="absolute top-6 right-6 text-black/50 hover:text-black text-2xl"
              >
                ✕
              </button>

              {/* ===== GRID ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                {/* ================= TOP LEFT — CUSTOMIZABLE ================= */}
                <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
                  <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
                    Customizing Tools
                  </h2>

                  <h3 className="font-semibold tracking-wide mb-3">
                    Gold Options
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    {/* GOLD TYPE */}
                    <div>
                      <p className="text-sm mb-2">Type</p>
                      <div className="flex gap-3 text-xs capitalize">
                        {["rose", "yellow", "white"].map((t) => (
                          <button
                            key={t}
                            onClick={() =>
                              setCustomData((prev) => ({
                                ...prev,
                                goldType: t,
                              }))
                            }
                            className={`px-3 py-1 rounded-full ${
                              customData?.goldType === t
                                ? "bg-white text-black"
                                : "bg-white/20"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GOLD KARAT */}
                    <div>
                      <p className="text-sm mb-2">Karat</p>
                      <div className="flex gap-3 text-xs">
                        {["10K", "14K", "18K"].map((k) => (
                          <button
                            key={k}
                            onClick={() =>
                              setCustomData((prev) => ({
                                ...prev,
                                goldKarat: k,
                              }))
                            }
                            className={`px-3 py-1 rounded-full ${
                              customData?.goldKarat === k
                                ? "bg-white text-black"
                                : "bg-white/20"
                            }`}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RING SIZE */}
                  <p className="text-sm mt-4 mb-2">Ring Size</p>
                  <select
                    value={customData?.ringSize}
                    onChange={(e) =>
                      setCustomData((prev) => ({
                        ...prev,
                        ringSize: e.target.value,
                      }))
                    }
                    className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i}>{i + 4}</option>
                    ))}
                  </select>

                  <h3 className="font-semibold tracking-wide mt-6 mb-3">
                    Diamond Options
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    {/* SHAPE */}
                    <div>
                      <p className="text-sm mb-2">Shape</p>
                      <ShapeDropdown
                        value={customData?.diamondShape}
                        onChange={(val) =>
                          setCustomData((prev) => ({
                            ...prev,
                            diamondShape: val,
                          }))
                        }
                      />
                    </div>

                    {/* QUALITY */}
                    <div>
                      <p className="text-sm mb-1">Quality</p>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        value={
                          customData?.quality === "good"
                            ? 0
                            : customData?.quality === "premium"
                            ? 1
                            : 2
                        }
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCustomData((prev) => ({
                            ...prev,
                            quality:
                              val === 0
                                ? "good"
                                : val === 1
                                ? "premium"
                                : "excellent",
                          }));
                        }}
                        className="w-full opacity-90 cursor-pointer"
                      />
                      <div className="grid grid-cols-3 text-center text-xs mt-1">
                        <span>Good</span>
                        <span>Premium</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>

                  {/* CARAT OPTIONS */}
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <p className="text-sm mb-2">Center Stone Carat</p>
                      <input
                        type="number"
                        step="0.01"
                        value={customData?.centerStoneCarat}
                        onChange={(e) =>
                          setCustomData((prev) => ({
                            ...prev,
                            centerStoneCarat: e.target.value,
                          }))
                        }
                        className="bg-[#D9D9D9] text-black h-11 px-4 rounded-full w-full"
                      />
                    </div>

                    <div>
                      <p className="text-sm mb-2">Total Carat Weight</p>
                      <input
                        type="number"
                        step="0.01"
                        value={customData?.totalCaratWeight}
                        onChange={(e) =>
                          setCustomData((prev) => ({
                            ...prev,
                            totalCaratWeight: e.target.value,
                          }))
                        }
                        className="bg-[#D9D9D9] text-black h-11 px-4 rounded-full w-full"
                      />
                    </div>
                  </div>

                  {/* PRICE / COMMISSION */}
                  <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs mt-6">
                    <p>Price: ${selectedProductDetails.price}</p>
                    <p>
                      Commission: ${selectedProductDetails.meta_data.commission}
                    </p>
                  </div>
                </div>

                {/* ================= TOP RIGHT ================= */}
                <div className="relative bg-white rounded-3xl shadow-md overflow-hidden group">
                  {/* IMAGE */}
                  <img
                    src={selectedProductDetails.image}
                    className={`
                        w-full h-full object-cover
                        ${isLoggedIn?"transition duration-300 group-hover:brightness-75":""} 
                      `}
                  />

                  {/* LIKE BUTTON — BOTTOM RIGHT */}
                  {isLoggedIn && (<button
                    onClick={handleLike}
                    className="
                      absolute bottom-4 right-4
                      flex items-center gap-2
                      px-3 py-1.5
                      rounded-full
                      text-sm
                      bg-black/70 text-white
                      backdrop-blur
                      shadow-lg
                      transition
                      opacity-0 group-hover:opacity-100
                      hover:bg-black/80
                    "
                  >
                    {/* <img
                      src="/assets/heart.svg"
                      alt="Like"
                      className={`w-4 h-4 text-red-700  transition ${
                        selectedProductDetails.user_liked ? "scale-110 opacity-100" : "opacity-70"
                      }`
                    }
                    /> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-heart-icon lucide-heart"
                      className={`  transition ${
                        selectedProductDetails.user_liked
                          ? " text-red-700 opacity-100"
                          : "text-black opacity-70"
                      }`}
                    >
                      <path
                        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                        fill="currentColor"
                      />{" "}
                    </svg>

                    <span>{selectedProductDetails.likes_count}</span>
                  </button>)}
                </div>

                {/* ================= BOTTOM LEFT — COMMENTS ================= */}
                <div className="bg-[#6C6C6C] rounded-3xl p-6 text-white h-[200px]">
                  <p className="tracking-widest text-sm mb-2">COMMENTS</p>

                  {!isLoggedIn && (
                    <p className="text-sm opacity-80">
                      Please{" "}
                      <span onClick={()=>{handleOpenModal("login")}} className="underline cursor-pointer hover:text-blue-400">
                        login
                      </span>{" "}
                      to leave a comment.
                    </p>
                  )}

                  {isLoggedIn && (
                    <>
                      <div className="flex gap-2 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            onClick={() => setRating(s)}
                            className={`text-xl cursor-pointer ${
                              rating >= s ? "text-yellow-400" : "text-white/40"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Comments..."
                          className="w-full h-[90px] rounded-xl p-3 pb-8 bg-black/10 text-white text-sm resize-none outline-none"
                        />

                        <button
                          onClick={handleComment}
                          disabled={!rating || !comment.trim()}
                          className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-xs ${
                            !rating || !comment.trim()
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-black hover:opacity-90"
                          }`}
                        >
                          Publish
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* ================= BOTTOM RIGHT ================= */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-wide">
                      {selectedProductDetails.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      {selectedProductDetails.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-10">
                    {/* SHARE */}
                    <button
                      onClick={() => setShowShare(true)}
                      className="w-12 h-12 bg-[#C3C3C3] rounded-full flex items-center justify-center hover:bg-[#b5b5b5]"
                    >
                      <img src="/assets/Share.svg" className="w-5 h-5" />
                    </button>

                    {/* WISHLIST (NO LOGIC YET) */}
                    <button className="w-12 h-12 bg-[#C3C3C3] rounded-full flex items-center justify-center hover:bg-[#b5b5b5]">
                      <img src="/assets/wishlist.svg" className="w-5 h-5" />
                    </button>

                    <button
                      onClick={()=>{isLoggedIn?handleAddToWishlist():handleOpenModal("login")}}
                      className={`${adding?"bg-gray-600 cursor-not-allowed":"cursor-pointer bg-[#6B6B6B]"} ml-auto px-12 py-3  text-white rounded-full text-xs tracking-widest`}
                    >
                      {adding?"Processing...":"BUY NOW"}
                    </button>
                  </div>
                </div>
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

          {/* ================= SHARE POPUP ================= */}
          {showShare && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowShare(false)}
              />

              <div className="relative bg-white rounded-2xl w-[360px] p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Share this design
                </h3>

                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied!");
                    }}
                    className="text-sm font-medium text-[#2E4B45]"
                  >
                    Copy
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs text-center">
                  <a href="https://www.instagram.com" target="_blank">
                    <img src="/assets/instagram.svg" className="w-8 mx-auto" />
                    Instagram
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                  >
                    <img src="/assets/facebook.svg" className="w-8 mx-auto" />
                    Facebook
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                  >
                    <img src="/assets/whatsapp.svg" className="w-8 mx-auto" />
                    WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => setShowShare(false)}
                  className="absolute top-3 right-3 text-gray-400"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
