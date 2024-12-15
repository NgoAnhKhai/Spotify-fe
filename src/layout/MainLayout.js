import "../../src/App.css";
import React from "react";
import MainHeader from "./MainHeader";
import { Outlet, useLocation } from "react-router-dom";
import MainStartSong from "./MainStartSong";
import { Grid, Box } from "@mui/material";
import { MusicPlayerProvider } from "../contexts/MusicPlayerContext";

const MainLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/users/me/profile";

  return (
    <MusicPlayerProvider>
      <Box
        className="MainLayout"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Grid container direction="column" sx={{ flex: 1 }}>
          {/* Header */}
          <Grid
            item
            sx={{
              flexShrink: 0,
              margin: 0,
              padding: 0,
            }}
          >
            <MainHeader />
          </Grid>

          {/* Main Content */}
          <Grid
            item
            sx={{
              flex: 1,
              overflow: "auto",
              margin: 0,
              padding: 0,
            }}
          >
            <Outlet />
          </Grid>

          {/* Music Player */}
          {!isProfilePage && (
            <Grid
              item
              sx={{
                margin: 0,
                padding: 0,
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 999,
              }}
            >
              <MainStartSong />
            </Grid>
          )}
        </Grid>
      </Box>
    </MusicPlayerProvider>
  );
};

export default MainLayout;
