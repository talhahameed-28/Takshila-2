import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

export default function MyActivity() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.ceil(totalProducts / cardsPerPage);

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false)

  // MODAL STATE
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customData, setCustomData] = useState({});

  const [editingField, setEditingField] = useState(null);
  // possible values: "name" | "description" | null
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const nameRef = React.useRef(null);
  const descRef = React.useRef(null);

  // INIT CUSTOM DATA WHEN MODAL OPENS
  useEffect(() => {
    if (selectedProduct?.meta_data) {
      setCustomData({
        goldType: selectedProduct.meta_data.goldType,
        goldKarat: selectedProduct.meta_data.goldKarat,
        ringSize: selectedProduct.meta_data.ringSize,
        diamondShape: selectedProduct.meta_data.diamondShape,
        quality: selectedProduct.meta_data.quality,
        centerStoneCarat: selectedProduct.meta_data.centerStoneCarat,
        totalCaratWeight: selectedProduct.meta_data.totalCaratWeight,
        price:selectedProduct.price,
        commission:selectedProduct.meta_data.commission
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct) {
      setEditData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
      });
    }
  }, [selectedProduct]);

  const handleSaveEdit = async () => {
    if (!editData.name?.trim()) {
      toast.error("Product name cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/product/${selectedProduct.id}/update`,
        {
          name: editData.name,
          description: editData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data)
      if (data.success) {
        toast.success("Changes saved");

        setSelectedProduct((prev) => ({
          ...prev,
          name: editData.name,
          description: editData.description,
        }));

        setDesigns((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? { ...p, name: editData.name,description: editData.description } : p
          )
        );
      }
    } catch (e) {
      console.log(e)
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

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
        console.log(data)
        if (data.success) {
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


   useEffect(() => {

      
  const getBreakdown = async () => {
        try {
          axios.defaults.withCredentials = true;
          const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/calculate/price`,
            customData
          );

          if (data.success) {
             setCustomData(prev=>({...prev,commission:data.data.commission,price:data.data.totalPriceWithRoyalties}));            
          }else{toast.error("Couldn't process your request")}
        } catch (error) {
          console.log(error);
        }
      };


    if( Object.keys(customData).length === 0) return;
      // debounce
      const timer = setTimeout(() => {
        getBreakdown();
      }, 1000);

  
  return () => clearTimeout(timer);
}, [customData]);




  const handleCommunityStatus = async () => {
    setUploading(true);
    try {
      axios.defaults.withCredentials = true;

      if (selectedProduct.is_community_uploaded) {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/product/${
            selectedProduct.id
          }/remove`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        if (data.success) {
          setSelectedProduct({ ...selectedProduct, is_community_uploaded: 0 });
          toast.success("Product removed from community");
        } else toast.error("Couldn't process your request");
      } else {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/product/upload`,
          {
            product_id: selectedProduct.id,
            name: selectedProduct.name,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        if (data.success) {
          setSelectedProduct({ ...selectedProduct, is_community_uploaded: 1 });
          toast.success("Product added to community");
        } else toast.error("Couldn't process your request");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    } finally {
      setUploading(false);
    }
  };


  const handleAddToWishlist=async()=>{
        setAdding(true)
        try {
          if(customData.totalCaratWeight<customData.centerStoneCarat){toast.error("Center stone weight cant be greater than total weight");return;}
          axios.defaults.withCredentials=true
          console.log(customData)
          const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
              {product_id:selectedProduct.id,
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

        {/* Empty */}
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

        {/* Grid */}
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
      {selectedProduct && customData && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50] pt-[72px] md:pt-0">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-blurFade z-[40]"
            onClick={() => setSelectedProduct(null)}
          />

          <div
            className="
              relative w-full max-w-7xl mx-auto
              h-[calc(100vh-72px)] md:max-h-[85vh] overflow-y-auto
              rounded-t-3xl md:rounded-3xl
              bg-[#E5E1DA] text-[#1a1a1a] font-serif
              border border-[#dcdcdc] shadow-2xl
              p-6 md:p-10 mt-0 mb-0
              z-[45] animate-slideUp
            "
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-black/50 hover:text-black text-2xl"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {/* ========== CUSTOMIZATION PANEL ========== */}
              <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
                <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
                  Customizing Tools
                </h2>

                <h3 className="font-semibold tracking-wide mb-3">
                  Gold Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <p className="text-sm mt-4 mb-2">Ring Size</p>
                <select
                  value={customData.ringSize}
                  onChange={(e) =>
                    setCustomData((prev) => ({
                      ...prev,
                      ringSize: e.target.value,
                    }))
                  }
                  className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
                >
                  {Array.from({ length: 21 }, (_, i) => 3 + i * 0.5).map(
                    (size) => (
                      <option key={size} value={size.toFixed(1)}>
                        {size.toFixed(1)}
                      </option>
                    )
                  )}
                </select>

                <h3 className="font-semibold tracking-wide mt-6 mb-3">
                  Diamond Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 🔥 SHAPE DROPDOWN WITH ICONS HERE */}
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

                  <div>
                    <p className="text-sm mb-1">Quality</p>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      value={
                        customData.quality === "good"
                          ? 0
                          : customData.quality === "premium"
                          ? 1
                          : 2
                      }
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCustomData((prev) => ({
                          ...prev,
                          quality:
                            v === 0
                              ? "good"
                              : v === 1
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

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="text-sm mb-2">Center Stone Carat</p>
                    <input
                      type="number"
                      step="0.01"
                      value={customData.centerStoneCarat}
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
                      value={customData.totalCaratWeight}
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

                <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs mt-6">
                  <p>Price: ${customData.price}</p>
                  <p>
                    Commission: $
                    {customData.commission}
                  </p>
                </div>
              </div>

              {/* ========== IMAGE PANEL ========== */}
              <div className="relative bg-white rounded-3xl shadow-md overflow-hidden group">
                <img
                  src={selectedProduct.image}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>

              <div className="bg-[#6C6C6C] rounded-3xl p-6 text-white h-[200px]">
                <p className="tracking-widest text-sm mb-2">COMMENTS</p>
                <p className="text-xs opacity-70">
                  (Comments will be available soon in MyActivity modal)
                </p>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  {/* NAME */}
                  <div className="flex items-center gap-3">
                    {editingName ? (
                      <input
                        autoFocus
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-2xl font-semibold tracking-wide bg-transparent border-b border-gray-400 outline-none"
                        onBlur={() => setEditingName(false)}
                      />
                    ) : (
                      <h2 className="text-2xl font-semibold tracking-wide">
                        {editData.name}
                      </h2>
                    )}

                    <span
                      className="text-gray-400 text-lg cursor-pointer"
                      onClick={() => {
                        setEditingName(true);
                        setEditingDescription(false);
                      }}
                    >
                      ✎Edit name
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-4">
                    {editingDescription ? (
                      <textarea
                        autoFocus
                        value={editData.description}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full text-sm text-gray-600 leading-relaxed bg-transparent border border-gray-300 rounded-md p-2 outline-none resize-none"
                        rows={4}
                        onBlur={() => setEditingDescription(false)}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {editData.description}
                      </p>
                    )}

                    <span
                      className="text-gray-400 text-sm cursor-pointer mt-1 inline-block"
                      onClick={() => {
                        setEditingDescription(true);
                        setEditingName(false);
                      }}
                    >
                      ✎ Edit description
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <button
                    disabled={saving}
                    onClick={handleSaveEdit}
                    className={`px-12 py-3 rounded-full text-xs tracking-widest text-white ${
                      saving ? "bg-gray-400 cursor-not-allowed" : "bg-[#2E4B45] cursor-pointer"
                    }`}
                  >
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                  </button>

                  <button
                    disabled={uploading}
                    onClick={handleCommunityStatus}
                    className={`${
                      uploading
                        ? "bg-gradient-to-r from-red-900/50 via-rose-900/50 to-red-950/50 cursor-not-allowed opacity-70 shadow-none"
                        : "cursor-pointer"
                    } ml-auto px-12 py-3 ${
                      selectedProduct.is_community_uploaded
                        ? "bg-gradient-to-r from-red-800 via-rose-800 to-red-900"
                        : "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"
                    } text-white rounded-full text-xs tracking-widest`}
                  >
                    {selectedProduct.is_community_uploaded
                      ? "REMOVE FROM COMMUNITY"
                      : "UPLOAD TO COMMUNITY"}
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`${adding ? "bg-gray-400 cursor-not-allowed" : "bg-[#6B6B6B] cursor-pointer"} ml-auto px-12 py-3  text-white rounded-full text-xs tracking-widest`}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>

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
