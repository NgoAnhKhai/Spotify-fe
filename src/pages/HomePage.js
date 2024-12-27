import React from "react";

import RightSideBar from "../components/sidebar/RightSideBar";

import LeftSideBar from "../components/sidebar/LeftSideBar";
import MiddleContent from "../contentPage/homepage/MiddleContent";
import { Grid } from "@mui/material";
function HomePage() {
  return (
    <div className="homepage-container">
      <Grid
        item
        sx={{
          zIndex: 9999,
        }}
      >
        <LeftSideBar />
      </Grid>
      <MiddleContent />
      <RightSideBar />
    </div>
  );
}

export default HomePage;
