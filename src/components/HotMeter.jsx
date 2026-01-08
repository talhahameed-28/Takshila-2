import { useState, useRef } from "react";

export default function HotMeter({ isRated,average = 50, userRating = null, onRate }) {
  const [value, setValue] = useState(userRating!=null?userRating*10:0);
  const [locked, setLocked] = useState(!!isRated);
  const THUMB_SIZE = 32; // same as w-8 (32px)

  const isHot = value >= 76;
  const lastTapRef = useRef(0);

  const handleRelease = () => {
    if (locked) return;
    setLocked(true);
    onRate?.(value);
  };

  // 🔓 Double tap / double click to unlock
  const handleUnlockAttempt = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLocked(false);
    }
    lastTapRef.current = now;
  };

  const getLabel = (v) => {
    if (v <= 25) return "😬 Not great";
    if (v <= 50) return "😐 Meh";
    if (v <= 75) return "🙂 Nice";
    return "🔥 Hot";
  };

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
          {/* RANGE INPUT (thumb hidden) */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            disabled={locked}
            onChange={(e) => setValue(Number(e.target.value))}
            onMouseUp={handleRelease}
            onTouchEnd={handleRelease}
            onDoubleClick={handleUnlockAttempt}
            onTouchStart={handleUnlockAttempt}
            className="w-full appearance-none h-1 rounded-full cursor-pointer"
            style={filledBackground}
          />

          {/* 🔥 CUSTOM FLAME THUMB */}
          <div
            className="absolute top-1/2 pointer-events-none"
            style={{
              left: `calc(${value}% - ${THUMB_SIZE / 2}px)`,
              maxLeft: `calc(100% - ${THUMB_SIZE}px)`,
              right: `calc(${100 - value}% - ${THUMB_SIZE}px)`,
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
        <div className="flex items-center gap-2 min-w-[90px] justify-end">
          <span className="text-sm text-white/80">{getLabel(value)}</span>
          {locked && (
            <span className="text-sm font-semibold">{Math.round(average)}</span>
          )}
        </div>
      </div>

      {/* Hint 
      {locked && (
        <p className="text-xs text-white/50 mt-1 text-right">
          Double tap to change rating
        </p>
      )}
        */}

      {/* HIDE NATIVE THUMB */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 0;
          height: 0;
        }
        input[type=range]::-moz-range-thumb {
          appearance: none;
          width: 0;
          height: 0;
        }
      `}</style>

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
