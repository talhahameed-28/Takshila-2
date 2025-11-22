import React, { useState, useMemo, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";

/* Helpers */
const parsePrice = (p) =>
  typeof p === "string" ? Number(p.replace(/[^0-9.-]+/g, "")) : Number(p || 0);

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : n;

/* ------------------ JEWELLERY DATA (UNCHANGED) ------------------ */

const jewelleryData = [
  {
    id: 1,
    image: "assets/jewel1.jpg",
    name: "Krishna",
    designer: "Aikansh Tyagi",
    price: "$7263.28",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "9.0",
    diamondShape: "Round",
    quality: 85,
    centerStoneCarat: 4,
    totalCaratWeight: 5,
    description:
      "A regal 18K yellow gold ring with a brilliant round center stone. Intricate hand-engraved shoulders and fine micro-pave create a celestial glow.",
  },
  {
    id: 2,
    image: "assets/jewel2.jpg",
    name: "Diamond Band",
    designer: "Sanchit",
    price: "$8798.32",
    goldType: "White",
    goldKarat: "14K",
    ringSize: "7.5",
    diamondShape: "Oval",
    quality: 75,
    centerStoneCarat: 3,
    totalCaratWeight: 4.5,
    description:
      "A refined 14K white gold band set with graduated oval diamonds — perfect for stacking or a minimalist bridal look.",
  },
  {
    id: 3,
    image: "assets/jewel3.jpg",
    name: "J's Ring",
    designer: "Jeshl Adeshra",
    price: "$3678.40",
    goldType: "Rose",
    goldKarat: "10K",
    ringSize: "6.5",
    diamondShape: "Princess",
    quality: 60,
    centerStoneCarat: 2.5,
    totalCaratWeight: 3,
    description:
      "A warm 10K rose gold ring with a princess-cut centerpiece and crisp geometric lines — modern yet romantic.",
  },
  {
    id: 4,
    image: "assets/jewel4.jpg",
    name: "Cat Elegance",
    designer: "Amara Rao",
    price: "$4920.55",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "8.0",
    diamondShape: "Marquise",
    quality: 78,
    centerStoneCarat: 3,
    totalCaratWeight: 4,
    description:
      "Inspired by feline grace, this marquise-cut ring in 18K yellow gold showcases fluid lines and a delicate bezel setting.",
  },
  {
    id: 5,
    image: "assets/jewel5.jpg",
    name: "Golden Grace",
    designer: "Arnav Kapoor",
    price: "$5999.99",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "6.25",
    diamondShape: "Cushion",
    quality: 88,
    centerStoneCarat: 3.5,
    totalCaratWeight: 4.8,
    description:
      "An elegant cushion-cut center in 18K yellow gold with cathedral prongs and hand-applied milgrain edging for vintage flair.",
  },
  {
    id: 6,
    image: "assets/jewel6.jpg",
    name: "Royal Spark",
    designer: "Mira Desai",
    price: "$7645.22",
    goldType: "White",
    goldKarat: "18K",
    ringSize: "7.25",
    diamondShape: "Round",
    quality: 92,
    centerStoneCarat: 4.2,
    totalCaratWeight: 5.3,
    description:
      "A luxury 18K white gold creation centered around a high-clarity round diamond — classic proportions and expert setting.",
  },
  {
    id: 7,
    image: "assets/jewel7.jpg",
    name: "Opal Charm",
    designer: "Ananya Jain",
    price: "$5380.00",
    goldType: "Rose",
    goldKarat: "14K",
    ringSize: "6.75",
    diamondShape: "Cabochon",
    quality: 68,
    centerStoneCarat: 2.2,
    totalCaratWeight: 2.5,
    description:
      "A luminous opal cabochon set in 14K rose gold, accented with tiny round melee diamonds for a soft iridescent effect.",
  },
  {
    id: 8,
    image: "assets/jewel8.jpg",
    name: "Emerald Glow",
    designer: "Rohit Verma",
    price: "$6890.15",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "8.5",
    diamondShape: "Emerald",
    quality: 86,
    centerStoneCarat: 3.8,
    totalCaratWeight: 4.6,
    description:
      "A statement 18K yellow gold ring featuring an emerald-cut center stone with halo accents — refined geometry and rich tone.",
  },
  {
    id: 9,
    image: "assets/jewel9.jpg",
    name: "Ruby Luxe",
    designer: "Nisha Patel",
    price: "$7220.88",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "7.0",
    diamondShape: "Round",
    quality: 90,
    centerStoneCarat: 3.6,
    totalCaratWeight: 4.7,
    description:
      "A vivid ruby center set in warm 18K yellow gold surrounded by fine pavé diamonds — bold color, expert workmanship.",
  },
  {
    id: 10,
    image: "assets/jewel10.jpg",
    name: "Celestial Band",
    designer: "Meera Chauhan",
    price: "$8333.19",
    goldType: "White",
    goldKarat: "18K",
    ringSize: "6.0",
    diamondShape: "Cushion",
    quality: 95,
    centerStoneCarat: 5.0,
    totalCaratWeight: 6.2,
    description:
      "A premium 18K white gold band with a cushion-cut star center — exceptional clarity and hand-set melee for a celestial finish.",
  },
  {
    id: 11,
    image: "assets/jewel11.jpg",
    name: "Aurora Ring",
    designer: "Ishaan Sharma",
    price: "$6900.25",
    goldType: "Rose",
    goldKarat: "14K",
    ringSize: "8.25",
    diamondShape: "Oval",
    quality: 80,
    centerStoneCarat: 3.2,
    totalCaratWeight: 4.0,
    description:
      "An oval-cut center mounted in 14K rose gold with delicate openwork shoulders — modern romanticism at its best.",
  },
  {
    id: 12,
    image: "assets/jewel12.jpg",
    name: "Pearl Dusk",
    designer: "Diya Kapoor",
    price: "$4120.70",
    goldType: "Yellow",
    goldKarat: "10K",
    ringSize: "6.0",
    diamondShape: "Pearl",
    quality: 65,
    centerStoneCarat: 1.8,
    totalCaratWeight: 2.0,
    description:
      "A classic pearl ring set in 10K yellow gold with tiny diamond accents — understated luxury with heirloom appeal.",
  },
  {
    id: 13,
    image: "assets/jewel13.jpg",
    name: "Vintage Muse",
    designer: "Kabir Mehta",
    price: "$5322.90",
    goldType: "Yellow",
    goldKarat: "14K",
    ringSize: "7.75",
    diamondShape: "Old Mine",
    quality: 72,
    centerStoneCarat: 2.7,
    totalCaratWeight: 3.2,
    description:
      "A vintage-inspired 14K yellow gold ring with an old mine cut center and ornate filigree for nostalgic elegance.",
  },
  {
    id: 14,
    image: "assets/jewel14.jpg",
    name: "Rose Gold Whisper",
    designer: "Mitali Desai",
    price: "$6305.45",
    goldType: "Rose",
    goldKarat: "18K",
    ringSize: "6.5",
    diamondShape: "Heart",
    quality: 84,
    centerStoneCarat: 3.0,
    totalCaratWeight: 3.9,
    description:
      "A romantic 18K rose gold piece featuring a heart-shaped center and soft pavé shoulders — feminine and charming.",
  },
  {
    id: 15,
    image: "assets/jewel15.jpg",
    name: "Golden Empress",
    designer: "Rajvi Singh",
    price: "$8490.00",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "9.5",
    diamondShape: "Round",
    quality: 93,
    centerStoneCarat: 4.8,
    totalCaratWeight: 5.9,
    description:
      "A regal statement in 18K yellow gold with a large round center, reinforced setting, and mirror-polished finish for royal presence.",
  },
  {
    id: 16,
    image: "assets/jewel16.jpg",
    name: "Crimson Shine",
    designer: "Yash Tandon",
    price: "$5795.55",
    goldType: "White",
    goldKarat: "14K",
    ringSize: "7.0",
    diamondShape: "Cabochon",
    quality: 70,
    centerStoneCarat: 2.0,
    totalCaratWeight: 2.7,
    description:
      "A 14K white gold ring featuring a smooth cabochon ruby with minimal accents — bold color in clean form.",
  },
  {
    id: 17,
    image: "assets/jewel17.jpg",
    name: "Moonlit Tiara",
    designer: "Reema Bhatia",
    price: "$9600.99",
    goldType: "White",
    goldKarat: "18K",
    ringSize: "6.75",
    diamondShape: "Marquise",
    quality: 96,
    centerStoneCarat: 5.5,
    totalCaratWeight: 7.1,
    description:
      "An opulent 18K white gold tiara-style ring, heavily set with marquise and round diamonds — true couture craftsmanship.",
  },
  {
    id: 18,
    image: "assets/jewel18.jpg",
    name: "Silver Mirage",
    designer: "Aarav Khanna",
    price: "$4775.22",
    goldType: "Rose",
    goldKarat: "10K",
    ringSize: "8.0",
    diamondShape: "Round",
    quality: 66,
    centerStoneCarat: 2.1,
    totalCaratWeight: 3.0,
    description:
      "A delicate 10K rose gold ring with a center round gem and brushed metal contrasts for a contemporary finish.",
  },
  {
    id: 19,
    image: "assets/jewel19.jpg",
    name: "Ocean Bloom",
    designer: "Kavya Nair",
    price: "$6350.35",
    goldType: "Yellow",
    goldKarat: "14K",
    ringSize: "7.25",
    diamondShape: "Pear",
    quality: 82,
    centerStoneCarat: 3.3,
    totalCaratWeight: 4.2,
    description:
      "A pear-shaped center in 14K yellow gold with sweeping openwork inspired by oceanic petals — fluid and elegant.",
  },
  {
    id: 20,
    image: "assets/jewel20.jpg",
    name: "Royal Crescent",
    designer: "Tanish Malhotra",
    price: "$7120.50",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "9.0",
    diamondShape: "Crescent",
    quality: 89,
    centerStoneCarat: 4.0,
    totalCaratWeight: 5.0,
    description:
      "A sculptural crescent motif ring in 18K yellow gold — center stone sits within a crescent halo that enhances light return.",
  },
  {
    id: 21,
    image: "assets/jewel21.jpg",
    name: "Diamond Crest",
    designer: "Aarohi Ghosh",
    price: "$7921.12",
    goldType: "White",
    goldKarat: "18K",
    ringSize: "7.5",
    diamondShape: "Princess",
    quality: 91,
    centerStoneCarat: 4.1,
    totalCaratWeight: 5.6,
    description:
      "A precision-cut princess center in 18K white gold with angular accents and a refined, geometric setting.",
  },
  {
    id: 22,
    image: "assets/jewel22.jpg",
    name: "Golden Ivy",
    designer: "Ira Sharma",
    price: "$6012.08",
    goldType: "Yellow",
    goldKarat: "14K",
    ringSize: "6.5",
    diamondShape: "Round",
    quality: 79,
    centerStoneCarat: 3.0,
    totalCaratWeight: 3.8,
    description:
      "Delicate ivy-inspired leaf motifs in 14K yellow gold surround a bright round center — handcrafted botanical detail.",
  },
  {
    id: 23,
    image: "assets/jewel23.jpg",
    name: "Petal Radiance",
    designer: "Zara Ali",
    price: "$4780.64",
    goldType: "Rose",
    goldKarat: "14K",
    ringSize: "7.0",
    diamondShape: "Cushion",
    quality: 74,
    centerStoneCarat: 2.4,
    totalCaratWeight: 3.0,
    description:
      "A cushion-cut center framed by petal-shaped shoulders in 14K rose gold — soft textures and refined curves.",
  },
  {
    id: 24,
    image: "assets/jewel24.jpg",
    name: "Twilight Band",
    designer: "Aryan Dutta",
    price: "$5625.55",
    goldType: "White",
    goldKarat: "14K",
    ringSize: "6.0",
    diamondShape: "Round",
    quality: 76,
    centerStoneCarat: 2.8,
    totalCaratWeight: 3.6,
    description:
      "A modern white gold band with high-polish finish and flush-set round diamonds for low-profile brilliance.",
  },
  {
    id: 25,
    image: "assets/jewel25.jpg",
    name: "Halo Whisper",
    designer: "Esha Kapoor",
    price: "$7008.44",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "8.0",
    diamondShape: "Round",
    quality: 87,
    centerStoneCarat: 3.6,
    totalCaratWeight: 4.4,
    description:
      "A halo-style classic in 18K yellow gold — a luminous round center encircled by delicate accent stones for amplified sparkle.",
  },
  {
    id: 26,
    image: "assets/jewel26.jpg",
    name: "Eternal Flame",
    designer: "Nikhil Joshi",
    price: "$8433.99",
    goldType: "White",
    goldKarat: "18K",
    ringSize: "9.0",
    diamondShape: "Radiant",
    quality: 94,
    centerStoneCarat: 4.6,
    totalCaratWeight: 5.8,
    description:
      "A bold radiant-cut center in 18K white gold with stepped facets that capture intense fire and scintillation.",
  },
  {
    id: 27,
    image: "assets/jewel27.jpg",
    name: "Golden Lattice",
    designer: "Ria Patel",
    price: "$6750.22",
    goldType: "Yellow",
    goldKarat: "14K",
    ringSize: "7.25",
    diamondShape: "Emerald",
    quality: 81,
    centerStoneCarat: 3.4,
    totalCaratWeight: 4.3,
    description:
      "Intricate latticework in 14K yellow gold frames an emerald-cut center for architectural elegance and warmth.",
  },
  {
    id: 28,
    image: "assets/jewel28.jpg",
    name: "Starlight Charm",
    designer: "Vihaan Mehta",
    price: "$5902.45",
    goldType: "Rose",
    goldKarat: "14K",
    ringSize: "6.75",
    diamondShape: "Round",
    quality: 77,
    centerStoneCarat: 2.9,
    totalCaratWeight: 3.5,
    description:
      "A whimsical rose-gold ring with a starburst diamond motif — playful yet crafted with refined detail.",
  },
  {
    id: 29,
    image: "assets/jewel29.jpg",
    name: "Enchanted Glow",
    designer: "Tanvi Sood",
    price: "$7600.75",
    goldType: "Yellow",
    goldKarat: "18K",
    ringSize: "8.5",
    diamondShape: "Oval",
    quality: 88,
    centerStoneCarat: 3.9,
    totalCaratWeight: 4.9,
    description:
      "A luminous oval center in 18K yellow gold with tapered baguette accents for an elongated, elegant profile.",
  },
  {
    id: 30,
    image: "assets/jewel30.jpg",
    name: "Majestic Halo",
    designer: "Devansh Rao",
    price: "$8325.40",
    goldType: "White",
    goldKarat: "18K",
    ringSize: "7.0",
    diamondShape: "Round",
    quality: 95,
    centerStoneCarat: 4.5,
    totalCaratWeight: 6.0,
    description:
      "A high-carat white gold halo masterpiece with exceptional center clarity and expertly matched accent stones.",
  },
];


/* ------------------------------------------------------------------- */

export default function Community() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const totalPages = Math.ceil(jewelleryData.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = jewelleryData.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  const [selected, setSelected] = useState(null);

  // Customization states
  const [goldType, setGoldType] = useState("Yellow");
  const [goldKarat, setGoldKarat] = useState("18K");
  const [quality, setQuality] = useState(80);
  const [centerStoneCarat, setCenterStoneCarat] = useState(1);
  const [totalCaratWeight, setTotalCaratWeight] = useState(5);

  // ⭐ Wishlist Context
  const { wishlistItems, toggleWishlist } = useWishlist();

  /* Lock scroll when modal opens */
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [selected]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  /* Pricing logic (unchanged) */
  const pricing = useMemo(() => {
    if (!selected) return null;

    const basePrice = parsePrice(selected.price) || 0;
    const baseMat = basePrice * 0.55;
    const baseCraft = basePrice * 0.18;
    const baseOther = basePrice * 0.12;

    const karatM = { "10K": 0.65, "14K": 0.85, "18K": 1.0 };
    const typeM = { White: 1.05, Yellow: 1.0, Rose: 0.98 };

    const kar = karatM[goldKarat] || 1.0;
    const typ = typeM[goldType] || 1.0;

    const metalCost = baseMat * kar * typ * (totalCaratWeight / 5);
    const qualityFactor = 0.5 + (quality / 100) * 1.6;
    const qualityCost = baseCraft * (qualityFactor - 1);
    const workingCharges = 25 * totalCaratWeight;
    const settingCost = 150;
    const certification = 200;
    const shipping = 50;
    const overhead = baseOther;

    const total =
      metalCost +
      qualityCost +
      workingCharges +
      settingCost +
      certification +
      shipping +
      overhead;

    return {
      total: Number(total.toFixed(2)),
      metalCost: Number(metalCost.toFixed(2)),
      qualityCost: Number(qualityCost.toFixed(2)),
      workingCharges: Number(workingCharges.toFixed(2)),
      settingCost,
      certification,
      shipping,
      overhead,
    };
  }, [selected, goldType, goldKarat, quality, totalCaratWeight]);

  const qualityLabel = (q) =>
    q >= 76 ? "Excellent" : q >= 41 ? "Premium" : "Good";

  /* ------------------------------------------------------------------- */

  return (
    <div className="bg-[#e5e2df] text-[#1a1a1a] min-h-screen flex flex-col font-serif">
      {/* Page header */}
      <section className="text-center pt-40 mb-20">
        <h1 className="text-5xl font-light tracking-wide text-[#1a1a1a]">
          EXPLORE THE CREATIONS
        </h1>
        <p className="text-sm mt-3 text-[#1a1a1a]/70">
          Discover designs crafted by our talented community members.
        </p>
      </section>

      {/* Grid */}
      <main className="flex-grow px-6 md:px-12 lg:px-20 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {currentCards.map((item) => {
            const isWishlisted = wishlistItems.some((w) => w.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="cursor-pointer group rounded-3xl border border-[#ccc] bg-[#f7f6f5] hover:bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-t-3xl"
                />

                <div className="p-6 flex flex-col justify-between min-h-[150px]">
                  <div>
                    <h2 className="text-lg font-semibold uppercase">
                      {item.name}
                    </h2>
                    <p className="text-sm text-[#1a1a1a]/80 flex items-center gap-2 mt-1">
                      <img
                        src="assets/user.svg"
                        alt="user"
                        className="w-4 h-4 opacity-70"
                      />
                      {item.designer}
                    </p>
                    <p className="text-xs text-[#1a1a1a]/60 mt-2 italic">
                      Tap to view details
                    </p>
                  </div>

                  {/* Price + Wishlist */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-[#1a1a1a]">
                      {item.price}
                    </span>

                    <div className="flex items-center gap-3">
                      {/* ❤️ Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        className={`w-9 h-9 flex items-center justify-center rounded-full border transition 
        ${
          isWishlisted
            ? "bg-neutral-900 border-neutral-950"
            : "bg-gray-300 border-gray-400 hover:bg-gray-500"
        }`}
                      >
                        <img
                          src="assets/wishlist.svg"
                          alt="wishlist"
                          className="w-5 h-5"
                        />
                      </button>

                      {/* 🛒 Buy Now Button (opens modal only) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(item); // ← opens modal
                        }}
                        className="px-5 py-2 bg-[#555555] hover:bg-[#000000] text-white text-sm rounded-full 
                 transition shadow-md hover:shadow-lg active:scale-95"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-14">
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
      </main>

      {/* MODAL (unchanged except Buy Now removed) */}
      {selected && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-[50]">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-blurFade z-[40]"
            onClick={() => setSelected(null)}
          />

          {/* MODAL */}
          <div
            className="relative w-full max-w-6xl mx-auto rounded-t-3xl md:rounded-3xl
                       bg-gradient-to-br from-[#2E4B45]/95 to-[#1D5049]/90 text-white font-serif
                       border border-white/10 shadow-2xl p-6 md:p-10 mt-20 overflow-hidden
                       z-[45] animate-slideUp"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* LEFT */}
              <div>
                <div className="rounded-2xl overflow-hidden bg-white/10 p-2">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-[360px] object-cover rounded-xl"
                  />
                </div>
                <h2 className="mt-6 text-3xl font-light tracking-wide">
                  {selected.name}
                </h2>
                <p className="text-[#b6d2c9] text-sm mt-1">
                  Designed by {selected.designer}
                </p>
                <p className="text-white/80 text-sm mt-4">
                  {selected.description}
                </p>
              </div>

              {/* MIDDLE — customization stays unchanged */}
              <div>{/* ... your customization UI ... */}</div>

              {/* RIGHT — Pricing */}
              <div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                  <h3 className="text-xl font-medium mb-4 text-white">
                    Price Summary
                  </h3>

                  {pricing && (
                    <div className="space-y-3 text-sm text-white/90">
                      <div className="flex justify-between">
                        <span>Metal Cost</span>
                        <span>{fmt(pricing.metalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Cost</span>
                        <span>{fmt(pricing.qualityCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Working Charges</span>
                        <span>{fmt(pricing.workingCharges)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Setting Cost</span>
                        <span>{fmt(pricing.settingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certification</span>
                        <span>{fmt(pricing.certification)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{fmt(pricing.shipping)}</span>
                      </div>
                      <div className="border-t border-white/20 mt-3 pt-3 flex justify-between">
                        <span>Total</span>
                        <span className="text-2xl font-bold text-[#b6d2c9]">
                          {fmt(pricing.total)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Animations */}
          <style>{`
            @keyframes slideUp {
              0% { opacity: 0; transform: translateY(40px) scale(0.97); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes blurFade {
              0% { opacity: 0; backdrop-filter: blur(0px); }
              100% { opacity: 1; backdrop-filter: blur(10px); }
            }
            .animate-slideUp { animation: slideUp 0.6s cubic-bezier(.2,.9,.28,1) both; }
            .animate-blurFade { animation: blurFade 0.6s ease-out both; }
          `}</style>
        </div>
      )}
    </div>
  );
}
