import { useState } from "react";

export default function HotMeter({ average = 50, userRating = null, onRate }) {
  // Slider always starts from LEFT
  const [value, setValue] = useState(0);
  const [locked, setLocked] = useState(!!userRating);

  const handleRelease = () => {
    if (locked) return;

    setLocked(true);
    onRate?.(value);
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
    <div className="w-full px-2 mt-4">
      <div className="flex items-center gap-4">
        {/* LEFT — SLIDER */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            disabled={locked}
            onChange={(e) => setValue(Number(e.target.value))}
            onMouseUp={handleRelease}
            onTouchEnd={handleRelease}
            className="w-full appearance-none h-1 rounded-full cursor-pointer"
            style={filledBackground}
          />
        </div>

        {/* RIGHT — LABEL + (AVERAGE ONLY AFTER RATING) */}
        <div className="flex items-center gap-2 min-w-[90px] justify-end">
          <span className="text-sm text-white/80">{getLabel(value)}</span>

          {locked && (
            <span className="text-sm font-semibold">{Math.round(average)}</span>
          )}
        </div>
      </div>

      {/* THUMB STYLE */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: ${locked ? "#555" : "#fff"};
          border-radius: 50%;
          cursor: ${locked ? "default" : "pointer"};
          box-shadow: 0 0 0 2px #000;
        }
      `}</style>
    </div>
  );
}
