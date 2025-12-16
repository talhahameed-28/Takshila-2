import React, { useEffect, useRef, useState } from "react";

/* ===================== ROADMAP A — COMMUNITY FLOW ===================== */
const COMMUNITY_STEPS = [
  {
    title: "Design",
    description:
      "Create your design or bring your vision to life using our AI-assisted design tools.",
    side: "right",
    icon: "✏️",
  },
  {
    title: "Post on Community",
    description:
      "Share your creation with a vibrant community and get instant engagement.",
    side: "left",
    icon: "💬",
  },
  {
    title: "Shoppers Choose You",
    description:
      "Customers connect with your design, follow its crafting journey, and make it theirs.",
    side: "right",
    icon: "🛍️",
  },
  {
    title: "Royalty",
    description:
      "Earn royalties and commissions whenever your design is purchased or commissioned.",
    side: "left",
    icon: "💰",
  },
  {
    title: "Create & Deliver",
    description:
      "We craft your design with master artisans and deliver luxury to customers.",
    side: "right",
    icon: "🚚",
  },
];

/* ===================== ROADMAP B — CRAFTING JOURNEY ===================== */
const CRAFTING_STEPS = [
  {
    title: "Design your Ring",
    description:
      "Design your ring from scratch with Takshila — use our AI, collaborate with a community designer, or upload your own design.",
    side: "left",
    icon: "✍️",
  },
  {
    title: "Dynamic Pricing",
    description:
      "Pay only for what you choose — select materials, stone size, and quality, and see real-time pricing updates.",
    side: "right",
    icon: "📈",
  },
  {
    title: "Review & Approve 3D Model",
    description:
      "Ensure 100% accuracy by reviewing a 3D model of your design, exploring it from every angle, and refining every detail.",
    side: "left",
    icon: "🔄",
  },
  {
    title: "Master Artisans of Takshila",
    description:
      "Our artisans create a 3D printed mold and carefully shape a setting to bring your vision to life.",
    side: "right",
    icon: "🛠️",
  },
  {
    title: "Sparkle of the Stones",
    description:
      "As artisans source stones to match your design, get an early glimpse through a video showcasing selected gems.",
    side: "left",
    icon: "💎",
  },
  {
    title: "Finishing Details",
    description:
      "Receive glimpses of final moments perfecting a masterpiece. Watch as your dream jewellery becomes reality.",
    side: "right",
    icon: "✨",
  },
];

/* ===================== LAYOUT CONSTANTS ===================== */
const STEP_GAP = 160;
const TOP_OFFSET = 120;
const CIRCLE_SIZE = 56;

export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);
  const [roadmapType, setRoadmapType] = useState("vertical"); // vertical | flow

  const ACTIVE_STEPS =
    roadmapType === "vertical" ? COMMUNITY_STEPS : CRAFTING_STEPS;

  const firstTop = TOP_OFFSET;
  const lastTop = TOP_OFFSET + (ACTIVE_STEPS.length - 1) * STEP_GAP;
  const totalHeight = lastTop + TOP_OFFSET;

  /* ===================== SCROLL TRIGGER ===================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ===================== LINE ANIMATION ===================== */
  useEffect(() => {
    if (!startAnimation) return;

    const duration = 2200;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min(((time - start) / duration) * 100, 100);
      setLineProgress(progress);
      if (progress < 100) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [startAnimation, roadmapType]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b to-black from-neutral-700  pt-44 pb-32 flex justify-center overflow-hidden"
    >
      {/* ================= SWITCH ================= */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1 mb-6">
          <button
            onClick={() => setRoadmapType("vertical")}
            className={`px-5 py-2 rounded-full text-sm transition
              ${
                roadmapType === "vertical"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
          >
            Community Flow
          </button>

          <button
            onClick={() => setRoadmapType("flow")}
            className={`px-5 py-2 rounded-full text-sm transition
              ${
                roadmapType === "flow"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
          >
            Crafting Journey
          </button>
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/70 tracking-widest uppercase mb-3">
          At Takshila
        </p>

        <div className="relative inline-flex items-center justify-center mb-6 px-12 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-wide whitespace-nowrap">
            {roadmapType === "vertical"
              ? "Start Your Jewellery Line"
              : "Experience Personal Luxury"}
          </h2>
        </div>

        <p className="text-white/70 text-lg">
          {roadmapType === "vertical"
            ? "In minutes, with $0, Today!"
            : "Crafted with precision, passion, and mastery"}
        </p>
      </div>

      {/* ================= TIMELINE ================= */}
      <div
        className="relative w-full max-w-6xl mt-40"
        style={{ height: totalHeight }}
      >
        {/* MAIN LINE */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-white/30"
          style={{
            top: firstTop + CIRCLE_SIZE / 2,
            height: ((lastTop - firstTop) * lineProgress) / 100,
          }}
        />

        {ACTIVE_STEPS.map((step, index) => {
          const top = TOP_OFFSET + index * STEP_GAP;
          const visible =
            lineProgress >= ((top - firstTop) / (lastTop - firstTop)) * 100;

          return (
            <div
              key={index}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top }}
            >
              {/* CIRCLE + CONNECTOR */}
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full border border-white/60
                  flex items-center justify-center transition-all duration-500
                  ${
                    visible
                      ? "opacity-100 scale-100 shadow-[0_0_25px_rgba(255,255,255,0.85)]"
                      : "opacity-0 scale-75"
                  }`}
                >
                  <span className="text-xl text-white">{step.icon}</span>
                </div>

                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-white/30
                  ${step.side === "left" ? "right-full" : "left-full"}
                  ${visible ? "w-28 opacity-100" : "w-0 opacity-0"}`}
                />
              </div>

              {/* CARD */}
              <div
                className={`absolute top-1/2 -translate-y-1/2
                w-[420px] rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl
                transition-all duration-500
                ${
                  step.side === "left"
                    ? "right-[calc(100%+7rem)] text-right"
                    : "left-[calc(100%+7rem)] text-left"
                }
                ${
                  visible
                    ? "opacity-100 translate-x-0"
                    : step.side === "left"
                    ? "opacity-0 translate-x-8"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <h3 className="text-white text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
