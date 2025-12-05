import React, { useState, useEffect } from "react";

export default function HeroSlider() {
  const images = [
    "assets/ring1.webp",
    "assets/ring2.webp",
    "assets/ring3.webp",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i}`}
            className={`hero-bg-image absolute inset-0 w-full h-full object-cover ${
              i === index ? "active" : ""
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white text-3xl rounded-full p-3 hover:bg-white/10 transition duration-300"
      >
        ←
      </button>
      <button
        onClick={() => setIndex((index + 1) % images.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white text-3xl rounded-full p-3 hover:bg-white/10 transition duration-300"
      >
        →
      </button>
    </section>
  );
}
