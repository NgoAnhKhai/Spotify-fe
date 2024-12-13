import React from "react";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";
import MainStartSong from "./MainStartSong";
import { Grid } from "@mui/material";
import { MusicPlayerProvider } from "../contexts/MusicPlayerContext";

const MainLayout = () => {
  return (
    <MusicPlayerProvider>
      <Grid
        container
        sx={{ margin: 0, padding: 0, width: "100%", height: "100%" }}
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
    </MusicPlayerProvider>
  );
};

export default MainLayout;
