import React from "react";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";
import MainStartSong from "./MainStartSong";
import { Grid } from "@mui/material";

const MainLayout = () => {
  return (
    <>
      <Grid
        container
        sx={{ margin: 0, padding: 0, width: "100%" }}
        justifyContent="center"
      >
        <Grid item xs={12} sx={{ margin: 0, padding: 0 }}>
          <MainHeader />
        </Grid>
        <Grid item xs={12} sx={{ margin: 0, padding: 0 }}>
          <Outlet />
        </Grid>
        <Grid item xs={12} sx={{ margin: 0, padding: 0 }}>
          <MainStartSong />
        </Grid>
      </Grid>
    </>
  );
};

export default MainLayout;
