// VideoLoader.jsx
import { useEffect, useRef } from "react";

const VideoLoader = ({ onFinish }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const hasSeenLoader = localStorage.getItem("hasSeenHomeLoader");
    if (hasSeenLoader) {
      onFinish();
      return;
    }

    const img = imgRef.current;
    const startTime = performance.now();

    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      const minDuration = 1200;
      const remaining = Math.max(minDuration - loadTime, 0);

      setTimeout(() => {
        localStorage.setItem("hasSeenHomeLoader", "true");
        onFinish();
      }, remaining);
    };

    img.addEventListener("load", handleLoad);
    return () => img.removeEventListener("load", handleLoad);
  }, [onFinish]);

  return (
    <div className="loader-container">
      <img
        ref={imgRef}
        src="/assets/loader.gif"
        alt="Loading..."
        className="loader-video"
      />
    </div>
  );
};

export default VideoLoader;
