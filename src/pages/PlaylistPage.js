import React from "react";
import RightSideBar from "../components/sidebar/RightSideBar";
import LeftSideBar from "../components/sidebar/LeftSideBar";
import PlaylistDetail from "../contentPage/PlaylistDetail/PlaylistDetail";

const AlbumPage = () => {
  return (
    <>
      <div className="album-container">
        <LeftSideBar />
        <PlaylistDetail />
        <RightSideBar />
      </div>
    </>
  );
};

export default AlbumPage;
