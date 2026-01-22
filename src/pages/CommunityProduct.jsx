import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PricingBreakdownModal from '../components/PriceBreakdown';

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


const CommunityProduct = ({handleOpenModal}) => {
    const {productId}= useParams()
    const navigate=useNavigate()
    const [customData, setCustomData] = useState({})
    const [selectedProductDetails, setSelectedProductDetails] = useState({});
    const [commentsList, setCommentsList] = useState([]);
    const { isLoggedIn } = useSelector((state) => state.user);
    const [showShare, setShowShare] = useState(false);
    const [rating, setRating] = useState(0);
    const [adding, setAdding] = useState(false)
    const [comment, setComment] = useState("");
    const [priceData, setPriceData] = useState({})
    const [showBreakdown, setShowBreakdown] = useState(false)
    
      // SHARE URL
    const shareUrl = `${window.location.origin}/product/${productId}`;


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
          metalType:selectedProductDetails.meta_data.metalType,
          stoneType:selectedProductDetails.meta_data.stoneType,
        });
      }
    }, [selectedProductDetails]);


    useEffect(() => {
         const loadProduct = async () => {
            try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/product/${productId}`,
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
             const { data:engagements } = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/product/${productId}/engagements`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
            console.log(engagements);
            setSelectedProductDetails(data.data.product);
            setCommentsList(engagements.data.comments.list)
            } catch (error) {
            toast.error("Couldn't fetch details");
            console.log(error);
            }
        };

        loadProduct()
        }, [])


           useEffect(() => {
        
              
          const getBreakdown = async () => {
                try {
                  axios.defaults.withCredentials = true;
                  const { data } = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/calculate/price`,
                    customData
                  );
        
                  if (data.success) {
                     setPriceData(data.data);            
                  }else{toast.error("Couldn't process your request")}
                } catch (error) {
                  console.log(error);
                }
              };
        
        
            if( Object.keys(customData)?.length === 0) return;
              // debounce
              const timer = setTimeout(() => {
                getBreakdown();
              }, 1000);
        
          
          return () => clearTimeout(timer);
        }, [customData]);
    
         const handleEngagement = async (type) => {
    try {
      axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/product/${selectedProductId}/engage`,
          {type,
            ...(type=="comment"?{comment}:{})
          },
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
          if(type=="like"){
            setSelectedProductDetails({
              ...selectedProductDetails,
              is_liked: data.data.liked,
              likes_count: data.data.likes_count,
            });}
            else if(type=="comment") {
              setCommentsList((prev) => [
                {
                  id: Date.now(),
                  comment: comment,
                  
                  user: { name: data?.data?.comment?.user?.name },
                  created_at: new Date(),
                },
                ...prev,
              ]);
              setComment("")

            }
        } else toast.error("Couldn't process request");
    
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    }
  };
            
        
            
            
                const handleAddToWishlist=async()=>{
                  setAdding(true)
                  try {
                    if(customData.totalCaratWeight<customData.centerStoneCarat){toast.error("Center stone weight cant be greater than total weight");return;}
                    axios.defaults.withCredentials=true
                    console.log(customData)
                    const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
                        {product_id:productId,
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
     <>
          <div className="inset-0 flex items-end md:items-center justify-center z-[50] pt-[72px] md:pt-0">
            {/* BACKDROP */}
          {showBreakdown && <PricingBreakdownModal setShowBreakdown={setShowBreakdown} breakdown={priceData}/>}

            {/* MODAL PANEL */}
            <div
              className="
          relative w-full max-w-7xl mx-auto
          h-[calc(100vh - 72px)] md:max-h-[85vh] overflow-y-auto
          no-scrollbar
          bg-[#E5E1DA] text-[#1a1a1a] font-serif
          border border-[#dcdcdc] shadow-2xl
          p-6 pt- md:p-10 md:pt-20 mt-0 mb-0
          z-[45] animate-slideUp
        "
            >
             

              {/* ===== GRID ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                {/* ================= TOP LEFT — CUSTOMIZABLE ================= */}
                <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
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
                              checked={(t==customData?.metalType)}
                              onChange={() => setCustomData((prev)=>({...prev,metalType:t}))}
                              className="w-5 h-5 accent-black"
                            />
                            <span className="mt-1 capitalize">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                    
                    </div>
                  </div>
                  {customData.metalType!="silver" &&<>
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
                              (customData?.goldKarat == k)
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
                  </>}

                  {/* RING SIZE */}
                  <h3 className="font-semibold tracking-wide mt-4 mb-3">
                    Ring Size
                  </h3>
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
                    {Array.from({ length: 21 }, (_, i) => 3 + i * 0.5).map(
                      (size) => (
                        <option key={size} value={size.toFixed(1)}>
                          {size.toFixed(1)}
                        </option>
                      )
                    )}
                  </select>

                  <h3 className="font-semibold tracking-wide mt-6 mb-3">
                    Stone Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                    <div>
                      <p className="text-sm mb-2">Type</p>

                      <div className="flex items-center gap-10">
                        {["diamond", "monzonite"].map((t) => (
                          <label
                            key={t}
                            className="flex flex-col items-center gap-2 text-xs tracking-wide cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={t}
                              name="stoneType"
                              checked={(t== customData?.stoneType) }
                              onChange={() => setCustomData((prev)=>({...prev,stoneType:t}))}
                              className="w-5 h-5 accent-black"
                            />
                            <span className="mt-1 capitalize">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                    
                    </div>
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
                    {customData?.stoneType!="monzonite" && <div>
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
                    </div>}
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
                    <div className="flex">

                    <p>Price: ${priceData?.totalPriceWithRoyalties}</p>
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

                {/* ================= TOP RIGHT ================= */}
                <div className="relative bg-white rounded-3xl shadow-md overflow-hidden group">
                  {/* IMAGE */}
                  <img
                    src={selectedProductDetails?.image}
                    className={`
                        w-full h-full object-cover
                        ${
                          isLoggedIn
                            ? "transition duration-300 group-hover:brightness-75"
                            : ""
                        } 
                      `}
                  />

                  {/* LIKE BUTTON — BOTTOM RIGHT */}
                  {isLoggedIn && (
                    <button
                      onClick={()=>handleEngagement("like")}
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={` lucide lucide-heart-icon lucide-heart transition ${
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
                    </button>
                  )}
                </div>

                {/* ================= BOTTOM LEFT — COMMENTS ================= */}
                <div className="bg-[#6C6C6C] rounded-3xl p-6 text-white h-[200px]">
                  <p className="tracking-widest text-sm mb-2">COMMENTS</p>

                  {!isLoggedIn && (
                    <p className="text-sm opacity-80">
                      Please{" "}
                      <span
                        onClick={() => {
                          handleOpenModal("login");
                        }}
                        className="underline cursor-pointer hover:text-blue-400"
                      >
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
                          onClick={()=>handleComment("comment")}
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
                    {/* <button className="w-12 h-12 bg-[#C3C3C3] rounded-full flex items-center justify-center hover:bg-[#b5b5b5]">
                      <img src="/assets/wishlist.svg" className="w-5 h-5" />
                    </button> */}
                    <button
                      onClick={() => {
                        navigate("/community")
                      }}
                        className={`cursor-pointer bg-[#6B6B6B] ml-auto px-12 py-3  text-white rounded-full text-xs tracking-widest`}

                    >
                        Browse More
                    </button>

                    <button
                      onClick={() => {
                        isLoggedIn
                          ? handleAddToWishlist()
                          : handleOpenModal("login");
                      }}
                      className={`${
                        adding
                          ? "bg-gray-600 cursor-not-allowed"
                          : "cursor-pointer bg-green-gradiant"
                      } ml-auto px-12 py-4  text-white rounded-full leading-[1.5] text-xs tracking-widest`}
                    >
                      {adding ? "Processing..." : "BUY NOW"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= COMMENTS LIST ================= */}
              <div className="mt-14 bg-white rounded-3xl p-8 shadow-md">
                <h3 className="text-lg font-semibold tracking-wide mb-6">
                  Community Reviews
                </h3>

                {commentsList.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No comments yet. Be the first to review this design.
                  </p>
                )}

                <div className="space-y-6">
                  {commentsList.map((c) => (
                    <div
                      key={c.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">
                          {c.user?.name || "Anonymous"}
                        </p>

                        <div className="flex text-yellow-400 text-sm">
                          {Array.from({ length: c.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {c.comment}
                      </p>

                      {c.created_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
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
            <div className="fixed text-black inset-0 z-[60] flex items-center justify-center">
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
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`http://localhost:5173/product/${productId}`)}`}
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
  )
}

export default CommunityProduct
