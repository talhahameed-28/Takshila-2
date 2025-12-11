import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DesignStudio() {
  const navigate=useNavigate()
  // ACTIVE TAB
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "upload"

  // -----------------------------------
  // AI DESIGNER STATES
  // -----------------------------------
  const [aiGoldType, setAiGoldType] = useState("rose");
  const [aiKarat, setAiKarat] = useState("10K");
  const [aiRingSize, setAiRingSize] = useState(3);
  const [aiShape, setAiShape] = useState("Round");
  const [aiQuality, setAiQuality] = useState("good");
  const [aiCenterCarat, setAiCenterCarat] = useState(0.5);
  const [aiTotalCarat, setAiTotalCarat] = useState(1.0);
  const [aiPrice, setAiPrice] = useState(2186.33);
  const [aiCommission, setAiCommission] = useState(76.52);
  const [aiPreviewimage, setAiPreviewimage] = useState(null)
  const [loadingDesign, setLoadingDesign] = useState(false)
  const promptRef=useRef()
  // -----------------------------------
  // UPLOAD MODE STATES
  // -----------------------------------
  const [upGoldType, setUpGoldType] = useState("rose");
  const [upKarat, setUpKarat] = useState("10K");
  const [upRingSize, setUpRingSize] = useState(3);
  const [upShape, setUpShape] = useState("Round");
  const [upQuality, setUpQuality] = useState("good");
  const [upCenterCarat, setUpCenterCarat] = useState(0.5);
  const [upTotalCarat, setUpTotalCarat] = useState(1.0);
  const [upPrice, setUpPrice] = useState(2186.33);
  const [upCommission, setUpCommission] = useState(76.52);
  const [upPreviewImage,setUpPreviewImage]= useState(null)
  const uploadRef = useRef()
  // -----------------------------------
  // PRICE BREAKDOWN POPUP
  // -----------------------------------
  const [showBreakdown, setShowBreakdown] = useState(false);

  // -----------------------------------
  // PRICE CALCULATOR
  // -----------------------------------
  const calculatePrice = (mode) => {
    let base = 2000;

    const gold = mode === "ai" ? aiGoldType : upGoldType;
    const karat = mode === "ai" ? aiKarat : upKarat;
    const shape = mode === "ai" ? aiShape : upShape;
    const quality = mode === "ai" ? aiQuality : upQuality;
    const centerCarat = mode === "ai" ? aiCenterCarat : upCenterCarat;
    const totalCarat = mode === "ai" ? aiTotalCarat : upTotalCarat;

    if (gold === "rose") base += 50;
    if (gold === "yellow") base += 30;
    if (gold === "white") base += 70;

    if (karat === "10K") base += 20;
    if (karat === "14K") base += 40;
    if (karat === "18K") base += 80;

    if (shape === "oval") base += 100;
    if (shape === "princess") base += 150;

    if (quality === "good") base += 20;
    if (quality === "premium") base += 60;
    if (quality === "excellent") base += 120;

    base += (Number(centerCarat) || 0) * 200;
    base += (Number(totalCarat) || 0) * 150;

    if (mode === "ai") {
      setAiPrice(base);
      setAiCommission((base * 0.035).toFixed(2));
    } else {
      setUpPrice(base);
      setUpCommission((base * 0.035).toFixed(2));
    }
  };

  useEffect(() => {
    calculatePrice("ai");
  }, [aiGoldType, aiKarat, aiShape, aiQuality, aiCenterCarat, aiTotalCarat]);

  useEffect(() => {
    calculatePrice("upload");
  }, [upGoldType, upKarat, upShape, upQuality, upCenterCarat, upTotalCarat]);

  const handleClick = () => uploadRef.current.click();

  const handleChange=(e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local preview URL
    const imageUrl = URL.createObjectURL(file);
    setUpPreviewImage(imageUrl);
  };

  const handleMyDesignUpload=async(e)=>{
    try { 
      e.preventDefault()
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      axios.defaults.withCredentials=true
      const calculatedPrice=upPrice+upCommission
      const total=values.royalties + calculatedPrice
      // values.images=[values.images]
      const {centerStoneCarat,
              description,
              diamondShape,
              goldKarat,
              goldType,
              images,
              name,
              quality,
              ringSize,
              royalties,
              totalCaratWeight,}=values
      console.log(values)
      const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/product/post-design`,
        {name,description,price:total,images,
          meta_data:{
            centerStoneCarat,
            diamondShape,
            goldKarat,
            goldType,
            quality,
            ringSize,
            royalties,
            totalCaratWeight
          }
          
        },
      {headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
    },withCredentials: true})
      console.log(data)
      if(data.success){
        toast.success("Design added to community!")
        navigate("/community")
      }
    } catch (error) {
      console.log(error)
      
    }
  }

  const generateAiImage=async(goldType,karat,ringSize,shape,quality,centerCarat,totalCarat,price,commission)=>{
    console.log(goldType,karat,ringSize,shape,quality,centerCarat,totalCarat,price,commission)
    try {
      setLoadingDesign(true)
      console.log(typeof(promptRef.current.value))
      axios.defaults.withCredentials=true
      console.log(promptRef.current.value)
      const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/generate/image`,
        {goldType,
          goldKarat:karat,
          diamondShape:shape,
          quality,
          centerStoneCarat:centerCarat,
          totalCaratWeight:totalCarat,
          ringDesign:promptRef.current.value?promptRef.current.value:"none",
          ringSize,
          price,
          commission
        },
      {headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
    },withCredentials: true})
    console.log(data)
    if(data.success){
      setAiPreviewimage(data.data.product.image)
      

      toast.success("Image generated successfully")
    }else{
      toast.error(data.message)
    }
    } catch (error) {
        console.log(error)
    }finally{
      setLoadingDesign(false)
    }
  }

  const handleAiDesignUpload=async()=>{
    
  }


  // -----------------------------------
  // HELPERS FOR PRICE BREAKDOWN POPUP
  // -----------------------------------
  const getActiveValues = () => {
    if (activeTab === "ai") {
      return {
        gold: aiGoldType,
        karat: aiKarat,
        shape: aiShape,
        quality: aiQuality,
        centerCarat: aiCenterCarat,
        totalCarat: aiTotalCarat,
        price: aiPrice,
        commission: aiCommission,
      };
    }
    return {
      gold: upGoldType,
      karat: upKarat,
      shape: upShape,
      quality: upQuality,
      centerCarat: upCenterCarat,
      totalCarat: upTotalCarat,
      price: upPrice,
      commission: upCommission,
    };
  };

  const active = getActiveValues();

  const goldAdj =
    active.gold === "Rose"
      ? 50
      : active.gold === "Yellow"
      ? 30
      : active.gold === "White"
      ? 70
      : 0;

  const karatAdj =
    active.karat === "10K"
      ? 20
      : active.karat === "14K"
      ? 40
      : active.karat === "18K"
      ? 80
      : 0;

  const shapeAdj =
    active.shape === "Oval" ? 100 : active.shape === "Princess" ? 150 : 0;

  const qualityAdj =
    active.quality === "Good"
      ? 20
      : active.quality === "Premium"
      ? 60
      : active.quality === "Excellent"
      ? 120
      : 0;

  const centerAdj = (Number(active.centerCarat) || 0) * 200;
  const totalAdj = (Number(active.totalCarat) || 0) * 150;

  // -----------------------------------
  // LEFT PANEL (shared)
  // -----------------------------------
  const LeftPanelTop = ({ mode }) => {
    const isAi = mode === "ai";

    const goldType = isAi ? aiGoldType : upGoldType;
    const setGold = isAi ? setAiGoldType : setUpGoldType;

    const karat = isAi ? aiKarat : upKarat;
    const setKaratValue = isAi ? setAiKarat : setUpKarat;

    const ringSize = isAi ? aiRingSize : upRingSize;
    const setRing = isAi ? setAiRingSize : setUpRingSize;

    const shape = isAi ? aiShape : upShape;
    const setShapeValue = isAi ? setAiShape : setUpShape;

    const quality = isAi ? aiQuality : upQuality;
    const setQualityValue = isAi ? setAiQuality : setUpQuality;

    const centerCarat = isAi ? aiCenterCarat : upCenterCarat;
    const setCenterCaratValue = isAi ? setAiCenterCarat : setUpCenterCarat;

    const totalCarat = isAi ? aiTotalCarat : upTotalCarat;
    const setTotalCaratValue = isAi ? setAiTotalCarat : setUpTotalCarat;

    const price = isAi ? aiPrice : upPrice;
    const commission = isAi ? aiCommission : upCommission;

    return (
      <>
        <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
          Customizing Tools
        </h2>

        {/* GOLD OPTIONS */}
        <h3 className="font-semibold tracking-wide mb-3">Gold Options</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">Type</p>
            {["rose", "yellow", "white"].map((option) => (
              <label
                key={option}
                className="flex w-fit items-center gap-2 text-xs tracking-wide cursor-pointer"
              >
                <input
                  type="radio"
                  value={option}
                  name={`goldType`}
                  checked={goldType === option}
                  onChange={() => setGold(option)}
                />
                {option}
              </label>
            ))}
          </div>

          <div>
            <p className="text-sm mb-2">Karat</p>
            {["10K", "14K", "18K"].map((k) => (
              <label
                key={k}
                className="flex w-fit items-center gap-2 text-xs tracking-wide cursor-pointer"
              >
                <input
                value={k}
                  type="radio"
                  name={`goldKarat`}
                  checked={karat === k}
                  onChange={() => setKaratValue(k)}
                />
                {k}
              </label>
            ))}
          </div>
        </div>

        {/* RING SIZE */}
        <p className="text-sm mt-4 mb-2">Ring Size</p>
        <select
        name="ringSize"
          className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
          value={ringSize}
          onChange={(e) => setRing(e.target.value)}
        >
          
          {[3, 4, 5, 6, 7, 8, 9].map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select>

        {/* DIAMOND OPTIONS */}
        <h3 className="font-semibold tracking-wide mt-6 mb-3">
          Diamond Options
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">Shape</p>
            <select
              name="diamondShape"
              className="bg-white text-black w-52 h-11 px-4 rounded-full"
              value={shape}
              onChange={(e) => setShapeValue(e.target.value)}
            >
              <option>Round</option>
              <option>Princess</option>
              <option>Oval</option>
            </select>
          </div>

          <div>
            <p className="text-sm mb-2">Quality</p>
            {["good", "premium", "excellent"].map((q) => (
              <label
                key={q}
                className="flex w-fit items-center gap-2 text-xs tracking-wide cursor-pointer"
              >
                <input
                  value={q}
                  type="radio"
                  name={`quality`}
                  checked={quality === q}
                  onChange={() => setQualityValue(q)}
                />
                {q}
              </label>
            ))}
          </div>
        </div>

        {/* CARATS */}
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <p className="text-sm mb-2">Center Stone Carat</p>
            <select
              name="centerStoneCarat"
              className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
              value={centerCarat}
              onChange={(e) => setCenterCaratValue(e.target.value)}
            >
              <option>0.5</option>
              <option>1.0</option>
              <option>1.5</option>
            </select>
          </div>

          <div>
            <p className="text-sm mb-2">Total Carat Weight</p>
            <select
              name="totalCaratWeight"
              className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
              value={totalCarat}
              onChange={(e) => setTotalCaratValue(e.target.value)}
            >
              
              <option>1.0</option>
              <option>1.5</option>
              <option>2.0</option>
            </select>
          </div>

          {mode !=="ai" && (
            <div>
            <p className="text-sm mb-2">Royalties</p>
            <input
              name="royalties"
              className="bg-[#D9D9D9] text-black w-40 p-2 rounded-lg"
              type="number"
              
            />
              
        
          </div>
          )}
        </div>

        {/* PRICE BOX */}
        <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs font-medium mt-6 tracking-wide">
          <div className="flex items-center">
            <p>Price: ${price}</p>
            <button
              onClick={() => setShowBreakdown(true)}
              className="ml-2 w-4 h-4 bg-black text-white rounded-full text-[10px] flex items-center justify-center"
            >
              i
            </button>
          </div>

          <p>Commission: ${commission}</p>
        </div>
        {mode==="ai"  && (
          <div className="relative mt-4">
              <textarea
                ref={promptRef}
                placeholder="Prompt your jewelry design..."
                className="w-full h-40 bg-[#D9D9D9] text-black p-4 rounded-xl"
              />
              <button type="button" onClick={()=>generateAiImage(goldType,karat,ringSize,shape,quality,centerCarat,totalCarat,price,commission)} className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#3A3A3A] text-white px-10 py-2 rounded-full">
                Generate
              </button>
            </div>
        )}
      </>
    );
  };

  // -----------------------------------
  // RIGHT PANEL (shared)
  // -----------------------------------
  const RightPanel = () => (
    <div className="flex flex-col">
      <div className="w-full h-[520px] bg-white rounded-3xl shadow-md">
      {loadingDesign?(   <div className="flex flex-col items-center justify-center py-10">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>

      <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
        Generating design, please do not refresh/switch tabs to view it here
      </p>
    </div>):(<img className="w-full rounded-3xl h-full" src={activeTab=="upload"?upPreviewImage:aiPreviewimage} alt="imagePreview" />)}
       
      </div>

      <input
        
        name="name"
        type="text"
        placeholder="Name Your Design..."
        className="w-full mt-6 p-3 rounded-full bg-[#D9D9D9] text-black"
      />

      <div className="relative mt-4">
        <textarea
        required
          name="description"
          placeholder="Add your product's description..."
          className="w-full p-4 rounded-2xl bg-[#D9D9D9] text-black h-32"
        />
        <button  type="submit" className="cursor-pointer absolute bottom-3 right-3 bg-[#3F3F3F] text-white px-6 py-2 rounded-full">
          Submit
        </button>
      </div>

      <div className="flex justify-between items-center mt-10 mx-2">
        <button className="cursor-pointer w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full">
          <img src="/assets/Share.svg" className="w-6 h-6" />
        </button>

        <button className="cursor-pointer w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full mx-2">
          <img src="/assets/wishlist.svg" className="w-6 h-6" />
        </button>

        <button className="cursor-pointer flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest">
          POST ON COMMUNITY
        </button>

        <button className="cursor-pointer flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest">
          BUY NOW
        </button>
      </div>
    </div>
  );

  // -----------------------------------
  // PAGE RETURN
  // -----------------------------------
  return (
    <div className="w-full min-h-screen bg-[#E5E1DA] pt-24 pb-20 flex flex-col items-center">
      {/* TITLE */}
      <section className="text-center mt-20 mb-2 ">
        <h1 className="text-5xl md:text-5xl font-serif font-light tracking-wide text-[#1a1a1a]">
          TAKSHILA DESIGN STUDIO
        </h1>
        <p className="text-sm mt-2 text-gray-600 mb-6">
          Bring your ideas to life with our AI Designer
        </p>
      </section>

      {/* TABS */}
      <div className="flex mt-8 bg-white rounded-full shadow-md overflow-hidden w-[420px] h-[48px]">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 text-sm tracking-widest ${
            activeTab === "ai"
              ? "bg-black text-white"
              : "bg-white text-gray-500"
          }`}
        >
          AI DESIGNER
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 text-sm tracking-widest ${
            activeTab === "upload"
              ? "bg-black text-white"
              : "bg-white text-gray-500"
          }`}
        >
          ADD YOUR DESIGN
        </button>
      </div>

      {/* AI DESIGNER MODE */}
      {activeTab === "ai" && (
        <form className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop mode="ai" />

            {/* PROMPT */}
            
          </div>

          <RightPanel />
        </form>
      )}

      {/* UPLOAD MODE */}
      {activeTab === "upload" && (
        <form onSubmit={handleMyDesignUpload} encType="multipart/form-data" accept="image/*" className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop mode="upload" />

            {/* UPLOAD BOX */}
            <div onClick={handleClick} className="cursor-pointer mt-6 bg-[#4A4A4A] w-full h-48 rounded-2xl flex flex-col items-center justify-center">
              <input name="images" onChange={handleChange} type="file" ref={uploadRef} className="hidden" />
              <div className="w-12 h-12 bg-[#D9D9D9] rounded-full flex items-center justify-center text-black text-3xl mb-4">
                +
              </div>
              <button type="button" className="cursor-pointer px-10 py-2 bg-black text-white rounded-full tracking-wide">
                UPLOAD
              </button>
            </div>
          </div>

          <RightPanel />
        </form>
      )}

      {/* PRICE BREAKDOWN POPUP */}
      {showBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[340px] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Price Breakdown
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>Base Price: $2000</p>
              <p>Gold Type Adjustment: +${goldAdj}</p>
              <p>Karat Adjustment: +${karatAdj}</p>
              <p>Shape Adjustment: +${shapeAdj}</p>
              <p>Quality Adjustment: +${qualityAdj}</p>
              <p>Center Stone Carat: +${centerAdj}</p>
              <p>Total Carat Weight: +${totalAdj}</p>

              <hr className="my-3" />

              <p className="font-semibold">Final Price: ${active.price}</p>
              <p className="font-semibold">Commission: ${active.commission}</p>
            </div>

            <button
              onClick={() => setShowBreakdown(false)}
              className="mt-6 w-full py-2 bg-black text-white rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
