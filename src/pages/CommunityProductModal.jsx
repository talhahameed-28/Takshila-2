import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShapeDropdown from "../components/ShapeDropdown";
import PricingBreakdownModal from "../components/PriceBreakdown";

export default function CommunityProductModal({
  selectedProductId,
  selectedProductDetails,
  closeModal,
  handleOpenModal,
}) {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const [customData, setCustomData] = useState({});
  const [priceData, setPriceData] = useState({});
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [adding, setAdding] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  /* Initialize custom data */
  useEffect(() => {
    if (selectedProductDetails?.meta_data) {
      setCustomData({
        goldType:
          selectedProductDetails.meta_data.goldType != "undefined"
            ? selectedProductDetails.meta_data.goldType
            : "rose",
        goldKarat:
          selectedProductDetails.meta_data.goldKarat != "undefined"
            ? selectedProductDetails.meta_data.goldKarat
            : "10K",
        ringSize: selectedProductDetails.meta_data.ringSize,
        diamondShape: selectedProductDetails.meta_data.diamondShape,
        quality: selectedProductDetails.meta_data.quality,
        centerStoneCarat: selectedProductDetails.meta_data.centerStoneCarat,
        totalCaratWeight: selectedProductDetails.meta_data.totalCaratWeight,
        metalType: selectedProductDetails.meta_data.metalType,
        stoneType: selectedProductDetails.meta_data.stoneType,
      });
    }
  }, [selectedProductDetails]);

  useEffect(() => {
    const getBreakdown = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/calculate/price`,
          customData,
        );

        if (data.success) {
          setPriceData(data.data);
        } else {
          toast.error("Couldn't process your request");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (Object.keys(customData).length === 0) return;
    // debounce
    const timer = setTimeout(() => {
      getBreakdown();
    }, 1000);
    console.log(customData);
    return () => clearTimeout(timer);
  }, [customData]);

  const handleAddToWishlist = async () => {
    setAdding(true);
    try {
      if (customData.totalCaratWeight < customData.centerStoneCarat) {
        toast.error("Center stone weight cant be greater than total weight");
        return;
      }
      axios.defaults.withCredentials = true;
      console.log(customData);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
        { product_id: selectedProductId, ...customData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(data);
      if (data.success) {
        toast.success("Proceeding to checkout");
        navigate("/checkout");
      }
    } catch (error) {
      toast.error("Some error occurred");
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  /* Bottom-sheet animation handled via CSS */

  return (
    <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center">
      {/* BACKDROP */}
      {showBreakdown && (
        <PricingBreakdownModal
          setShowBreakdown={setShowBreakdown}
          breakdown={priceData}
        />
      )}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* MODAL PANEL */}
      <div
        className="
          relative
          w-110
          h-[60vh]
          lg:h-[85vh]
          md:w-2xl
          bg-[#1a1a1a]
          rounded-t-3xl lg:rounded-3xl
          rounded-b-2xl
          overflow-y-auto
          animate-slideUp
          mb-16
        "
      >
        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="absolute top-6 right-8 text-xl opacity-60 hover:opacity-100"
        >
          ✕
        </button>

        {/* CONTENT */}
        <div className="p-4 lg:p-10">
          <div className="bg-[#3f3e3e] rounded-3xl p-8  text-white">
            <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
              Customizing Tools
            </h2>
            <h3 className="font-semibold tracking-wide mb-3">Metal type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <div>
                <p className="text-sm mb-2">Type</p>

                <div className="flex items-center gap-10">
                  {["gold", "silver"].map((t) => (
                    <label
                      key={t}
                      className="flex flex-col items-center gap-2 text-xs tracking-wide cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={t}
                        name="metalType"
                        checked={t == customData?.metalType}
                        onChange={() =>
                          setCustomData((prev) => ({ ...prev, metalType: t }))
                        }
                        className="w-5 h-5 accent-black"
                      />
                      <span className="mt-1 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div></div>
            </div>
            {customData.metalType != "silver" && (
              <>
                <h3 className="font-semibold tracking-wide mb-3">
                  Gold Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            customData?.goldKarat == k
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
              </>
            )}

            {/* RING SIZE */}
            <h3 className="font-semibold tracking-wide mt-4 mb-3">Ring Size</h3>
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
              {Array.from({ length: 21 }, (_, i) => 3 + i * 0.5).map((size) => (
                <option key={size} value={size.toFixed(1)}>
                  {size.toFixed(1)}
                </option>
              ))}
            </select>

            <h3 className="font-semibold tracking-wide mt-6 mb-3">
              Stone Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <div>
                <p className="text-sm mb-2">Type</p>

                <div className="flex items-center gap-10">
                  {["diamond", "monsinite"].map((t) => (
                    <label
                      key={t}
                      className="flex flex-col items-center gap-2 text-xs tracking-wide cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={t}
                        name="stoneType"
                        checked={t == customData?.stoneType}
                        onChange={() =>
                          setCustomData((prev) => ({ ...prev, stoneType: t }))
                        }
                        className="w-5 h-5 accent-black"
                      />
                      <span className="mt-1 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {customData?.stoneType != "monsinite" && (
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
              )}
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
            <div className="flex gap-3 justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs mt-6">
              <div className="flex">
                <p className="text-nowrap">
                  Price: ${priceData?.totalPriceWithRoyalties}
                </p>
                <button
                  type="button"
                  onClick={() => setShowBreakdown(true)}
                  className="ml-2 cursor-pointer w-4 h-4 bg-black text-white rounded-full text-[10px] flex items-center justify-center"
                >
                  i
                </button>
              </div>
              <p>Commission: ${priceData?.commission}</p>
            </div>
          </div>

          {/* BUY */}
          <button
            onClick={() =>
              isLoggedIn ? handleAddToWishlist() : handleOpenModal("login")
            }
            disabled={adding}
            className={`w-full py-4 ${adding ? "cursor-not-allowed bg-gray-600" : "bg-black cursor-pointer"} text-white rounded-full tracking-widest mt-5 text-sm`}
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp .4s ease-out both;
        }
      `}</style>
    </div>
  );
}
