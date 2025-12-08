import React, { useState, useEffect } from "react";

export default function DesignStudio() {
  // -------------------------------
  // STATE FOR DYNAMIC CALCULATION
  // -------------------------------
  const [activeTab, setActiveTab] = useState("ai"); // "ai" or "upload"

  const [goldType, setGoldType] = useState("");
  const [karat, setKarat] = useState("");
  const [shape, setShape] = useState("Round");
  const [quality, setQuality] = useState("");
  const [centerCarat, setCenterCarat] = useState("");
  const [totalCarat, setTotalCarat] = useState("");

  const [price, setPrice] = useState(2186.33);
  const [commission, setCommission] = useState(76.52);

  // -------------------------------
  // PRICE CALCULATOR LOGIC
  // -------------------------------
  const calculatePrice = () => {
    let base = 2000;

    if (goldType === "Rose") base += 50;
    if (goldType === "Yellow") base += 30;
    if (goldType === "White") base += 70;

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

    setPrice(base);
    setCommission((base * 0.035).toFixed(2));
  };

  useEffect(() => {
    calculatePrice();
  }, [goldType, karat, shape, quality, centerCarat, totalCarat]);

  // --------------------------------
  // REUSABLE LEFT PANEL TOP CONTENT
  // (Gold + Diamond options + price)
  // --------------------------------
  const LeftPanelTop = () => (
    <>
      <h2 className="text-center text-xl tracking-[0.2em] font-semibold mb-6">
        Customizing Tools
      </h2>

      {/* GOLD OPTIONS */}
      <h3 className="font-semibold tracking-wide mb-3">Gold Options</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Type */}
        <div>
          <p className="text-sm mb-2">Type</p>
          <div className="flex flex-col gap-1">
            {["Rose", "Yellow", "White"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer text-xs tracking-wide"
              >
                <input
                  type="radio"
                  name="goldType"
                  className="w-3 h-3"
                  onChange={() => setGoldType(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Karat */}
        <div>
          <p className="text-sm mb-2">Karat</p>
          <div className="flex flex-col gap-1">
            {["10K", "14K", "18K"].map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 cursor-pointer text-xs tracking-wide"
              >
                <input
                  type="radio"
                  name="karat"
                  className="w-3 h-3"
                  onChange={() => setKarat(k)}
                />
                {k}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RING SIZE */}
      <p className="text-sm mt-4 mb-2">Ring Size</p>
      <select className="bg-[#D9D9D9] text-black w-40 p-2 rounded-lg">
        <option value="">Select size</option>
        {[3, 4, 5, 6, 7, 8, 9].map((size) => (
          <option key={size}>{size}</option>
        ))}
      </select>

      {/* DIAMOND OPTIONS */}
      <h3 className="font-semibold tracking-wide mt-6 mb-3">Diamond Options</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Shape */}
        <div>
          <p className="text-sm mb-2">Shape</p>
          <select
            className="bg-white text-black rounded-full px-4 py-2 w-48"
            onChange={(e) => setShape(e.target.value)}
          >
            <option>Round</option>
            <option>Princess</option>
            <option>Oval</option>
          </select>
        </div>

        {/* Quality */}
        <div>
          <p className="text-sm mb-2">Quality</p>
          <div className="flex flex-col gap-1">
            {["Good", "Premium", "Excellent"].map((q) => (
              <label
                key={q}
                className="flex items-center gap-2 cursor-pointer text-xs tracking-wide"
              >
                <input
                  type="radio"
                  name="quality"
                  className="w-3 h-3"
                  onChange={() => setQuality(q)}
                />
                {q}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* CARAT ROW */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div>
          <p className="text-sm mb-2">Center Stone Carat</p>
          <select
            className="bg-[#D9D9D9] text-black w-40 p-2 rounded-lg"
            onChange={(e) => setCenterCarat(e.target.value)}
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
            onChange={(e) => setTotalCarat(e.target.value)}
          >
            <option value="">Select</option>
            <option>1.0</option>
            <option>1.5</option>
            <option>2.0</option>
          </select>
        </div>
      </div>

      {/* PRICE + COMMISSION */}
      <div className="flex justify-between bg-[#D9D9D9] text-black p-4 rounded-lg text-xs font-medium mt-6 tracking-wide">
        <p>Price: ${price.toFixed(2)}</p>
        <p>Commission: ${commission}</p>
      </div>
    </>
  );

  return (
    <div className="w-full min-h-screen bg-[#E5E1DA] pt-24 pb-20 flex flex-col items-center">
      {/* TITLE */}
      <section className="text-center mt-20 mb-2 ">
        <h1 className="text-5xl md:text-5xl font-serif font-light tracking-wide text-[#1a1a1a]">
          TAKSHILA DESIGN STUDIO
        </h1>
        <p className="text-sm mt-2 text-gray-600 mb-6">
          <span className="text-gray-500">
            Bring your ideas to life with our AI Designer
          </span>
        </p>
      </section>

      {/* PILL SWITCH – TWO SEPARATE MODES */}
      <div className="flex mt-8 bg-white rounded-full shadow-md overflow-hidden w-[420px] h-[48px]">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 text-sm tracking-widest transition-all duration-300 ${
            activeTab === "ai"
              ? "bg-black text-white"
              : "bg-white text-gray-500"
          }`}
        >
          AI DESIGNER
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 text-sm tracking-widest transition-all duration-300 ${
            activeTab === "upload"
              ? "bg-black text-white"
              : "bg-white text-gray-500"
          }`}
        >
          ADD YOUR DESIGN
        </button>
      </div>

      {/* ============================= */}
      {/* MODE 1: AI DESIGNER           */}
      {/* ============================= */}
      {activeTab === "ai" && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          {/* LEFT SIDE */}
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop />

            {/* PROMPT + GENERATE */}
            <div className="relative mt-4">
              <textarea
                placeholder="Prompt your jewelry design details here..."
                className="w-full h-40 bg-[#D9D9D9] text-black p-4 rounded-xl"
              />
              <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#3A3A3A] text-white px-10 py-2 rounded-full">
                Generate
              </button>
            </div>
          </div>

          {/* RIGHT PANEL (same for both modes) */}
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
        </div>
      )}

      {/* ============================= */}
      {/* MODE 2: ADD YOUR DESIGN       */}
      {/* ============================= */}
      {activeTab === "upload" && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 px-6">
          {/* LEFT SIDE */}
          <div className="bg-[#6C6C6C] rounded-3xl p-8 text-white">
            <LeftPanelTop />

            {/* UPLOAD WINDOW INSTEAD OF PROMPT */}
            <div className="mt-6 bg-[#4A4A4A] w-full h-48 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center bg-[#D9D9D9] text-black rounded-full text-3xl mb-4">
                +
              </div>
              <button className="px-10 py-2 bg-black text-white rounded-full tracking-wide">
                UPLOAD
              </button>
            </div>
          </div>

          {/* RIGHT PANEL (same as AI mode) */}
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
        </div>
      )}
    </div>
  );
}
