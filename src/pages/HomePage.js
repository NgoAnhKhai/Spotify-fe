import React from "react";
import LeftSideBar from "../components/homepage/LeftSideBar";
import RightSideBar from "../components/homepage/RightSideBar";
import MiddleContent from "../components/homepage/MiddleContent";
import "../App.css";
function HomePage() {
  return (
    <div className="homepage-container">
      <LeftSideBar />
      <MiddleContent />
      <RightSideBar />
    </div>
  );
}

export default HomePage;
