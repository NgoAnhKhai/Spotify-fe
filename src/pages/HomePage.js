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
          backgroundColor: "#121212",
          zIndex: 1,
          height: "100%",
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
