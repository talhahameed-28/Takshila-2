import React, { useState } from "react";
import HeroSlider from "../components/HeroSlider";
import ExperienceSection from "../components/ExperienceSection";
import StoriesSection from "../components/StoriesSection";
import VideoSection from "../components/VideoSection";
import SecondSlider from "../components/SecondSlider";
import VideoLoader from "../components/VideoLoader"; // ✅ added

export default function Home() {
  const [showLoader, setShowLoader] = useState(
    !localStorage.getItem("hasSeenHomeLoader")
  );

  return (
    <div>
      {showLoader && <VideoLoader onFinish={() => setShowLoader(false)} />}

      {!showLoader && (
        <>
          <VideoSection />
          <HeroSlider />
          <SecondSlider />
          <ExperienceSection />
          <StoriesSection />
        </>
      )}
    </div>
  );
}
