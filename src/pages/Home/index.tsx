// pages/Home/HomePage.tsx
import React from "react";
import ServiceCategories from "./components/ServiceCategories";
import LatestServices from "./components/LatestServices";
import HeroBanner from "./components/HeroBanner";
import HighestRating from "./components/HighestRating";
import MostBuy from "./components/MostBuy";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Service Categories */}
      <ServiceCategories />

      {/* Latest Services */}
      <LatestServices />
      {/* Highest Rating */}
      <HighestRating></HighestRating>
      {/* Most Buy */}
      <MostBuy></MostBuy>
    </div>
  );
};

export default HomePage;
