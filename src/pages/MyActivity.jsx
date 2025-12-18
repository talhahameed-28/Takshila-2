import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyActivity() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.ceil(totalProducts / cardsPerPage);

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading,setUploading]=useState(false)

  // MODAL STATE
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ================== FETCH USER DESIGNS ==================
  useEffect(() => {
    const getMyDesigns = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/my-activity?per_page=12&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          console.log(data.data.products)
          setDesigns(data.data.products);
          setTotalProducts(data.data.pagination.total);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getMyDesigns();
  }, [currentPage]);


  const handleCommunityStatus=async()=>{
    setUploading(true)
    try {
      axios.defaults.withCredentials=true
      if(selectedProduct.is_community_uploaded){
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/${selectedProduct.id}/remove`,
          {},
          {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        console.log(data)
        if(data.success) {
          setSelectedProduct({...selectedProduct,is_community_uploaded:0})
          toast.success("Product removed from community")

        }
        else toast.error("Couldn't process your request")
      }else{
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/upload`,
          {
            product_id:selectedProduct.id,
            name:selectedProduct.name
          },
          {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        console.log(data)
        if(data.success) {
          setSelectedProduct({...selectedProduct,is_community_uploaded:1})
          toast.success("Product added to community")

        }
        else toast.error("Couldn't process your request")
      }
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred")
    }finally{
      setUploading(false)
    }
  }

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  return (
    <div className="bg-[#e5e2df] min-h-screen flex flex-col text-[#1a1a1a]">
      <main className="flex-grow pt-40 px-6 md:px-12 lg:px-20 pb-24 transition-all duration-500">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-5xl font-serif font-light tracking-wide text-[#1a1a1a]">
            MY ACTIVITY
          </h1>
          <div className="w-full max-w-4xl mx-auto border-t border-gray-400 mt-6"></div>
        </section>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 text-sm mt-10">
            Loading your designs...
          </p>
        )}

        {/* Empty State */}
        {!loading && designs.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-20 h-[40vh]">
            <h2 className="text-2xl font-medium text-gray-700 mb-6">
              No Designs Yet
            </h2>

            <button
              onClick={() => navigate("/design-studio")}
              className="px-10 py-4 bg-[#555555] hover:bg-[#000000] text-white rounded-full text-sm shadow-sm transition cursor-pointer"
            >
              Add Some Designs
            </button>
          </div>
        )}

        {/* Designs Grid */}
        {designs.length > 0 && (
          <section>
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

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
              {designs.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    onClick={() => setSelectedProduct(item)}
                    className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover rounded-xl"
                    />
                  </div>

                  <h2 className="text-sm font-semibold mt-4 tracking-wide text-gray-800 uppercase">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">${item.price}</p>

                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ======================= MODAL ========================== */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50]">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-blurFade z-[40]"
            onClick={() => setSelectedProduct(null)}
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
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-black/50 hover:text-black text-2xl"
            >
              ✕
            </button>

            {/* ===== GRID ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {/* ================= LEFT TOP ================= */}
              <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
                <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
                  Customizing Tools
                </h2>

                <h3 className="font-semibold tracking-wide mb-3">
                  Gold Options
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm mb-2">Type</p>
                    <div className="flex gap-10 text-xs capitalize">
                      {[selectedProduct.meta_data.goldType].map((t) => (
                        <span key={t}>● {t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-2">Karat</p>
                    <div className="flex gap-10 text-xs">
                      {[selectedProduct.meta_data.goldKarat].map((k) => (
                        <span key={k}>● {k}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm mt-4 mb-2">Ring Size</p>
                <div className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full flex items-center">
                  {selectedProduct.meta_data.ringSize}
                </div>

                <h3 className="font-semibold tracking-wide mt-6 mb-3">
                  Diamond Options
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm mb-2">Shape</p>
                    <div className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full flex items-center">
                      {selectedProduct.meta_data.diamondShape}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-1">Quality</p>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      disabled
                      value={
                        selectedProduct.meta_data.quality === "good"
                          ? 0
                          : selectedProduct.meta_data.quality === "premium"
                          ? 1
                          : 2
                      }
                      className="w-full opacity-70"
                    />
                    <div className="grid grid-cols-3 text-center text-xs mt-1">
                      <span>Good</span>
                      <span>Premium</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="text-sm mb-2">Center Stone Carat</p>
                    <div className="bg-[#D9D9D9] text-black h-11 px-4 rounded-full flex items-center">
                      {selectedProduct.meta_data.centerStoneCarat}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-2">Total Carat Weight</p>
                    <div className="bg-[#D9D9D9] text-black h-11 px-4 rounded-full flex items-center">
                      {selectedProduct.meta_data.totalCaratWeight}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs mt-6">
                  <p>Price: ${selectedProduct.price}</p>
                  <p>
                    Commission: $
                    {selectedProduct.meta_data.commission ||
                      selectedProduct.meta_data.Commission}
                  </p>
                </div>
              </div>

              {/* ================= RIGHT IMAGE ================= */}
              <div className="relative bg-white rounded-3xl shadow-md overflow-hidden group">
                <img
                  src={selectedProduct.image}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>

              {/* ================= BOTTOM LEFT — COMMENTS PLACEHOLDER ================= */}
              <div className="bg-[#6C6C6C] rounded-3xl p-6 text-white h-[200px]">
                <p className="tracking-widest text-sm mb-2">COMMENTS</p>
                <p className="text-xs opacity-70">
                  (Comments will be available soon in MyActivity modal)
                </p>
              </div>

              {/* ================= BOTTOM RIGHT — DETAILS ================= */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-wide">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <button
                    disabled={uploading}
                    onClick={handleCommunityStatus}
                    className={`${uploading?"bg-gradient-to-r from-red-900/50 via-rose-900/50 to-red-950/50 cursor-not-allowed opacity-70 shadow-none":"cursor-pointer"} ml-auto px-12 py-3 ${selectedProduct.is_community_uploaded?"bg-gradient-to-r from-red-800 via-rose-800 to-red-900":"bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"} text-white rounded-full text-xs tracking-widest`}
                  >
                    {selectedProduct.is_community_uploaded?"REMOVE FROM COMMUNITY":"UPLOAD TO COMMUNITY"}
                  </button>
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="ml-auto px-12 py-3 bg-[#6B6B6B] text-white rounded-full text-xs tracking-widest"
                  >
                    BUY NOW
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
      )}
    </div>
  );
}
