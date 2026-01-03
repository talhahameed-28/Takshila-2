import { useState } from "react";

export default function HotMeter({ average = 50, userRating = null, onRate }) {
  const [value, setValue] = useState(userRating ?? average);
  const [locked, setLocked] = useState(!!userRating);
  const [bounce, setBounce] = useState(false);

  const handleRelease = () => {
    if (locked) return;

    setLocked(true);
    onRate?.(value);

    // trigger arrow bounce
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  const getLabel = (v) => {
    if (v <= 25) return "😬 Not great";
    if (v <= 50) return "😐 Meh";
    if (v <= 75) return "🙂 Nice";
    return "🔥 Hot";
  };

  // 🔥 Dynamic gradient fill
  const sliderBackground = {
    background: `
      linear-gradient(
        to right,
        #ef4444 0%,
        #f59e0b 50%,
        #22c55e 100%
      )`,
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
    <div className="relative w-full px-6 mt-4">
      {/* RANGE */}
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
        style={locked ? filledBackground : filledBackground}
      />

      {/* THUMB */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: ${locked ? "#555" : "#fff"};
          border-radius: 50%;
          cursor: ${locked ? "default" : "pointer"};
          position: relative;
          z-index: 2;
          box-shadow: 0 0 0 2px #000;
        }
      `}</style>

      {/* AVERAGE MARKER */}
      <div
        className={`absolute top-[-16px] flex flex-col items-center transition-transform duration-300
          ${bounce ? "animate-bounce" : ""}
        `}
        style={{ left: `calc(${average}% - 8px)` }}
      >
        {/* ARROW */}
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-white" />

        {/* VALUE */}
        <span className="text-xs mt-1 text-white/80">
          {Math.round(average)}
        </span>
      </div>

      {/* LABEL */}
      <div className="text-sm text-white/80 mt-2">{getLabel(value)}</div>
    </div>
  );
}
