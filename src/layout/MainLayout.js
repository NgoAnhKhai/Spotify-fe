import "../../src/App.css";
import React, { useEffect } from "react";
import MainHeader from "./MainHeader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MainStartSong from "./MainStartSong";
import { Grid, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import "./../App.css";
const MainLayout = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname === `/users/${user?.userId}/profile`;
  useEffect(() => {
    if (!user) {
      signout();
    }
  }, [user, signout, navigate]);
  return (
    <div className="Mainlayout">
      <Box
        className="MainLayout"
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "100vh",
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
                height: 200,
                right: 0,
                zIndex: 999,
              }}
            >
              <MainStartSong />
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default MainLayout;
