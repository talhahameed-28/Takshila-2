import axios from "axios";
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef,
} from "react";
import toast from "react-hot-toast";
import PricingBreakdownModal from "../components/PriceBreakdown";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  const navigate = useNavigate();
  // ACTIVE TAB
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "upload"
  const [uploading, setUploading] = useState(false);

  // -----------------------------------
  // AI DESIGNER STATES
  // -----------------------------------
  const [aiGoldType, setAiGoldType] = useState("rose");
  const [aiKarat, setAiKarat] = useState("10K");
  const [aiRingSize, setAiRingSize] = useState(3);
  const [aiShape, setAiShape] = useState("Round");
  const [aiQuality, setAiQuality] = useState("good");
  const [aiCenterCarat, setAiCenterCarat] = useState(1.0);
  const [aiTotalCarat, setAiTotalCarat] = useState(1.0);
  const [aiMetalType, setAiMetalType] = useState("gold");
  const [aiStoneType, setAiStoneType] = useState("diamond");
  const [aiPrice, setAiPrice] = useState(2186.33);
  const [aiCommission, setAiCommission] = useState(76.52);
  const [aiPreviewimage, setAiPreviewimage] = useState(null);
  const [loadingDesign, setLoadingDesign] = useState(false);
  const [receivedAiImageId, setReceivedAiImageId] = useState(null);
  const promptRef = useRef(null);
  // -----------------------------------
  // UPLOAD MODE STATES
  // -----------------------------------
  const [upGoldType, setUpGoldType] = useState("rose");
  const [upKarat, setUpKarat] = useState("10K");
  const [upRingSize, setUpRingSize] = useState(3);
  const [upShape, setUpShape] = useState("Round");
  const [upQuality, setUpQuality] = useState("good");
  const [upCenterCarat, setUpCenterCarat] = useState(1.0);
  const [upTotalCarat, setUpTotalCarat] = useState(1.0);
  const [upMetalType, setUpMetalType] = useState("gold");
  const [upStoneType, setUpStoneType] = useState("diamond");
  const [upPrice, setUpPrice] = useState(2186.33);
  const [upCommission, setUpCommission] = useState(76.52);
  const [upPreviewImages, setUpPreviewImages] = useState([]);
  const [upPreviewImageFiles, setUpPreviewImageFiles] = useState([]);
  const [royalty, setRoyalty] = useState(0);

  const uploadRef = useRef();
  // -----------------------------------
  // PRICE BREAKDOWN POPUP
  // -----------------------------------
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [toolsOpen, setToolsOpen] = useState(true);

  const handleClick = () => uploadRef.current.click();

  const handleChange = (e) => {
    const files = e.target.files;
    if (!files) return;
    setUpPreviewImageFiles(files);
    // Create a local preview URL
    let imageUrls = [];
    for (const url of files) {
      imageUrls.push(URL.createObjectURL(url));
    }

    setUpPreviewImages(imageUrls);
  };

  const handleMyDesignUpload = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const formData = new FormData(e.target);
      console.log(Object.fromEntries(formData.entries()));
      // Extract all normal text fields EXCEPT files
      const values = Object.fromEntries(
        [...formData.entries()].filter(
          ([key, value]) => !(value instanceof File),
        ),
      );
      console.log(values);
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
        stoneType,
        metalType,
      } = values;

      console.log(values);
      console.log("Files:", images);

      if (totalCaratWeight < centerStoneCarat) {
        toast.error("Total carat cannot be lesser than Center Stone Carat");
        return;
      }

      // ---- SEND AS FORM DATA ----
      const sendData = new FormData();
      sendData.append("is_community_uploaded", 1);
      // Append simple text fields
      sendData.append("name", name);
      sendData.append("description", description);
      sendData.append("price", total);
      sendData.append("meta_data[commission]", upPriceBreakdown.commission);
      // Append meta_data fields individually
      sendData.append("meta_data[centerStoneCarat]", centerStoneCarat);
      sendData.append("meta_data[diamondShape]", diamondShape);
      sendData.append("meta_data[goldKarat]", goldKarat);
      sendData.append("meta_data[goldType]", goldType);
      sendData.append(
        "meta_data[quality]",
        quality == 0 ? "good" : quality == 1 ? "premium" : "excellent",
      );
      sendData.append("meta_data[ringSize]", ringSize);
      sendData.append("meta_data[metalType]", metalType);
      sendData.append("meta_data[stoneType]", stoneType);
      if (activeTab !== "ai")
        sendData.append("meta_data[royalties]", royalties);
      sendData.append("meta_data[totalCaratWeight]", totalCaratWeight);

      // Append each image file
      if (activeTab === "ai") {
        console.log(aiPreviewimage);
        const response = await fetch(aiPreviewimage);
        const blob = await response.blob();
        const file = new File([blob], name, { type: blob.type });
        sendData.append("images[]", file);
      } else {
        images.forEach((file) => {
          sendData.append("images[]", file);
        });
      }
      // ---------------------------
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/product/post-design`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      console.log(data);

      if (data.success) {
        toast.success("Design Posted on community!");
        navigate("/community");
      }

      /*if (data.success) {
  toast.success("Design added to community!");
  navigate("/community");
  }
  */
    } catch (error) {
      console.log(error);
      toast.error("Please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateAiImage = async (
    goldType,
    karat,
    ringSize,
    shape,
    quality,
    centerCarat,
    totalCarat,
    price,
    commission,
    metalType,
    stoneType,
  ) => {
    console.log(
      goldType,
      karat,
      ringSize,
      shape,
      quality,
      centerCarat,
      totalCarat,
      price,
      commission,
    );
    try {
      if (totalCarat < centerCarat) {
        toast.error("Total carat cannot be lesser than Center Stone Carat");
        return;
      }
      setToolsOpen(false);
      setLoadingDesign(true);
      console.log(typeof metalType);
      axios.defaults.withCredentials = true;
      // console.log(price,commission,metalType,stoneType)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/generate/image`,
        {
          goldType,
          goldKarat: karat,
          diamondShape: shape,
          quality,
          centerStoneCarat: Number(centerCarat),
          totalCaratWeight: Number(totalCarat),
          ringDesign: promptRef.current.value
            ? promptRef.current.value
            : "none",
          ringSize: Number(ringSize),
          price: Number(price),
          commission: Number(commission),
          stoneType,
          metalType,
          royalties: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );
      console.log(data);
      if (data.success) {
        setAiPreviewimage(data.data.product.image);

        setReceivedAiImageId(data.data.product.id);
        toast.success("Image generated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDesign(false);
    }
  };

  const handleAiDesignUpload = async (e) => {
    try {
      e.preventDefault();
      setUploading(true);
      axios.defaults.withCredentials = true;
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      const { name, description } = values;
      if (!receivedAiImageId || !name) {
        toast.error("Could not process your request");
        return;
      }
      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/product/${receivedAiImageId}/update`,
        { name: name.trim(), description: description.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );
      const { data: uploadData } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/product/upload`,
        { product_id: receivedAiImageId, name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );
      console.log(data);
      if (uploadData.success) {
        toast.success("Your design has been posted to community");
        navigate("/community");
      } else {
        toast.error("Couldn't process your request");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateDetails = async (
    setUpdating,
    designDescription,
    designName,
  ) => {
    setUpdating(true);
    try {
      // if(!nameRef.current.value.trim() || !descriptionRef.current.value.trim()){
      //   toast.error("Both name and description are needed")
      //   return
      // }
      if (designDescription.trim() == "" || designName.trim() == "") {
        toast.error("Both name and description are needed");
        return;
      }
      axios.defaults.withCredentials = true;
      if (activeTab === "ai") {
        // console.log(nameRef.current.value,descriptionRef.current.value)
        const { data } = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/product/${receivedAiImageId}/update`,
          { name: designName.trim(), description: designDescription.trim() },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          },
        );
        console.log(data);
        if (data.success) toast.success("Product updated succesfully");
        else toast.error("Couldn't process your request");
      } else if (activeTab === "upload") {
        console.log("updating");
        const payload = {
          name: designName.trim(),
          description: designDescription.trim(),
          price: upPriceBreakdown.totalPriceWithRoyalties,
          "images[]": upPreviewImageFiles,
          // is_community_uploaded:false,
          meta_data: {
            centerStoneCarat: upCenterCarat,
            description: designDescription.trim(),
            diamondShape: upShape,
            goldKarat: upKarat,
            goldType: upGoldType,
            name: designName.trim(),
            quality: upQuality,
            ringSize: upRingSize,
            royalties: royalty,
            totalCaratWeight: upTotalCarat,
          },
        };
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/product/post-design`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
        console.log(data);
        if (data.success) toast.success("Product updated succesfully");
        else toast.error("Couldn't process your request");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleBuy = async (setCheckingOut, designDescription, designName) => {
    setCheckingOut(true);
    try {
      axios.defaults.withCredentials = true;
      if (!designDescription.trim() || !designName.trim()) {
        toast.error("Both name and description are required");
        return;
      }
      if (activeTab === "ai") {
        const { data: savedInfo } = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/product/${receivedAiImageId}/update`,
          { name: designName.trim(), description: designDescription.trim() },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          },
        );

        if (!savedInfo.success) {
          toast.error("Couldn't process your request");
          return;
        }
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
          {
            product_id: receivedAiImageId,
            metalType: aiMetalType,
            stoneType: aiStoneType,
            goldType: aiGoldType,
            goldKarat: aiKarat,
            ringSize: aiRingSize,
            quality: aiQuality,
            diamondShape: aiShape,
            centerStoneCarat: aiCenterCarat,
            totalCaratWeight: aiTotalCarat,
          },
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
      } else {
        const payload = {
          name: designName.trim(),
          description: designDescription.trim(),
          price: upPriceBreakdown.totalPriceWithRoyalties,
          "images[]": [upPreviewImageFiles],
          meta_data: {
            metalType: upMetalType,
            stoneType: upStoneType,
            centerStoneCarat: upCenterCarat,
            description: designDescription.trim(),
            diamondShape: upShape,
            goldKarat: upKarat,
            goldType: upGoldType,
            name: designName.trim(),
            quality: upQuality,
            ringSize: upRingSize,
            royalties: royalty,
            totalCaratWeight: upTotalCarat,
          },
        };
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/product/post-design`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
        if (!data.success) {
          toast.error("Couldn't process your request");
          return;
        }
        const { data: orderProcess } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/wishlist/add`,
          {
            product_id: data.data.product.id,
            metalType: upMetalType,
            stoneType: upStoneType,
            goldType: upGoldType,
            goldKarat: upKarat,
            ringSize: upRingSize,
            quality: upQuality,
            diamondShape: upShape,
            centerStoneCarat: upCenterCarat,
            totalCaratWeight: upTotalCarat,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        if (orderProcess.success) {
          toast.success("Proceeding to checkout");
          navigate("/checkout");
        } else toast.error("Couldn't process your request");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred");
    } finally {
      setCheckingOut(false);
    }
  };

  // -----------------------------------
  // HELPERS FOR PRICE BREAKDOWN POPUP
  // -----------------------------------
  const [upPriceBreakdown, setUpPriceBreakdown] = useState({});
  const [aiPriceBreakdown, setAiPriceBreakdown] = useState({});

  useEffect(() => {
    const getActiveValues = () => {
      let activeValues = {};
      if (activeTab === "ai") {
        activeValues["ringSize"] = aiRingSize;
        activeValues["totalCaratWeight"] = aiTotalCarat;
        activeValues["metalType"] = aiMetalType;
        activeValues["stoneType"] = aiStoneType;
        if (aiMetalType == "gold") {
          activeValues["goldType"] = aiGoldType;
          activeValues["goldKarat"] = aiKarat;
        }
        if (aiStoneType == "diamond") activeValues["quality"] = aiQuality;
      } else {
        activeValues["royalties"] = royalty;
        activeValues["ringSize"] = upRingSize;
        activeValues["totalCaratWeight"] = upTotalCarat;
        activeValues["metalType"] = upMetalType;
        activeValues["stoneType"] = upStoneType;
        if (upMetalType == "gold") {
          activeValues["goldType"] = upGoldType;
          activeValues["goldKarat"] = upKarat;
        }
        if (upStoneType == "diamond") activeValues["quality"] = upQuality;
      }
      return activeValues;
    };

    const getBreakdown = async (active) => {
      try {
        console.log(active);
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/calculate/price`,
          { ...active },
        );
        console.log(data);
        if (data.success) {
          if (activeTab === "ai") setAiPriceBreakdown(data.data);
          else setUpPriceBreakdown(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const active = getActiveValues();

    // ⏳ debounce
    const timer = setTimeout(() => {
      getBreakdown(active);
    }, 1000);

    // 🧹 cleanup on dependency change
    return () => clearTimeout(timer);
  }, [
    aiGoldType,
    aiKarat,
    aiRingSize,
    aiQuality,
    aiTotalCarat,
    aiStoneType,
    aiMetalType,
    upGoldType,
    upKarat,
    upRingSize,
    upTotalCarat,
    upQuality,
    upStoneType,
    upMetalType,
    royalty,
    activeTab,
  ]);

  // -----------------------------------
  // LEFT PANEL (shared)
  // -----------------------------------

  // -----------------------------------
  // PAGE RETURN
  // -----------------------------------
  return (
    <>
      <Helmet>
        <title> AI Designer | Custom Diamond & Gold Jewelry | Takshila </title>
        <meta
          name="description"
          content="Takshila’s AI Designer turns your ideas into custom jewelry designs – enter a text or image prompt and watch your dream piece (whether a ring, pendant, earring, or any other jewelry) come to life with AI. Enjoy transparent price breakdowns and even witness the crafting process as your design becomes reality."
        />
        <meta name="keywords" content="AI jewelry designer, AI jewelry generator, text-to-jewelry design, Custom ring Design AI, Custom Pendant design AI, AI jewelry design tool, Generative AI jewelry" />
        <link rel="canonical" href="https://takshila.co/design-studio" />
      </Helmet>
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
        <div
          className="
    flex mt-8 bg-white rounded-full shadow-md overflow-hidden
    w-[300px] h-[40px]
    md:w-[420px] md:h-[48px]
  "
        >
          <button
            onClick={() => setActiveTab("ai")}
            className={`
      flex-1
      text-xs md:text-sm
      tracking-wide md:tracking-widest
      transition-colors
      ${activeTab === "ai" ? "bg-black text-white" : "bg-white text-gray-500"}
    `}
          >
            AI DESIGNER
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`
      flex-1
      text-xs md:text-sm
      tracking-wide md:tracking-widest
      transition-colors
      ${
        activeTab === "upload"
          ? "bg-black text-white"
          : "bg-white text-gray-500"
      }
    `}
          >
            ADD YOUR DESIGN
          </button>
        </div>

        {/* AI DESIGNER MODE */}
        {activeTab === "ai" && (
          <form
            onSubmit={handleAiDesignUpload}
            encType="multipart/form-data"
            accept="image/*"
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6"
          >
            <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
              {/* MOBILE ONLY HEADER TO TOGGLE */}
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className="md:hidden w-full flex justify-between items-center mb-4"
              >
                <span className="text-lg font-medium">Customizing Tools</span>
                <span>{toolsOpen ? "▲" : "▼"}</span>
              </button>

              {/* COLLAPSIBLE CONTENT */}
              <div className={`${toolsOpen ? "block" : "hidden"} md:block`}>
                <LeftPanelTop
                  goldType={aiGoldType}
                  setGold={setAiGoldType}
                  karat={aiKarat}
                  setKaratValue={setAiKarat}
                  ringSize={aiRingSize}
                  setRing={setAiRingSize}
                  shape={aiShape}
                  setShapeValue={setAiShape}
                  quality={aiQuality}
                  setQualityValue={setAiQuality}
                  centerCarat={aiCenterCarat}
                  setCenterCaratValue={setAiCenterCarat}
                  totalCarat={aiTotalCarat}
                  setTotalCaratValue={setAiTotalCarat}
                  metalType={aiMetalType}
                  setMetalType={setAiMetalType}
                  stoneType={aiStoneType}
                  setStoneType={setAiStoneType}
                  price={aiPriceBreakdown.totalPriceWithRoyalties}
                  commission={aiPriceBreakdown.commission}
                  handleGenerateAiImage={handleGenerateAiImage}
                  ref={promptRef}
                  setShowBreakdown={setShowBreakdown}
                  loadingDesign={loadingDesign}
                  mode={"ai"}
                />
              </div>
            </div>

            <RightPanel
              loadingDesign={loadingDesign}
              activeTab={activeTab}
              upPreviewImages={upPreviewImages}
              aiPreviewimage={aiPreviewimage}
              handleUpdateDetails={handleUpdateDetails}
              uploading={uploading}
              handleBuy={handleBuy}
            />
          </form>
        )}

        {/* UPLOAD MODE */}
        {activeTab === "upload" && (
          <form
            onSubmit={handleMyDesignUpload}
            encType="multipart/form-data"
            accept="image/*"
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6"
          >
            <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
              <LeftPanelTop
                goldType={upGoldType}
                setGold={setUpGoldType}
                karat={upKarat}
                setKaratValue={setUpKarat}
                ringSize={upRingSize}
                setRing={setUpRingSize}
                shape={upShape}
                setShapeValue={setUpShape}
                quality={upQuality}
                setQualityValue={setUpQuality}
                centerCarat={upCenterCarat}
                setCenterCaratValue={setUpCenterCarat}
                totalCarat={upTotalCarat}
                setTotalCaratValue={setUpTotalCarat}
                metalType={upMetalType}
                setMetalType={setUpMetalType}
                stoneType={upStoneType}
                setStoneType={setUpStoneType}
                price={upPriceBreakdown.totalPriceWithRoyalties}
                commission={upPriceBreakdown.commission}
                royalty={royalty}
                setRoyalty={setRoyalty}
                setShowBreakdown={setShowBreakdown}
                mode={"upload"}
              />

              {/* UPLOAD BOX */}
              <div
                onClick={handleClick}
                className="cursor-pointer mt-6 bg-[#4A4A4A] w-full h-48 rounded-2xl flex flex-col items-center justify-center"
              >
                <input
                  name="images[]"
                  multiple
                  onChange={handleChange}
                  type="file"
                  ref={uploadRef}
                  accept=".png, .jpg, .jpeg, .gif"
                  className="hidden"
                />
                <div className="w-12 h-12 bg-[#D9D9D9] rounded-full flex items-center justify-center text-black text-3xl mb-4">
                  +
                </div>
                <button
                  type="button"
                  className="cursor-pointer px-10 py-2 bg-black text-white rounded-full tracking-wide"
                >
                  UPLOAD
                </button>
              </div>
            </div>

            <RightPanel
              loadingDesign={loadingDesign}
              activeTab={activeTab}
              upPreviewImages={upPreviewImages}
              aiPreviewimage={aiPreviewimage}
              handleUpdateDetails={handleUpdateDetails}
              uploading={uploading}
              handleBuy={handleBuy}
            />
          </form>
        )}

        {/* PRICE BREAKDOWN POPUP */}
        {showBreakdown && (
          <PricingBreakdownModal
            breakdown={activeTab == "ai" ? aiPriceBreakdown : upPriceBreakdown}
            setShowBreakdown={setShowBreakdown}
          />
        )}
      </div>
    </>
  );
}

const AiImageLoader = () => {
  return (
    <div className="loader-container rounded-3xl">
      <div className="ring-wrapper">
        <div className="ring"></div>
        <div className="diamond"></div>
      </div>
    </div>
  );
};

const RightPanel = ({
  loadingDesign,
  activeTab,
  upPreviewImages,
  aiPreviewimage,
  handleUpdateDetails,
  uploading,
  handleBuy,
}) => {
  const [designName, setDesignName] = useState("");
  const [designDescription, setDesignDescription] = useState("");
  const [updating, setUpdating] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? upPreviewImages.length - 1 : prev - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === upPreviewImages.length - 1 ? 0 : prev + 1,
    );
  };
  return (
    <div className="flex flex-col">
      <div className="w-full h-[520px] bg-white rounded-3xl shadow-md relative overflow-hidden z-0">
        {loadingDesign ? (
          <AiImageLoader />
        ) : (
          <>
            {activeTab === "upload" && upPreviewImages.length > 1 && (
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

            {(activeTab === "ai" && aiPreviewimage) ||
            (activeTab === "upload" && upPreviewImages.length > 0) ? (
              <img
                src={
                  activeTab === "ai"
                    ? aiPreviewimage
                    : upPreviewImages[currentIndex]
                }
                alt="Design Preview"
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Your design preview will appear here
              </div>
            )}
          </>
        )}
      </div>

      <input
        // ref={nameRef}
        onChange={(e) => {
          setDesignName(e.target.value);
          console.log(designName);
        }}
        defaultValue={designName}
        required
        name="name"
        type="text"
        placeholder="Name Your Design..."
        className="w-full mt-6 p-3 rounded-full bg-[#D9D9D9] text-black"
      />

      <div className="relative mt-4">
        <textarea
          onChange={(e) => setDesignDescription(e.target.value)}
          // ref={descriptionRef}
          defaultValue={designDescription}
          required
          name="description"
          placeholder="Add your product's description..."
          className="w-full p-4 rounded-2xl bg-[#D9D9D9] text-black h-32"
        />
        <button
          disabled={updating}
          type="button"
          value="update-details"
          onClick={() =>
            handleUpdateDetails(setUpdating, designDescription, designName)
          }
          className={`${
            updating
              ? "bg-gray-600 cursor-not-allowed px-8"
              : "cursor-pointer  bg-[#3F3F3F] text-white px-6"
          } py-2 rounded-full absolute bottom-3 right-3`}
        >
          {updating ? "Updating details..." : "Submit"}
        </button>
      </div>

      <div className="flex justify-between items-center mt-10 mx-2">
        <button className="cursor-pointer w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full">
          <img src="/assets/Share.svg" className="w-6 h-6" />
        </button>

        {/* <button className="cursor-pointer w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full mx-2">
          <img src="/assets/wishlist.svg" className="w-6 h-6" />
        </button> */}

        {/* BUY & POST BUTTONS  <button className="cursor-pointer flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest">
            POST ON COMMUNITY
          </button>*/}

        <button
          value="post-on-community"
          type="submit"
          className={`${uploading?"bg-gray-600 cursor-not-allowed":"cursor-pointer via-teal-500 to-green-500 bg-gradient-to-r from-emerald-500"} flex-1 mx-2 py-4 md:px-8 px-4 text-white rounded-full text-center text-xs tracking-widest leading-[1.5]`}
        >
          {uploading?"POSTING":"POST ON COMMUNITY"}
        </button>

        <button type="button" onClick={()=>handleBuy(setCheckingOut,designDescription,designName)} 
          className={`${checkingOut?"bg-gray-600 cursor-not-allowed":"cursor-pointer bg-green-gradiant"} flex-1 mx-2 py-4 md:px-8 px-3 text-white rounded-full text-center text-xs tracking-widest leading-[1.5]`}>
          BUY NOW
        </button>
      </div>
    </div>
  );
};

const LeftPanelTop = forwardRef(
  (
    {
      goldType,
      setGold,
      karat,
      setKaratValue,
      ringSize,
      setRing,
      shape,
      setShapeValue,
      quality,
      setQualityValue,
      centerCarat,
      setCenterCaratValue,
      totalCarat,
      setTotalCaratValue,
      metalType,
      setMetalType,
      stoneType,
      setStoneType,
      royalty,
      setRoyalty,
      price,
      commission,
      mode,
      setShowBreakdown,
      handleGenerateAiImage,
      loadingDesign,
    },
    promptRef,
  ) => {
    return (
      <>
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
                    checked={metalType === t}
                    onChange={() => setMetalType(t)}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="mt-1 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div></div>
        </div>
        {/* GOLD OPTIONS */}
        {metalType == "gold" && (
          <>
            <h3 className="font-semibold tracking-wide mb-3">Gold Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </>
        )}

        {/* RING SIZE */}
        <h3 className="font-semibold tracking-wide mt-4 mb-3">Ring Size</h3>

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
        <h3 className="font-semibold tracking-wide mt-6 mb-3">Stone Options</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 mb-4 gap-6">
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
                    checked={stoneType === t}
                    onChange={() => setStoneType(t)}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="mt-1 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div></div>
        </div>
        <div className="grid mb-8 grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">Shape</p>
            <ShapeDropdown
              value={shape}
              onChange={(val) => setShapeValue(val)}
            />
            <input name="diamondShape" type="hidden" value={shape} />
          </div>

          {stoneType == "diamond" && (
            <div>
              <p className="text-sm mb-1">Quality</p>

              <div className="w-full max-w-lg">
                {/* Slider container */}
                <div className="relative px-0 py-2.5  overflow-hidden">
                  {/* white inner line */}

                  <input
                    name="quality"
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    value={
                      quality === "good" ? 0 : quality === "premium" ? 1 : 2
                    }
                    onChange={(e) =>
                      setQualityValue(
                        e.target.value == 0
                          ? "good"
                          : e.target.value == 1
                            ? "premium"
                            : "excellent",
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
          )}
        </div>

        {/* CARATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">Center Stone Carat</p>

            <input
              name="centerStoneCarat"
              type="number"
              min="0.01"
              step="0.01"
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
              min="0.01"
              step="0.01"
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
        <div className="flex justify-between bg-[#D9D9D9] text-black p-2 md:p-4 rounded-lg text-xs font-medium mt-6 tracking-wide">
          <div className="flex items-center">
            <p className="text-nowrap">Price: ${price}</p>
            <button
              type="button"
              onClick={() => setShowBreakdown(true)}
              className="cursor-pointer ml-2 w-4 h-4 bg-black text-white rounded-full text-[10px] flex items-center justify-center"
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
                handleGenerateAiImage(
                  goldType,
                  karat,
                  ringSize,
                  shape,
                  quality,
                  centerCarat,
                  totalCarat,
                  price,
                  commission,
                  metalType,
                  stoneType,
                )
              }
              className={`${loadingDesign ? "bg-gray-600 cursor-not-allowed" : "cursor-pointer bg-[#3A3A3A]"} absolute bottom-3 left-1/2 -translate-x-1/2  text-white px-10 py-2 rounded-full`}
            >
              {loadingDesign ? "Generating, please wait..." : "Generate"}
            </button>
          </div>
        )}
      </>
    );
  },
);
