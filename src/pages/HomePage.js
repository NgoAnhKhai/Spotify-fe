import React from "react";

import "../App.css";
import RightSideBar from "../components/sidebar/RightSideBar";

import LeftSideBar from "../components/sidebar/LeftSideBar";
import MiddleContent from "../contentPage/homepage/MiddleContent";
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
