import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PricingBreakdownModal from "../components/PriceBreakdown";

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
const ShapeDropdown = ({ value, onChange, readOnly }) => {
  const [open, setOpen] = useState(false);
  const selected = DIAMOND_SHAPES.find((s) => s.name === value);

  return (
    <div className="relative w-52">
      <button
        disabled={readOnly}
        type="button"
        onClick={() => !readOnly && setOpen(!open)}
        className={`bg-[#D9D9D9] text-black w-full h-11 px-4 rounded-full flex items-center justify-between ${
          readOnly ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {selected && (
            <img src={selected.icon} alt={value} className="w-5 h-5" />
          )}
          <span className="text-sm">{value}</span>
        </div>
        <span className="text-gray-500 text-xs">▼</span>
      </button>

      {open && !readOnly && (
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
              <img src={shape.icon} className="w-5 h-5" />
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

  // ========== LIST DATA ==========
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.ceil(totalProducts / cardsPerPage);

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========== MODAL STATES ==========
  const [selectedProduct, setSelectedProduct] = useState(null);

  // VIEW MODAL
  const [isViewModal, setIsViewModal] = useState(false);

  // EDIT MODAL
  const [isEditModal, setIsEditModal] = useState(false);

  // CUSTOM DATA (shared)
  const [customData, setCustomData] = useState({});
  const [priceData, setPriceData] = useState({});
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [editData, setEditData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [newImages, setNewImages] = useState([]); // For edit modal

  const [menuOpenId, setMenuOpenId] = useState(null);

  // ================= INIT CUSTOM DATA WHEN MODAL OPENS =================
  useEffect(() => {
    if (selectedProduct?.meta_data) {
      setCustomData({
        metalType: selectedProduct.meta_data.metalType,
        stoneType: selectedProduct.meta_data.stoneType,
        goldType: selectedProduct.meta_data.goldType,
        goldKarat: selectedProduct.meta_data.goldKarat,
        ringSize: selectedProduct.meta_data.ringSize,
        diamondShape: selectedProduct.meta_data.diamondShape,
        quality: selectedProduct.meta_data.quality,
        centerStoneCarat: selectedProduct.meta_data.centerStoneCarat,
        totalCaratWeight: selectedProduct.meta_data.totalCaratWeight,
      });

      setEditData({
        name: selectedProduct.name,
        description: selectedProduct.description,
      });
    }
  }, [selectedProduct]);

  // ================= PRICE UPDATE =================
  useEffect(() => {
    if (!selectedProduct || !customData) return;

    const getBreakdown = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/calculate/price`,
          customData,
        );

        if (data.success) setPriceData(data.data);
        else toast.error("Couldn't process your request");
      } catch (e) {
        console.log(e);
      }
    };

    const timer = setTimeout(() => getBreakdown(), 300);
    return () => clearTimeout(timer);
  }, [customData]);

  // ================== FETCH USER DESIGNS ==================
  useEffect(() => {
    const getMyDesigns = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/my-activity?per_page=12&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        console.log(data)
        if (data.success) {
          setDesigns(data.data.products);
          setTotalProducts(data.data.pagination.total);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    getMyDesigns();
  }, [currentPage]);

  // ================= REMOVE DESIGN =================
  // const handleRemoveDesign = async (productId) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to remove this design?",
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     axios.defaults.withCredentials = true;

  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/product/`,
            // {},
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       },
  //     );

  //     if (data.success) {
  //       toast.success("Design removed");
  //       setDesigns((prev) => prev.filter((d) => d.id !== productId));
  //     } else {
  //       toast.error("Could not remove design");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Deletion failed");
  //   }
  // };

  // ================= COMMUNITY HANDLER =================
  const handleCommunityStatus = async () => {
    setUploading(true);
    try {
      axios.defaults.withCredentials = true;

      if (selectedProduct.is_community_uploaded) {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/product/${selectedProduct.id}/remove`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (data.success) {
          setSelectedProduct({ ...selectedProduct, is_community_uploaded: 0 });
          toast.success("Product removed from community");
        }
      } else {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/product/upload`,
          { product_id: selectedProduct.id, name: selectedProduct.name },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (data.success) {
          setSelectedProduct({ ...selectedProduct, is_community_uploaded: 1 });
          toast.success("Product added to community");
        }
      }
    } catch (err) {
      toast.error("Error in processing");
    } finally {
      setUploading(false);
    }
  };

  // ================= ADD TO WISHLIST =================
  const handleAddToWishlist = async () => {
    setAdding(true);
    try {
      if (customData.totalCaratWeight < customData.centerStoneCarat) {
        toast.error("Center stone can't be greater than total carat");
        return;
      }

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
        { product_id: selectedProduct.id, ...customData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (data.success) {
        toast.success("Proceeding to checkout");
        navigate("/checkout");
      }
    } catch (error) {
      toast.error("Some error occurred");
    } finally {
      setAdding(false);
    }
  };

  // ================= SAVE EDIT CHANGES =================
  const handleSaveEdit = async () => {
    if (!editData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);

    try {
      axios.defaults.withCredentials = true;
      let formData=new FormData()
      console.log(newImages)
      if (newImages.length > 0) {
        newImages.forEach((file)=>formData.append("images",file));
      }
      // UPDATE NAME + DESC + ATTRIBUTES
      // const { data } = await axios.put(
      //   `${import.meta.env.VITE_BASE_URL}/api/product/${selectedProduct.id}/update`,
      //   {
      //     name: editData.name,
      //     description: editData.description,
      //     ...(customData),
      //     ...(newImages.length>0?formData:{})
      //   },
      //   {
      //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
      //               },
      //             withCredentials: true,
      //   },
      // );
      formData.append("name",editData.name)
      

      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/product/${selectedProduct.id}/update`,
        
          {name:editData.name,...formData}
        ,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  withCredentials: true,
        },
      );
      console.log(data)
      if (!data.success) {
        toast.error("Update failed");
        return;
      }

      toast.success("Changes saved");

      // Update list
      setDesigns((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? { ...p,meta_data:customData, name: editData.name, description: editData.description }
            : p,
        ),
      );

      // Update selected product
      setSelectedProduct((prev) => ({
        ...prev,
        name: editData.name,
        description: editData.description,
        meta_data: { ...customData },
      }));

      // UPLOAD IMAGES IF NEW ONES WERE ADDED
      // if (newImages.length > 0) {
      //   const formData = new FormData();
      //   newImages.forEach((file) => formData.append("images", file));

      //   await axios.post(
      //     `${import.meta.env.VITE_BASE_URL}/api/product/${selectedProduct.id}/upload-images`,
      //     formData,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       },
      //     },
      //   );

      //   toast.success("Images updated");
      // }

      setIsEditModal(false);
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ================= IMAGE SLIDES =================
  const prevSlide = () => {
    if (!selectedProduct) return;
    setCurrentIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1,
    );
  };

  const nextSlide = () => {
    if (!selectedProduct) return;
    setCurrentIndex((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1,
    );
  };

  // ================= PAGINATION =================
  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  // ================= CLOSE MODALS =================
  const closeModals = () => {
    setSelectedProduct(null);
    setIsViewModal(false);
    setIsEditModal(false);
    setCurrentIndex(0);
  };

  return (
    <>
      <div className="bg-[#e5e2df] min-h-screen flex flex-col text-[#1a1a1a]">
        <main className="flex-grow pt-40 px-6 md:px-12 lg:px-20 pb-24">
          {/* HEADER */}
          <section className="text-center mb-12">
            <h1 className="text-5xl font-serif font-light">MY ACTIVITY</h1>
            <div className="w-full max-w-4xl mx-auto border-t border-gray-400 mt-6" />
          </section>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-500">Loading your designs...</p>
          )}

          {/* EMPTY */}
          {!loading && designs.length === 0 && (
            <div className="flex flex-col items-center mt-20 h-[40vh]">
              <h2 className="text-2xl text-gray-700 mb-6">No Designs Yet</h2>
              <button
                onClick={() => navigate("/design-studio")}
                className="px-10 py-4 bg-[#555] text-white rounded-full"
              >
                Add Some Designs
              </button>
            </div>
          )}

          {/* GRID */}
          {designs.length > 0 && (
            <section>
              {/* PAGINATION */}
              <div className="flex justify-center items-center gap-3 mb-14">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === 1 ? "text-gray-400" : "hover:text-[#2E4B45]"
                  }`}
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p + 1)}
                    className={`w-9 h-9 rounded-full ${
                      currentPage === p + 1
                        ? "bg-[#2E4B45] text-white"
                        : "bg-white hover:bg-[#d8d6d3]"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === totalPages
                      ? "text-gray-400"
                      : "hover:text-[#2E4B45]"
                  }`}
                >
                  &gt;
                </button>
              </div>

              {/* DESIGN CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                {designs.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-2xl shadow-md p-4"
                  >
                    {/* THREE DOTS MENU */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === item.id ? null : item.id);
                      }}
                      className="absolute top-1 right-1 text-2xl"
                    >
                      ⋮
                    </button>

                    {/* DROPDOWN */}
                    {menuOpenId === item.id && (
                      <div className="absolute top-10 right-3 bg-white shadow-lg rounded-xl w-28 py-2 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(item);
                            setIsEditModal(true);
                            setIsViewModal(false);
                            setMenuOpenId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDesign(item.id);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* OPEN VIEW MODAL */}
                    <div
                      onClick={() => {
                        setSelectedProduct(item);
                        setIsViewModal(true);
                        setIsEditModal(false);
                      }}
                    >
                      <img
                        src={item.image}
                        className="w-full h-56 object-cover rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        {/* ======================= VIEW MODAL (READ ONLY) ========================== */}
        {selectedProduct && isViewModal && (
          <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50] pt-10">
            {showBreakdown && (
              <PricingBreakdownModal
                breakdown={priceData}
                setShowBreakdown={setShowBreakdown}
              />
            )}

            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={closeModals}
            />

            {/* MAIN MODAL */}
            <div className="relative w-full max-w-7xl mx-auto h-[calc(100vh-100px)] md:max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-[#E5E1DA] border shadow-2xl p-6 md:p-10 z-[60]">
              {/* CLOSE BUTTON */}
              <button
                onClick={closeModals}
                className="absolute top-4 right-4 text-black/50 hover:text-black text-2xl"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ================= LEFT — CUSTOMIZATION PANEL (READ ONLY) ================= */}
                <div className="order-2 lg:order-1">
                  <div className="lg:sticky lg:top-10">
                    <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
                      <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
                        Customizing Tools
                      </h2>

                      {/* ============ FREEZE ALL FIELDS HERE ============ */}
                      {(() => {
                        const readOnly = true;

                        return (
                          
                            <>
                              {/* METAL TYPE */}
                              <h3 className="font-semibold mb-3">Metal type</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                                <div>
                                  <p className="text-sm mb-2">Type</p>
                                  <div className="flex items-center gap-10">
                                    {["gold", "silver"].map((t) => (
                                      <label
                                        key={t}
                                        className="flex flex-col items-center gap-2 text-xs cursor-pointer"
                                      >
                                        <input
                                          type="radio"
                                          value={t}
                                          checked={t === customData.metalType}
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
                              </div>

                              {/* GOLD OPTIONS */}
                              {customData.metalType !== "silver" && (
                                <>
                                  <h3 className="font-semibold mt-4 mb-3">Gold Options</h3>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* GOLD TYPE */}
                                    <div>
                                      <p className="text-sm mb-2">Type</p>
                                      <div className="flex gap-3 text-xs">
                                        {["rose", "yellow", "white"].map((t) => (
                                          <button
                                            key={t}
                                            onClick={() =>
                                              setCustomData((prev) => ({ ...prev, goldType: t }))
                                            }
                                            className={`px-3 py-1 rounded-full ${
                                              customData.goldType === t
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
                                              setCustomData((prev) => ({ ...prev, goldKarat: k }))
                                            }
                                            className={`px-3 py-1 rounded-full ${
                                              customData.goldKarat === k
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
                              <h3 className="font-semibold tracking-wide mt-6 mb-3">Ring Size</h3>
                              <select
                                value={customData.ringSize}
                                onChange={(e) =>
                                  setCustomData((prev) => ({ ...prev, ringSize: e.target.value }))
                                }
                                className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
                              >
                                {Array.from({ length: 21 }, (_, i) => 3 + i * 0.5).map((size) => (
                                  <option key={size} value={size.toFixed(1)}>
                                    {size.toFixed(1)}
                                  </option>
                                ))}
                              </select>

                              {/* STONE OPTIONS */}
                              <h3 className="font-semibold tracking-wide mt-6 mb-3">Stone Options</h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                                <div>
                                  <p className="text-sm mb-2">Type</p>

                                  <div className="flex items-center gap-10">
                                    {["diamond", "moissanite"].map((t) => (
                                      <label key={t} className="flex flex-col items-center gap-2 text-xs">
                                        <input
                                          type="radio"
                                          value={t}
                                          checked={t === customData.stoneType}
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
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* SHAPE */}
                                <div>
                                  <p className="text-sm mb-2">Shape</p>
                                  <ShapeDropdown
                                    value={customData.diamondShape}
                                    onChange={(val) =>
                                      setCustomData((prev) => ({ ...prev, diamondShape: val }))
                                    }
                                    readOnly={false}
                                  />
                                </div>

                                {/* QUALITY */}
                                {customData.stoneType !== "moissanite" && (
                                  <div>
                                    <p className="text-sm mb-2">Quality</p>
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
                                        const val = Number(e.target.value);
                                        setCustomData((prev) => ({
                                          ...prev,
                                          quality:
                                            val === 0 ? "good" : val === 1 ? "premium" : "excellent",
                                        }));
                                      }}
                                      className="w-full cursor-pointer"
                                    />
                                    <div className="grid grid-cols-3 text-center text-xs mt-1">
                                      <span>Good</span>
                                      <span>Premium</span>
                                      <span>Excellent</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* CARATS */}
                              <div className="grid grid-cols-1 gap-2 mt-4">
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

                              {/* PRICE */}
                              <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs mt-6">
                                <div className="flex">
                                  <p>Price: ${priceData.totalPriceWithRoyalties}</p>
                                  <button
                                    onClick={() => setShowBreakdown(true)}
                                    className="ml-2 w-4 h-4 bg-black text-white rounded-full text-[10px]"
                                  >
                                    i
                                  </button>
                                </div>
                                <p>Commission: ${priceData.commission}</p>
                              </div>
                            </>

                        );
                      })()}
                    </div>
                    {/* BUY NOW (ONLY IN VIEW MODE) */}
                    <div className="pt-2 pb-10">
                      <button
                        onClick={handleAddToWishlist}
                        className="block md:hidden bg-green-gradiant ml-auto px-4 py-4 w-full text-white rounded-full text-xs tracking-widest"
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT — PRODUCT DETAILS ================= */}
                <div className="order-1 lg:order-2 space-y-8">
                  {/* IMAGES */}
                  <div className="relative bg-white rounded-3xl shadow-md overflow-hidden">
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                        >
                          ▶
                        </button>
                      </>
                    )}
                    <img
                      src={selectedProduct.images[currentIndex]}
                      className="w-full h-[420px] object-cover"
                    />
                  </div>

                  {/* NAME + DESCRIPTION */}
                  <div>
                    <h2 className="text-2xl tracking-wide font-semibold">
                      {selectedProduct.name}
                    </h2>

                    <p className="text-sm text-gray-600 mt-4">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-4 grid-cols-3 gap-1">
                      {/* <button
                        onClick={() => {
                          setIsViewModal(false);
                          setIsEditModal(true);
                        }}
                        className="px-5 py-3 w-full rounded-full text-xs tracking-widest text-white bg-[#6B6B6B] hover:bg-[#2E4B45]"
                      >
                        EDIT
                      </button> */}

                      <button
                        disabled={uploading}
                        onClick={handleCommunityStatus}
                        className={`px-10 py-4 col-span-2 text-white rounded-full text-xs tracking-widest ${
                          selectedProduct.is_community_uploaded
                            ? "bg-gradient-to-r from-red-800 to-red-900"
                            : "bg-gradient-to-r from-emerald-500 to-green-600"
                        }`}
                      >
                        {selectedProduct.is_community_uploaded
                          ? "REMOVE FROM COMMUNITY"
                          : "POST ON COMMUNITY"}
                      </button>

                      <button
                        onClick={handleAddToWishlist}
                        className="hidden md:block bg-green-gradiant ml-auto px-4 py-4 w-full text-white rounded-full text-xs tracking-widest"
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= EDIT MODAL (FULLY EDITABLE) ========================== */}
        {selectedProduct && isEditModal && (
          <div className="fixed inset-0 flex items-end md:items-center justify-center z-[70] pt-10">
             {showBreakdown && (
              <PricingBreakdownModal
                breakdown={priceData}
                setShowBreakdown={setShowBreakdown}
              />
            )}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={closeModals}
            />

            <div className="relative w-full max-w-7xl mx-auto h-[calc(100vh-100px)] md:max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-[#E5E1DA] border shadow-2xl p-6 md:p-10 z-[80]">
              {/* CLOSE BUTTON */}
              <button
                onClick={closeModals}
                className="absolute top-4 right-4 text-black/50 hover:text-black text-2xl"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ================= LEFT — CUSTOMIZATION PANEL (EDITABLE) ================= */}
                <div className="order-2 lg:order-1">
                  <div className="lg:sticky lg:top-10">
                    <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
                      <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
                        Editing Tools
                      </h2>

                      {(() => {
                        const readOnly = false;

                        return (
                          <>
                            {/* METAL TYPE */}
                            <h3 className="font-semibold mb-3">Metal type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                              <div>
                                <p className="text-sm mb-2">Type</p>
                                <div className="flex items-center gap-10">
                                  {["gold", "silver"].map((t) => (
                                    <label
                                      key={t}
                                      className="flex flex-col items-center gap-2 text-xs cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        value={t}
                                        checked={t === customData.metalType}
                                        onChange={() =>
                                          setCustomData((prev) => ({
                                            ...prev,
                                            metalType: t,
                                          }))
                                        }
                                        className="w-5 h-5 accent-black"
                                      />
                                      <span className="mt-1 capitalize">
                                        {t}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* GOLD OPTIONS */}
                            {customData.metalType !== "silver" && (
                              <>
                                <h3 className="font-semibold mt-4 mb-3">
                                  Gold Options
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* GOLD TYPE */}
                                  <div>
                                    <p className="text-sm mb-2">Type</p>
                                    <div className="flex gap-3 text-xs">
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
                                            customData.goldType === t
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
                                            customData.goldKarat === k
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
                            <h3 className="font-semibold tracking-wide mt-6 mb-3">
                              Ring Size
                            </h3>
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
                              {Array.from(
                                { length: 21 },
                                (_, i) => 3 + i * 0.5,
                              ).map((size) => (
                                <option key={size} value={size.toFixed(1)}>
                                  {size.toFixed(1)}
                                </option>
                              ))}
                            </select>

                            {/* STONE OPTIONS */}
                            <h3 className="font-semibold tracking-wide mt-6 mb-3">
                              Stone Options
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                              <div>
                                <p className="text-sm mb-2">Type</p>

                                <div className="flex items-center gap-10">
                                  {["diamond", "moissanite"].map((t) => (
                                    <label
                                      key={t}
                                      className="flex flex-col items-center gap-2 text-xs cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        value={t}
                                        checked={t === customData.stoneType}
                                        onChange={() =>
                                          setCustomData((prev) => ({
                                            ...prev,
                                            stoneType: t,
                                          }))
                                        }
                                        className="w-5 h-5 accent-black"
                                      />
                                      <span className="mt-1 capitalize">
                                        {t}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* SHAPE */}
                              <div>
                                <p className="text-sm mb-2">Shape</p>
                                <ShapeDropdown
                                  value={customData.diamondShape}
                                  onChange={(val) =>
                                    setCustomData((prev) => ({
                                      ...prev,
                                      diamondShape: val,
                                    }))
                                  }
                                  readOnly={false}
                                />
                              </div>

                              {/* QUALITY */}
                              {customData.stoneType !== "moissanite" && (
                                <div>
                                  <p className="text-sm mb-2">Quality</p>
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
                                    className="w-full cursor-pointer"
                                  />
                                  <div className="grid grid-cols-3 text-center text-xs mt-1">
                                    <span>Good</span>
                                    <span>Premium</span>
                                    <span>Excellent</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* CARATS */}
                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <p className="text-sm mb-2">
                                  Center Stone Carat
                                </p>
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
                                <p className="text-sm mb-2">
                                  Total Carat Weight
                                </p>
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

                            {/* PRICE */}
                            <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs mt-6">
                              <div className="flex">
                                <p>
                                  Price: ${priceData.totalPriceWithRoyalties}
                                </p>
                                <button
                                  onClick={() => setShowBreakdown(true)}
                                  className="ml-2 w-4 h-4 bg-black text-white rounded-full text-[10px]"
                                >
                                  i
                                </button>
                              </div>
                              <p>Commission: ${priceData.commission}</p>
                            </div>

                            {/* IMAGE UPLOAD */}
                            <div className="mt-6">
                              <p className="font-semibold mb-3">Add Images</p>

                              {/* IMAGE PREVIEW GRID */}
                              {newImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                                  {newImages.map((file, index) => {
                                    const imageURL = URL.createObjectURL(file);
                                    return (
                                      <div
                                        key={index}
                                        className="relative group"
                                      >
                                        <img
                                          src={imageURL}
                                          className="w-full h-24 object-cover rounded-xl border border-white/20"
                                        />

                                        {/* REMOVE BUTTON */}
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setNewImages((prev) =>
                                              prev.filter(
                                                (_, i) => i !== index,
                                              ),
                                            );
                                          }}
                                          className="absolute -top-2 -right-2 bg-black/70 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-90"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Hidden file input */}
                              <input
                                id="imageUploader"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                  setNewImages(Array.from(e.target.files))
                                }
                                className="hidden"
                              />

                              {/* Upload Box */}
                              <label
                                htmlFor="imageUploader"
                                className="flex flex-col items-center justify-center w-full h-32 bg-white/20 border border-white/30 rounded-2xl cursor-pointer hover:bg-white/30 transition text-white"
                              >
                                <span className="text-4xl font-light">+</span>
                                <span className="text-xs mt-1 tracking-wide opacity-80">
                                  Tap to upload images
                                </span>
                              </label>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* MOBILE SAVE BUTTON */}
                    <div className="pt-2 pb-10">
                      <button
                        disabled={saving}
                        onClick={handleSaveEdit}
                        className="block md:hidden bg-[#2E4B45] ml-auto px-4 py-4 w-full text-white rounded-full text-xs tracking-widest"
                      >
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT — NAME, DESCRIPTION & IMAGES ================= */}
                <div className="order-1 lg:order-2 space-y-8">
                  {/* IMAGE PREVIEW (existing images) */}
                  <div className="relative bg-white rounded-3xl shadow-md overflow-hidden">
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                        >
                          ▶
                        </button>
                      </>
                    )}
                    <img
                      src={selectedProduct.images[currentIndex]}
                      className="w-full h-[420px] object-cover"
                    />
                  </div>

                  {/* EDIT NAME */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Name</h3>
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg p-3"
                    />
                  </div>

                  {/* EDIT DESCRIPTION */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <textarea
                      rows={4}
                      value={editData.description}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg p-3"
                    />
                  </div>

                  {/* DESKTOP SAVE BUTTON */}
                  <button
                    disabled={saving}
                    onClick={handleSaveEdit}
                    className="hidden md:block w-full bg-[#2E4B45] text-white rounded-full px-6 py-4 text-xs tracking-widest"
                  >
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

     
      </div>
    </>
  );
}
