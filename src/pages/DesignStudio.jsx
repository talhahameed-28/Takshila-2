import React, { useState, useEffect } from "react";

export default function DesignStudio() {
  // ACTIVE TAB
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "upload"

  // -----------------------------------
  // AI DESIGNER STATES
  // -----------------------------------
  const [aiGoldType, setAiGoldType] = useState("");
  const [aiKarat, setAiKarat] = useState("");
  const [aiRingSize, setAiRingSize] = useState("");
  const [aiShape, setAiShape] = useState("Round");
  const [aiQuality, setAiQuality] = useState("");
  const [aiCenterCarat, setAiCenterCarat] = useState("");
  const [aiTotalCarat, setAiTotalCarat] = useState("");
  const [aiPrice, setAiPrice] = useState(2186.33);
  const [aiCommission, setAiCommission] = useState(76.52);

  // -----------------------------------
  // UPLOAD MODE STATES (separate)
  // -----------------------------------
  const [upGoldType, setUpGoldType] = useState("");
  const [upKarat, setUpKarat] = useState("");
  const [upRingSize, setUpRingSize] = useState("");
  const [upShape, setUpShape] = useState("Round");
  const [upQuality, setUpQuality] = useState("");
  const [upCenterCarat, setUpCenterCarat] = useState("");
  const [upTotalCarat, setUpTotalCarat] = useState("");
  const [upPrice, setUpPrice] = useState(2186.33);
  const [upCommission, setUpCommission] = useState(76.52);

  // -----------------------------------
  // PRICE CALCULATOR (dual mode)
  // -----------------------------------
  const calculatePrice = (mode) => {
    let base = 2000;

    const gold = mode === "ai" ? aiGoldType : upGoldType;
    const karat = mode === "ai" ? aiKarat : upKarat;
    const shape = mode === "ai" ? aiShape : upShape;
    const quality = mode === "ai" ? aiQuality : upQuality;
    const centerCarat = mode === "ai" ? aiCenterCarat : upCenterCarat;
    const totalCarat = mode === "ai" ? aiTotalCarat : upTotalCarat;

    if (gold === "Rose") base += 50;
    if (gold === "Yellow") base += 30;
    if (gold === "White") base += 70;

    if (karat === "10K") base += 20;
    if (karat === "14K") base += 40;
    if (karat === "18K") base += 80;

    if (shape === "Oval") base += 100;
    if (shape === "Princess") base += 150;

    if (quality === "Good") base += 20;
    if (quality === "Premium") base += 60;
    if (quality === "Excellent") base += 120;

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

  // AI price updates
  useEffect(() => {
    calculatePrice("ai");
  }, [aiGoldType, aiKarat, aiShape, aiQuality, aiCenterCarat, aiTotalCarat]);

  // UPLOAD price updates
  useEffect(() => {
    calculatePrice("upload");
  }, [upGoldType, upKarat, upShape, upQuality, upCenterCarat, upTotalCarat]);

  // -----------------------------------
  // LEFT PANEL COMPONENT (dual mode)
  // -----------------------------------
  const LeftPanelTop = ({ mode }) => {
    const isAi = mode === "ai";

    // Select states based on mode
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
            {["Rose", "Yellow", "White"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-xs tracking-wide cursor-pointer"
              >
                <input
                  type="radio"
                  name={`gold-${mode}`}
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
                className="flex items-center gap-2 text-xs tracking-wide cursor-pointer"
              >
                <input
                  type="radio"
                  name={`karat-${mode}`}
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
          className="bg-[#D9D9D9] text-black w-40 p-2 rounded-lg"
          value={ringSize}
          onChange={(e) => setRing(e.target.value)}
        >
          <option value="">Select size</option>
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
              className="bg-white text-black rounded-full px-4 py-2 w-48"
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
            {["Good", "Premium", "Excellent"].map((q) => (
              <label
                key={q}
                className="flex items-center gap-2 text-xs tracking-wide cursor-pointer"
              >
                <input
                  type="radio"
                  name={`quality-${mode}`}
                  checked={quality === q}
                  onChange={() => setQualityValue(q)}
                />
                {q}
              </label>
            ))}
          </div>
        </div>

        {/* CARATS */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <p className="text-sm mb-2">Center Stone Carat</p>
            <select
              className="bg-[#D9D9D9] text-black w-40 p-2 rounded-lg"
              value={centerCarat}
              onChange={(e) => setCenterCaratValue(e.target.value)}
            >
              <option value="">Select</option>
              <option>0.5</option>
              <option>1.0</option>
              <option>1.5</option>
            </select>
          </div>

          <div>
            <p className="text-sm mb-2">Total Carat Weight</p>
            <select
              className="bg-[#D9D9D9] text-black w-40 p-2 rounded-lg"
              value={totalCarat}
              onChange={(e) => setTotalCaratValue(e.target.value)}
            >
              <option value="">Select</option>
              <option>1.0</option>
              <option>1.5</option>
              <option>2.0</option>
            </select>
          </div>
        </div>

        {/* PRICE */}
        <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs font-medium mt-6 tracking-wide">
          <p>Price: ${price}</p>
          <p>Commission: ${commission}</p>
        </div>
      </>
    );
  };

  // -----------------------------------
  // RIGHT PANEL (shared component)
  // -----------------------------------
  const RightPanel = () => (
    <div className="flex flex-col">
      <div className="w-full h-[520px] bg-white rounded-3xl shadow-md"></div>

      <input
        type="text"
        placeholder="Name Your Design..."
        className="w-full mt-6 p-3 rounded-full bg-[#D9D9D9] text-black"
      />

      <div className="relative mt-4">
        <textarea
          placeholder="Add your product's description..."
          className="w-full p-4 rounded-2xl bg-[#D9D9D9] text-black h-32"
        />
        <button className="absolute bottom-3 right-3 bg-[#3F3F3F] text-white px-6 py-2 rounded-full">
          Submit
        </button>
      </div>

      <div className="flex justify-between items-center mt-10 mx-2">
        <button className="w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full">
          <img src="/assets/Share.svg" className="w-6 h-6" />
        </button>

        <button className="w-12 h-12 flex items-center justify-center bg-[#C3C3C3] rounded-full mx-2">
          <img src="/assets/wishlist.svg" className="w-6 h-6" />
        </button>

        <button className="flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest">
          POST ON COMMUNITY
        </button>

        <button className="flex-1 mx-2 py-3 bg-[#6B6B6B] text-white rounded-full text-center text-xs tracking-widest">
          BUY NOW
        </button>
      </div>
    </div>
  );

  // -----------------------------------
  // RETURN PAGE
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

      {/* TAB SWITCH */}
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

      {/* AI MODE */}
      {activeTab === "ai" && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop mode="ai" />

            {/* PROMPT */}
            <div className="relative mt-4">
              <textarea
                placeholder="Prompt your jewelry design..."
                className="w-full h-40 bg-[#D9D9D9] text-black p-4 rounded-xl"
              />
              <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#3A3A3A] text-white px-10 py-2 rounded-full">
                Generate
              </button>
            </div>
          </div>

          <RightPanel />
        </div>
      )}

      {/* UPLOAD MODE */}
      {activeTab === "upload" && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop mode="upload" />

            {/* UPLOAD BOX */}
            <div className="mt-6 bg-[#4A4A4A] w-full h-48 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-[#D9D9D9] rounded-full flex items-center justify-center text-black text-3xl mb-4">
                +
              </div>
              <button className="px-10 py-2 bg-black text-white rounded-full tracking-wide">
                UPLOAD
              </button>
            </div>
          </div>

          <RightPanel />
        </div>
      )}
    </div>
  );
}
