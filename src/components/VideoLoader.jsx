import { useEffect, useRef } from "react";

const VideoLoader = ({ onFinish }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => {
      onFinish(); // hide loader when video ends
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onFinish]);

  return (
    <div className="loader-container">
      <video
        ref={videoRef}
        src="/assets/loader.mp4" // 🔥 Updated path
        autoPlay
        muted
        playsInline
        className="loader-video"
      />
    </div>
  );
};

export default VideoLoader;
