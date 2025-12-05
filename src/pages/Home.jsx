import React from "react";
import HeroSlider from "../components/HeroSlider";
import ExperienceSection from "../components/ExperienceSection";
import StoriesSection from "../components/StoriesSection";
import VideoSection from "../components/VideoSection";
import SecondSlider from "../components/SecondSlider";

export default function Home() {
  return (
    <div>
      <VideoSection />
      <HeroSlider />
      <SecondSlider />
      <ExperienceSection />
      <StoriesSection />
    </div>
  );
}
