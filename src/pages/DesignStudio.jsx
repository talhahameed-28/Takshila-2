import axios from "axios";
import React, { useState, useEffect, useRef,useLayoutEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

//diamond shapes options
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
      {/* Selected */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-white text-black w-full h-11 px-4 rounded-full
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

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white  text-black rounded-xl shadow-lg overflow-hidden">
          {DIAMOND_SHAPES.map((shape) => (
            <button
              key={shape.name}
              type="button"
              onClick={() => {
                onChange(shape.name);
                setOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3
                         hover:bg-gray-100 text-left"
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

export default function DesignStudio() {
  const navigate=useNavigate()
  // ACTIVE TAB
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "upload"
  const [uploading, setUploading] = useState(false)
  
  


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
  const [royalty, setRoyalty] = useState(0)
  const uploadRef = useRef()
  // -----------------------------------
  // PRICE BREAKDOWN POPUP
  // -----------------------------------
  const [showBreakdown, setShowBreakdown] = useState(false);

  
  // -----------------------------------
  // PRICE CALCULATOR
  // -----------------------------------


  // useEffect(() => {
  //   calculatePrice("ai");
  // }, [aiGoldType, aiKarat, aiShape, aiQuality, aiCenterCarat, aiTotalCarat]);

  // useEffect(() => {
  //   calculatePrice("upload");
  // }, [upGoldType, upKarat, upShape, upQuality, upCenterCarat, upTotalCarat]);

  const handleClick = () => uploadRef.current.click();

  const handleChange=(e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local preview URL
    const imageUrl = URL.createObjectURL(file);
    setUpPreviewImage(imageUrl);
  };

  const handleMyDesignUpload = async (e) => {
  try {
    setUploading(true)
    e.preventDefault();

    const formData = new FormData(e.target);

    // Extract all normal text fields EXCEPT files
    const values = Object.fromEntries(
      [...formData.entries()].filter(([key, value]) => !(value instanceof File))
    );

    axios.defaults.withCredentials = true;

    const calculatedPrice =
      activeTab === "ai"
        ? Number(aiPriceBreakdown.totalPriceWithRoyalties) +
          Number(aiPriceBreakdown.commission)
        : Number(upPriceBreakdown.totalPriceWithRoyalties) +
          Number(upPriceBreakdown.commission);

    const total =
      (activeTab === "ai" ? 0 : Number(values.royalties)) +
      Number(calculatedPrice);

    // ---- FILE ARRAY FIX ----
    const images = formData.getAll("images[]"); // File array
    // ------------------------

    const {
      centerStoneCarat,
      description,
      diamondShape,
      goldKarat,
      goldType,
      name,
      quality,
      ringSize,
      royalties,
      totalCaratWeight,
    } = values;

    console.log(values);
    console.log("Files:", images);

    if (totalCaratWeight < centerStoneCarat) {
      toast.error("Total carat cannot be lesser than Center Stone Carat");
      return;
    }

    // ---- SEND AS FORM DATA ----
    const sendData = new FormData();

    // Append simple text fields
    sendData.append("name", name);
    sendData.append("description", description);
    sendData.append("price", total);

    // Append meta_data fields individually
    sendData.append("meta_data[centerStoneCarat]", centerStoneCarat);
    sendData.append("meta_data[diamondShape]", diamondShape);
    sendData.append("meta_data[goldKarat]", goldKarat);
    sendData.append("meta_data[goldType]", goldType);
    sendData.append("meta_data[quality]", quality);
    sendData.append("meta_data[ringSize]", ringSize);
    if(activeTab!=="ai") sendData.append("meta_data[royalties]", royalties);
    sendData.append("meta_data[totalCaratWeight]", totalCaratWeight);

    // Append each image file
    if(activeTab==="ai"){
      console.log(aiPreviewimage)
      const response = await fetch(aiPreviewimage);
      const blob = await response.blob();
      const file= new File([blob], name, { type: blob.type });
      sendData.append("images[]",file)
    }else{
        images.forEach((file) => {
        sendData.append("images[]", file);
      });
    }
 
    // ---------------------------
    console.log(sendData)
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/product/post-design`,
      sendData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    console.log(data);

    if (data.success) {
      toast.success("Design saved!");
      navigate("/community");
    }

    /*if (data.success) {
  toast.success("Design added to community!");
  navigate("/community");
  }
  */

  } catch (error) {
    console.log(error);
    toast.error("Please try again")
  }finally{
    setUploading(false)
  }
};


  const generateAiImage=async(goldType,karat,ringSize,shape,quality,centerCarat,totalCarat,price,commission)=>{
    console.log(goldType,karat,ringSize,shape,quality,centerCarat,totalCarat,price,commission)
    try {
      if(totalCarat<centerCarat) {
        
        toast.error("Total carat cannot be lesser than Center Stone Carat")
        return
      }
      setLoadingDesign(true)
      console.log(typeof(promptRef.current.value))
      axios.defaults.withCredentials=true
      console.log(promptRef.current.value)
      const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/generate/image`,
        {goldType,
          goldKarat:karat,
          diamondShape:shape,
          quality,
          centerStoneCarat:Number(centerCarat),
          totalCaratWeight:Number(totalCarat),
          ringDesign:promptRef.current.value?promptRef.current.value:"none",
          ringSize:Number(ringSize),
          price:Number(price),
          commission:Number(commission),
          royalties:0
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
  const [upPriceBreakdown, setUpPriceBreakdown] = useState({})
  const [aiPriceBreakdown, setAiPriceBreakdown] = useState({})

 
  useLayoutEffect(() => {
    
    const getActiveValues = () => {
      if (activeTab === "ai") {
        return {
          ringSize: aiRingSize,
          goldType: aiGoldType,
          goldKarat: aiKarat,
          quality: aiQuality,
          totalCaratWeight: aiTotalCarat,
        };
      }
      return {
        ringSize:upRingSize,
        goldType: upGoldType,
        goldKarat: upKarat,
        quality: upQuality,
        totalCaratWeight: upTotalCarat,
        royalties:royalty
      };
    };
 
    const getBreakdown=async(active)=>{
      try {
        axios.defaults.withCredentials=true
        const {data}=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/calculate/price`,{...active})
        console.log(data)
        if(data.success){
          if(activeTab==="ai") setAiPriceBreakdown(data.data)
            else setUpPriceBreakdown(data.data)
        }
      } catch (error) {
        console.log(error)
      }

    }
    const active = getActiveValues();
    getBreakdown(active)
  }, [aiGoldType,
aiKarat,
aiRingSize,
aiQuality,
aiTotalCarat,
upGoldType,
upKarat,
upRingSize,
upTotalCarat,
upQuality,
royalty,
activeTab])
  


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

    const price = isAi ? aiPriceBreakdown.totalPriceWithRoyalties : upPriceBreakdown.totalPriceWithRoyalties;
    const commission = isAi ? aiPriceBreakdown.commission : upPriceBreakdown.commission;

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

            <div className="flex items-center gap-10">
              {["rose", "yellow", "white"].map((option) => (
                <label
                  key={option}
                  className="flex flex-col items-center gap-2 text-xs tracking-wide cursor-pointer"
                >
                  <input
                    type="radio"
                    value={option}
                    name="goldType"
                    checked={goldType === option}
                    onChange={() => setGold(option)}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="mt-1 capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm mb-2">Karat</p>

            <div className="flex items-center gap-10">
              {["10K", "14K", "18K"].map((k) => (
                <label
                  key={k}
                  className="flex flex-col items-center gap-2 text-xs tracking-wide cursor-pointer"
                >
                  <input
                    type="radio"
                    value={k}
                    name="goldKarat"
                    checked={karat === k}
                    onChange={() => setKaratValue(k)}
                    className="w-5 h-5 accent-black"
                  />

                  <span className="mt-1 capitalize">{k}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RING SIZE */}
        <p className="text-sm mt-4 mb-2">Ring Size</p>

        <select
          name="ringSize"
          value={ringSize}
          onChange={(e) => setRing(e.target.value)}
          className="bg-[#D9D9D9] text-black w-52 h-11 px-4 rounded-full"
        >
          {Array.from({ length: 21 }, (_, i) => 3 + i * 0.5).map((size) => (
            <option key={size} value={size.toFixed(1)}>
              {size.toFixed(1)}
            </option>
          ))}
        </select>

        {/* DIAMOND OPTIONS */}
        <h3 className="font-semibold tracking-wide mt-6 mb-3">
          Diamond Options
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">Shape</p>
            <ShapeDropdown
              value={shape}
              onChange={(val) => setShapeValue(val)}
            />
          </div>

          <div>
            <p className="text-sm mb-1">Quality</p>

            <div className="w-full max-w-lg">
              {/* Slider container */}
              <div className="relative px-0 py-2.5  overflow-hidden">
                {/* white inner line */}

                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={quality === "good" ? 0 : quality === "premium" ? 1 : 2}
                  onChange={(e) =>
                    setQualityValue(
                      e.target.value == 0
                        ? "good"
                        : e.target.value == 1
                        ? "premium"
                        : "excellent"
                    )
                  }
                  className="
                        w-full appearance-none bg-transparent cursor-pointer relative z-10

                        [&::-webkit-slider-runnable-track]:h-2
                        [&::-webkit-slider-runnable-track]:rounded-full
                        [&::-webkit-slider-runnable-track]:bg-white

                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-8
                        [&::-webkit-slider-thumb]:h-8
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-gradient-to-br
                        [&::-webkit-slider-thumb]:from-gray-700
                        [&::-webkit-slider-thumb]:via-gray-500
                        [&::-webkit-slider-thumb]:to-gray-800
                        [&::-webkit-slider-thumb]:border
                        [&::-webkit-slider-thumb]:border-gray-300
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:-mt-3

                        [&::-moz-range-track]:h-2
                        [&::-moz-range-track]:rounded-full
                        [&::-moz-range-track]:bg-gray-400

                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:h-4
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:border
                        [&::-moz-range-thumb]:border-gray-300
                      "
                />
              </div>

              {/* Labels */}
              <div className="mt-1 grid grid-cols-3 text-center text-sm text-white">
                <div>
                  
                  <div>Good</div>
                </div>
                <div>
                  
                  <div>Premium</div>
                </div>

                <div>
                  
                  <div>Excellent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARATS */}
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <p className="text-sm mb-2">Center Stone Carat</p>

            <input
              name="centerStoneCarat"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={centerCarat}
              onChange={(e) => setCenterCaratValue(e.target.value)}
              className="bg-[#D9D9D9] text-black w-42 h-11 px-4 rounded-full"
            />
          </div>

          <div>
            <p className="text-sm mb-2">Total Carat Weight</p>

            <input
              name="totalCaratWeight"
              type="number"
              min="1"
              max="6"
              step="0.1"
              value={totalCarat}
              onChange={(e) => setTotalCaratValue(e.target.value)}
              className="bg-[#D9D9D9] text-black w-42 h-11 px-4 rounded-full"
            />
          </div>

          {mode !== "ai" && (
            <div>
              <p className="text-sm mb-2">Royalties</p>
              <input
                onChange={(e) => {
                  setRoyalty(e.target.value);
                }}
                name="royalties"
                className="bg-[#D9D9D9] text-black h-11 w-42 px-2 rounded-full"
                type="number"
                value={royalty}
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
        {mode === "ai" && (
          <div className="relative mt-4">
            <textarea
              ref={promptRef}
              placeholder="Prompt your jewelry design..."
              className="w-full h-48 mt-4 bg-[#D9D9D9] text-black p-4 rounded-xl"
            />
            <button
              type="button"
              onClick={() =>
                generateAiImage(
                  goldType,
                  karat,
                  ringSize,
                  shape,
                  quality,
                  centerCarat,
                  totalCarat,
                  price,
                  commission
                )
              }
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#3A3A3A] text-white px-10 py-2 rounded-full"
            >
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
        {loadingDesign ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>

            <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
              Generating design, please do not refresh/switch tabs to view it
              here
            </p>
          </div>
        ) : (
          <img
            className="w-full rounded-3xl h-full"
            src={activeTab == "upload" ? upPreviewImage : aiPreviewimage}
            alt="imagePreview"
          />
        )}
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
        <button
          disabled={uploading}
          type="submit"
          className={`${
            uploading
              ? "bg-gray-600 cursor-not-allowed px-8"
              : "cursor-pointer  bg-[#3F3F3F] text-white px-6"
          } py-2 rounded-full absolute bottom-3 right-3`}
        >
          {uploading ? "Uploading, please wait..." : "Submit"}
        </button>
      </div>

      <div className="flex justify-between items-center mt-10 mx-2">
        <button className="cursor-pointer w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full">
          <img src="/assets/Share.svg" className="w-6 h-6" />
        </button>

        <button className="cursor-pointer w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full mx-2">
          <img src="/assets/wishlist.svg" className="w-6 h-6" />
        </button>

        {
          /* BUY & POST BUTTONS  <button className="cursor-pointer flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest">
            POST ON COMMUNITY
          </button>*/
        }

        <button
          type="button"
          onClick={() => navigate("/community")}
          className="cursor-pointer flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest"
        >
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
        <form onSubmit={handleMyDesignUpload} encType="multipart/form-data" accept="image/*" className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop mode="ai" />

            
            
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
              <input name="images[]" multiple onChange={handleChange} type="file" ref={uploadRef} className="hidden" />
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
              <p>Quality Cost:+${activeTab==="ai"?aiPriceBreakdown.breakdown.qualityCost:upPriceBreakdown.breakdown.qualityCost}</p>
              <p>Metal cost: +${activeTab==="ai"?aiPriceBreakdown.breakdown.metalCost:upPriceBreakdown.breakdown.metalCost}</p>
              <p>Working charges: +${activeTab==="ai"?aiPriceBreakdown.breakdown.workingChargesCost:upPriceBreakdown.breakdown.workingChargesCost}</p>
              <p>Setting cost: +${activeTab==="ai"?aiPriceBreakdown.breakdown.diamondSettingCost:upPriceBreakdown.breakdown.diamondSettingCost}</p>
              <p>Certification: +${activeTab==="ai"?aiPriceBreakdown.breakdown.certificationCost:upPriceBreakdown.breakdown.certificationCost}</p>
              <p>Shipping: +${activeTab==="ai"?aiPriceBreakdown.breakdown.shipmentCost:upPriceBreakdown.breakdown.shipmentCost}</p>
              <p>Designer royalties: +${activeTab==="ai"?aiPriceBreakdown.royalties:upPriceBreakdown.royalties}</p>

              <hr className="my-3" />

              <p className="font-semibold">Final Price: ${activeTab==="ai"?aiPriceBreakdown.totalPriceWithRoyalties:upPriceBreakdown.totalPriceWithRoyalties}</p>
              <p className="font-semibold">Commission: ${activeTab==="ai"?aiPriceBreakdown.commission:upPriceBreakdown.commission}</p>
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
