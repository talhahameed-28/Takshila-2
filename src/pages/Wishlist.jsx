import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]); // ✅ ADD THIS

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const shareUrl = `${window.location.origin}/wishlist`; // ✅ ADD THIS
  // const { wishlistItems, removeFromWishlist } = useWishlist();

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]); // ⭐ NEW: Selected items

  // const shareUrl = `${window.location.origin}/wishlist`;

  /* -------------------- SELECT / UNSELECT ITEMS -------------------- */
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------------------- BUY NOW HANDLER ---------------------- */
  const handleBuyNow = () => {
    console.log("Selected Items to Buy:", selectedItems);
    // In future → redirect to checkout page
  };

  useEffect(() => {
    const loadWishlist=async()=>{
      try {
        axios.defaults.withCredentials=true
         const {data}=await  axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist`,        
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type":'application/json'
                    },
                    withCredentials: true,
                }
            );
            console.log(data)
            if(data.success){
              toast.success("Wishlist loaded")
              setWishlistItems(data.data.wishlist_items)
            }else{
              toast.error("Couldn't fetch wishlist")
            }
      } catch (error) {
          toast.error("Some error occurred")
          console.log(error)
      }
    }
   loadWishlist()
  }, [])
  
  return (
    <div className="bg-[#e5e2df] min-h-screen text-[#1a1a1a] pt-40 px-6 md:px-12 lg:px-20 pb-40 font-serif relative">
      {/* Page Header */}
      <section className="text-center mb-12">
        <h1 className="text-5xl md:text-5xl font-light tracking-wide text-[#1a1a1a]">
          MY WISHLIST
        </h1>

        <div className="w-full h-px bg-[#1a1a1a]/40 mt-6 mb-12"></div>
      </section>

      {/* Share Wishlist */}
      <div className="flex items-center gap-3 mb-12">
        <button
          onClick={() => setShowShareModal(true)}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#868686] shadow-md hover:shadow-lg transition"
        >
          <img
            src="assets/grp32.svg"
            alt="share"
            className="w-5 h-5 opacity-80"
          />
        </button>

        <span className="text-lg font-medium tracking-wide">
          Share your wishlist
        </span>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <p className="text-center text-gray-600 text-lg mt-20">
          Your wishlist is currently empty.
        </p>
      )}

      {/* Wishlist Grid */}
      {wishlistItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
          {wishlistItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center text-center"
              >
                {/* ⭐ Floating Checkbox */}
                <div className="absolute top-4 right-4 z-20">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-6 h-6 accent-[#2E4B45] cursor-pointer"
                  />
                </div>

                {/* Card */}
                <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
                  <img
                    src={item.product.image}
                    alt={item.name}
                    className="w-full h-56 object-cover rounded-xl"
                  />
                </div>

                {/* Name */}
                <h2 className="text-sm font-semibold mt-4 tracking-wide text-gray-800 uppercase">
                  {item.name}
                </h2>

                {/* Price */}
                <p className="text-gray-600 text-sm mt-1">{item.amount}</p>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="mt-3 px-5 py-2 text-sm rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------------- Sticky BUY NOW Button ----------------------- */}
      {wishlistItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#2E4B45] p-4 shadow-xl flex justify-center z-50">
          <button
            disabled={selectedItems.length === 0}
            onClick={handleBuyNow}
            className={`w-full max-w-lg py-3 rounded-full text-lg font-medium transition 
              ${
                selectedItems.length === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-white text-[#2E4B45] hover:bg-gray-100"
              }`}
          >
            Buy Now
          </button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 shadow-xl w-[90%] max-w-md text-center animate-fadeUp relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowShareModal(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-light mb-4">Share your wishlist</h2>

            <div className="border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-700 text-sm break-all">
              {shareUrl}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="w-full mt-4 py-2 rounded-full bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition"
            >
              Copy Link
            </button>

            {copied && (
              <p className="mt-2 text-sm text-green-600 font-medium animate-fadeIn">
                Link Copied!
              </p>
            )}

            <div className="flex items-center justify-center gap-5 mt-6">
              <a
                href={`https://api.whatsapp.com/send?text=Check out my wishlist: ${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center hover:opacity-90 transition"
              >
                <img
                  src="assets/whatsapp.svg"
                  alt="whatsapp"
                  className="w-6 h-6"
                />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:opacity-90 transition"
              >
                <img src="assets/x.svg" alt="x" className="w-6 h-6" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 transition"
              >
                <img
                  src="assets/facebook.svg"
                  alt="facebook"
                  className="w-6 h-6"
                />
              </a>

              <a
                href={`https://www.instagram.com/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-linear-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] flex items-center justify-center hover:opacity-90 transition"
              >
                <img
                  src="assets/instagram.svg"
                  alt="instagram"
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.35s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
