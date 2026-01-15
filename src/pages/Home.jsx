import React, { useState } from "react";
import HeroSlider from "../components/HeroSlider";
import ExperienceSection from "../components/ExperienceSection";
import StoriesSection from "../components/StoriesSection";
import VideoSection from "../components/VideoSection";
import SecondSlider from "../components/SecondSlider";
import VideoLoader from "../components/VideoLoader"; // ✅ added
import { Helmet } from "react-helmet-async";

export default function Home() {
  const [showLoader, setShowLoader] = useState(
    !localStorage.getItem("hasSeenHomeLoader")
  );

  return (
    <>
    {/* <Helmet>
        <title> Takshila | AI-Powered Custom Diamond & Gold Jewelry Marketplace </title>
      <meta name="description" content="AI-powered custom jewelry platform – create unique pieces, from rings, necklaces, pendants, and bracelets to diamond jewelry. Experience a behind-the-scenes crafting journey, transparent pricing, and launch your own jewelry line." />
      <meta name="keywords" content="AI jewelry design, custom jewelry, personalized jewelry, Rings, Diamond jewelry, Luxury jewelry, Bespoke jewelry online" />
      <link rel="canonical" href="https://takshila.cloud/" />
      </Helmet> */}
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
    </>
  );
}
