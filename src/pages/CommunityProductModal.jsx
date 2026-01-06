import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShapeDropdown from "../components/ShapeDropdown";

export default function CommunityProductModal({
  selectedProductId,
  selectedProductDetails,
  closeModal,
  handleOpenModal,
}) {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const [customData, setCustomData] = useState({});
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [adding, setAdding] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [showShare, setShowShare] = useState(false);

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  /* Initialize custom data */
  useEffect(() => {
    if (selectedProductDetails?.meta_data) {
      setCustomData({
        ...selectedProductDetails.meta_data,
        price: selectedProductDetails.price,
        commission:selectedProductDetails.commission
      });
      // setCommentsList(selectedProductDetails.reviews || []);
    }
  }, [selectedProductDetails]);

   useEffect(() => {
      const getBreakdown = async () => {
        try {
          axios.defaults.withCredentials = true;
          const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/calculate/price`,
            customData
          );
  
          if (data.success) {
            setCustomData((prev) => ({
              ...prev,
              commission: data.data.commission,
              price: data.data.totalPriceWithRoyalties,
            }));
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
            }
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* MODAL PANEL */}
      <div
        className="
          relative
          w-full
          h-[92vh]
          lg:h-[85vh]
          lg:max-w-7xl
          bg-[#E5E1DA]
          rounded-t-3xl lg:rounded-3xl
          overflow-y-auto
          animate-slideUp
        "
      >
        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-xl opacity-60 hover:opacity-100"
        >
          ✕
        </button>

        {/* CONTENT */}
        <div className="p-6 lg:p-10">
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
              Customizing Tools
            </h2>

            <h3 className="font-semibold tracking-wide mb-3">Gold Options</h3>

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
              {Array.from({ length: 21 }, (_, i) => 3 + i * 0.5).map((size) => (
                <option key={size} value={size.toFixed(1)}>
                  {size.toFixed(1)}
                </option>
              ))}
            </select>

            <h3 className="font-semibold tracking-wide mt-6 mb-3">
              Diamond Options
            </h3>

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
              <p>Price: ${customData?.price}</p>
              <p>Commission: ${customData?.commission}</p>
            </div>
          </div>

          {/* BUY */}
          <button
            onClick={() =>
              isLoggedIn ? handleAddToWishlist() : handleOpenModal("login")
            }
            disabled={adding}
            className={`w-full py-4 ${adding?"cursor-not-allowed bg-gray-600":"bg-black cursor-pointer"} text-white rounded-full tracking-widest mt-5 text-sm`}
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
