import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  fetchFavoriteArtists,
  fetchUnfollowArtist,
} from "../services/favoriteArtists";
import LeftSideBar from "../components/sidebar/LeftSideBar";

const FavoritePage = () => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = window.innerWidth <= 600;

  useEffect(() => {
    const loadFavoriteArtists = async () => {
      try {
        const response = await fetchFavoriteArtists();
        if (Array.isArray(response.favoriteArtists)) {
          setFavoriteArtists(response.favoriteArtists);
        } else {
          setFavoriteArtists([]);
          console.error("API không trả về mảng:", response);
        }
      } catch (err) {
        setError("Không thể tải danh sách nghệ sĩ yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteArtists();
  }, []);

  const handleUnfollow = async (artistId) => {
    try {
      await fetchUnfollowArtist(artistId);
      setFavoriteArtists((prevArtists) =>
        prevArtists.filter((artist) => artist._id !== artistId)
      );
    } catch (error) {
      console.error("Error unfollowing artist:", error.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "red", textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!Array.isArray(favoriteArtists) || favoriteArtists.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: "center",
          marginTop: 4,
          color: theme.palette.text.primary,
        }}
      >
        Bạn chưa yêu thích nghệ sĩ nào.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          position: isMobile ? "fixed" : "static",
          top: isMobile ? "100px" : "0",
          left: 0,
          height: isMobile ? "calc(100% - 70px)" : "100%",
          width: isMobile ? "0%" : "20%",
          backgroundColor: "#121212",
          zIndex: 1200,
          transition: "transform 0.3s ease-in-out",
          transform: isMobile ? "translateX(0)" : "none",
          boxShadow: isMobile ? "0 4px 10px rgba(0,0,0,0.5)" : "none",
          "& .MuiDrawer-paper": {
            backgroundColor: "#121212",
            color: "white",
            borderRadius: "10px",
            border: "none",
            position: "relative",
          },
        }}
      >
        <LeftSideBar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          borderRadius: "10px",
          width: "100%",
          height: isMobile ? "180vh" : "220vh",
          maxHeight: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          position: "relative",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
              : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
          transition: "all 0.3s ease",
          color: theme.palette.text.primary,
        }}
      >
        {favoriteArtists.map((artist) => (
          <Box
            key={artist._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor:
                theme.palette.mode === "dark" ? "#333" : "#f4f4f4",
              borderRadius: "16px",
              padding: 2,
              width: 180,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              marginBottom: 2,
            }}
          >
            {/* Artist Image */}
            <Box
              component="img"
              src={artist.imageURL || "https://via.placeholder.com/150"}
              alt={artist.name}
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 2,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/artists/${artist._id}`)}
            />

            {/* Artist Name */}
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 2,
                cursor: "pointer",
                color: theme.palette.text.primary,
              }}
              onClick={() => navigate(`/artists/${artist._id}`)}
            >
              {artist.name}
            </Typography>

            {/* Unfollow Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleUnfollow(artist._id)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Unfollow
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FavoritePage;
