import { useState, useEffect } from "react";

export default function HotMeter({
  isRated, // kept for API compatibility (not used anymore)
  average = 50,
  userRating = null,
  onRate,
  isLoggedIn,
  handleOpenModal,
  ratingsCount
}) {
  const [value, setValue] = useState(userRating != null ? userRating * 10 : 0);
  const [isInteracting, setIsInteracting] = useState(false);

  const THUMB_SIZE = 32; // same as w-8 (32px)
  const isHot = value >= 76;

  /* --------------------------------------------------
     🔒 Disable page scroll ONLY while interacting
  -------------------------------------------------- */
  useEffect(() => {
    if (isInteracting) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isInteracting]);

  /* --------------------------------------------------
     🎯 Interaction handlers
  -------------------------------------------------- */
  const handleStart = () => {
    setIsInteracting(true);
  };

  const handleRelease = () => {
    if(!isLoggedIn){
      setValue(0)
      handleOpenModal("login")
    }
    setIsInteracting(false);
    onRate?.(value);
  };

  /* --------------------------------------------------
     🏷 Label helper
  -------------------------------------------------- */
  const getLabel = (v) => {
    if (v <= 20) return "😬 Not It";
    if (v <= 40) return "😐 Meh";
    if (v <= 60) return "🙂 Nice";
    if (v <= 80) return "🤩 Solid";
    return "🔥 Hot";
  };

  /* --------------------------------------------------
     🎨 Filled gradient background
  -------------------------------------------------- */
  const filledBackground = {
    background: `
      linear-gradient(
        to right,
        #ef4444 0%,
        #f59e0b 50%,
        #22c55e 100%
      ),
      linear-gradient(
        to right,
        transparent ${value}%,
        #444 ${value}%
      )
    `,
    backgroundBlendMode: "multiply",
  };

  return (
    <div className="w-full px-2">
      <div className="flex items-center gap-4">
        {/* SLIDER + FAKE THUMB WRAPPER */}
        <div className="relative flex-1">
          {/* RANGE INPUT (native thumb hidden) */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onInput={(e) => setValue(Number(e.target.value))}
            onChange={(e) => setValue(Number(e.target.value))}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onMouseUp={handleRelease}
            onTouchEnd={handleRelease}
            onMouseLeave={isInteracting ? handleRelease : undefined}
            className="w-full appearance-none rounded-full cursor-pointer slider-input"
            style={{
              ...filledBackground,
              WebkitAppearance: "none",
              height: '4px',
            }}
          />

          {/* 🔥 CUSTOM FLAME THUMB */}
          <div
            className="absolute top-1/2 pointer-events-none"
            style={{
              left: `calc(${value}% - ${THUMB_SIZE / 2}px)`,
              right: `calc(${100 - value}% - ${THUMB_SIZE / 2}px)`,
              transform: "translateY(-50%)",
            }}
          >
            <img
              src="/assets/flame.png"
              alt="flame"
              className={`w-8 h-8 ${
                isHot ? "animate-[pulseGlow_1.2s_ease-in-out_infinite]" : ""
              }`}
            />
          </div>
        </div>

        {/* LABEL + AVERAGE */}
        <div className="flex items-center gap-2 w-[140px] justify-end shrink-0">
          <span className="text-sm text-white/80 whitespace-nowrap">{getLabel(Number((average*10)).toFixed(1))}</span>
          <span className="text-sm font-semibold whitespace-nowrap">({ratingsCount})</span>
        </div>
      </div>

      {/* HIDE NATIVE THUMB */}
      <style>{`
        .slider-input {
          display: block;
          height: 32px;
        }
        
        input[type=range] {
          -webkit-tap-highlight-color: transparent;
        }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 44px;
          height: 44px;
          background: transparent;
          cursor: pointer;
          border: none;
          opacity: 0;
        }
        
        input[type=range]::-moz-range-thumb {
          appearance: none;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0;
        }
        
        input[type=range]::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          height: 32px;
        }
        
        input[type=range]::-moz-range-track {
          height: 32px;
        }
      `}</style>

      {/* 🔥 Flame glow animation */}
      <style>{`
        @keyframes pulseGlow {
          0% {
            filter:
              drop-shadow(0 0 10px rgba(255, 0, 0, 0.8))
              drop-shadow(0 0 20px rgba(255, 30, 30, 0.9));
          }
          50% {
            filter:
              drop-shadow(0 0 22px rgba(255, 0, 0, 1))
              drop-shadow(0 0 36px rgba(255, 0, 0, 0.9))
              drop-shadow(0 0 48px rgba(255, 60, 60, 0.8));
          }
          100% {
            filter:
              drop-shadow(0 0 10px rgba(255, 0, 0, 0.8))
              drop-shadow(0 0 20px rgba(255, 30, 30, 0.9));
          }
        }
      `}</style>
    </div>
  );
}