import React, { useContext, useState, useEffect } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";
import { useNavigate } from "react-router-dom";

const MainStartSong = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    handleNextSong,
    handlePreviousSong,
    volume,
    handleVolumeChange,
    currentTime,
    duration,
    handleSeekChange,
    isAdPlaying,
    subscriptionType,
  } = useContext(MusicPlayerContext);

  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleArtistClick = () => {
    if (currentSong?.artistID?._id) {
      navigate(`/artists/${currentSong.artistID._id}`);
    } else {
      console.warn("Artist ID not found.");
    }
  };

  return (
    <Box className="MainStartSong">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          position: "fixed",
          backgroundColor: "#121212",
          borderTop: "1px solid #282828",
          height: isMobile ? "150px" : "0px",
          padding: isMobile ? "20px" : "60px",
          bottom: "0px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "900px",
            padding: "8px 0",
          }}
        >
          {/* Song Information */}
          <Box
            sx={{
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "30%",
            }}
          >
            {currentSong ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {currentSong.title}
                </Typography>
                <Typography
                  color="#4f5370"
                  variant="h7"
                  sx={{ cursor: "pointer" }}
                  onClick={handleArtistClick}
                >
                  {currentSong.artistID?.name || "Unknown Artist"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#b3b3b3" }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" sx={{ color: "#b3b3b3" }}>
                No song selected
              </Typography>
            )}
          </Box>

          {/* Playback Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <IconButton
              onClick={handlePreviousSong}
              color="secondary"
              sx={{
                color:
                  isAdPlaying && subscriptionType !== "Premium"
                    ? "#ccc"
                    : "white",
              }}
              disabled={isAdPlaying && subscriptionType !== "Premium"}
            >
              <SkipPreviousIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={togglePlayPause}
              sx={{
                borderRadius: "50%",
                backgroundColor:
                  isAdPlaying && subscriptionType !== "Premium"
                    ? "#ccc"
                    : "white",
                padding: "12px",
                color:
                  isAdPlaying && subscriptionType !== "Premium"
                    ? "#666"
                    : "#121212",
                "&:hover": {
                  backgroundColor:
                    isAdPlaying && subscriptionType !== "Premium"
                      ? "#ccc"
                      : "#e0e0e0",
                },
              }}
              disabled={isAdPlaying && subscriptionType !== "Premium"}
            >
              {isPlaying ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </IconButton>
            <IconButton
              onClick={handleNextSong}
              color="secondary"
              sx={{
                color:
                  isAdPlaying && subscriptionType !== "Premium"
                    ? "#ccc"
                    : "white",
              }}
              disabled={isAdPlaying && subscriptionType !== "Premium"}
            >
              <SkipNextIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Volume Control */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "30%",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setIsVolumeSliderVisible((prev) => !prev)}
              sx={{ color: "white" }}
            >
              <VolumeUpIcon />
            </IconButton>
            <Box
              sx={{
                position: isMobile ? "absolute" : "static",
                display: isMobile
                  ? isVolumeSliderVisible
                    ? "block"
                    : "none"
                  : "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-end",
                height: isMobile ? "150px" : "4px",
                width: isMobile ? "4px" : "120px",
                right: isMobile ? "50px" : "auto",
                bottom: isMobile ? "20px" : "auto",
              }}
            >
              <Slider
                value={volume}
                onChange={(e, newValue) => handleVolumeChange(newValue)}
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{
                  color: "#1e90ff",
                  width: isMobile ? "100%" : "120px",
                  height: isMobile ? "150px" : "4px",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Song Progress */}
        <Slider
          value={currentTime}
          max={duration}
          onChange={(e, newValue) => handleSeekChange(newValue)}
          sx={{ width: "80%", color: "#1e90ff", marginTop: "8px" }}
          disabled={isAdPlaying && subscriptionType !== "Premium"}
        />
      </Box>
    </Box>
  );
};

export default MainStartSong;
