import React from "react";
import LeftSideBar from "../components/sidebar/LeftSideBar";
import RightSideBar from "../components/sidebar/RightSideBar";
import MiddleContent from "../contentPage/AllSongDetail/MiddleContent";

const AllSongsPage = () => {
  return (
    <div className="homepage-container">
      <LeftSideBar />
      <MiddleContent />
      <RightSideBar />
    </div>
  );
};

export default AllSongsPage;
