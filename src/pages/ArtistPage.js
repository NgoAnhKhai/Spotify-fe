import React from "react";
import LeftSideBar from "../components/sidebar/LeftSideBar";
import RightSideBar from "../components/sidebar/RightSideBar";
import MiddleContent from "../contentPage/ArtistDetail/MiddleContent";

const ArtistPage = () => {
  return (
    <div className="homepage-container">
      <LeftSideBar />
      <MiddleContent />
      <RightSideBar />
    </div>
  );
};

export default ArtistPage;
