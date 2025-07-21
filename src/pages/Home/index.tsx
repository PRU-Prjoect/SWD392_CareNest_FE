// pages/Home/HomePage.tsx
import React from "react";
import ServiceCategories from "./components/ServiceCategories";
import LatestServices from "./components/LatestServices";
import HeroBanner from "./components/HeroBanner";
import HighestRating from "./components/HighestRating";
import MostBuy from "./components/MostBuy";
import ServiceList from "./components/ServiceList";
// Import the new ServiceList component that fetches real data
// import ServiceList from "./components/ServiceList";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Service Categories */}
      <ServiceCategories />

      {/* OPTION 1: Original components with sample data */}
      {/* Latest Services */}
      {/* <LatestServices /> */}
      {/* Highest Rating */}
      {/* <HighestRating /> */}
      {/* Most Buy */}
      {/* <MostBuy /> */}

      {/* OPTION 2: New component that fetches real services */}
      {/* Uncomment the line below and comment out the three components above to use the real data */}
      <ServiceList />
    </div>
  );
};

export default HomePage;
