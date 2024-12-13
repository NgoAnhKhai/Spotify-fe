import React from "react";
import RightSideBar from "../components/sidebar/RightSideBar";
import LeftSideBar from "../components/sidebar/LeftSideBar";
import MiddleContent from "../contentPage/AlbumDetail/MiddleContent";

const AlbumPage = () => {
  return (
    <>
      <div className="album-container">
        <LeftSideBar />
        <MiddleContent />
        <RightSideBar />
      </div>
    </>
  );
};

export default AlbumPage;
