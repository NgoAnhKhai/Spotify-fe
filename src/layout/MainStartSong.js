import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";
import { useNavigate } from "react-router-dom";

const MainStartSong = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showThumb, setShowThumb] = useState(false);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const { currentSong, setCurrentSong, playlist } =
    useContext(MusicPlayerContext);

  useEffect(() => {
    const handleLogout = () => {
      const token = localStorage.getItem("token");
      if (!token && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("storage", handleLogout);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("storage", handleLogout);
      window.addEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentSong) {
      const audio = audioRef.current || new Audio(currentSong.URL);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        audio.play();
        setIsPlaying(true);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = handleNextSong;

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [currentSong]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prevState) => !prevState);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
    }
  };

  const handleSeekChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleNextSong = () => {
    if (playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song._id === currentSong._id
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentSong(playlist[nextIndex]);
    }
  };

  const handlePreviousSong = () => {
    if (playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song._id === currentSong._id
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      setCurrentSong(playlist[previousIndex]);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const navigateToArtist = (artistId) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <div className="MainStartSong">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#121212",
          padding: { xs: "15px", sm: "16px" },
          borderTop: "1px solid #282828",
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
                  onClick={() => navigateToArtist(currentSong.artistID._id)}
                  color="#4f5370"
                  variant="h7"
                  sx={{ cursor: "pointer" }}
                >
                  {currentSong.artistID.name}
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

          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <IconButton
              onClick={handlePreviousSong}
              color="secondary"
              sx={{ color: "white" }}
            >
              <SkipPreviousIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={togglePlayPause}
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "12px",
                color: "#121212",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
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
              sx={{ color: "white" }}
            >
              <SkipNextIcon fontSize="large" />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "30%",
              position: "relative", // Đảm bảo định vị chính xác
            }}
          >
            {/* Nút Âm Lượng */}
            <IconButton
              onClick={() => setIsVolumeSliderVisible((prev) => !prev)}
              sx={{ color: "white" }}
            >
              <VolumeUpIcon />
            </IconButton>

            {/* Thanh Trượt Âm Lượng */}
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
                onChange={handleVolumeChange}
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{
                  color: "#1e90ff",
                  width: isMobile ? "100%" : "100%",
                  height: isMobile ? "100%" : "4px",
                  "& .MuiSlider-thumb": {
                    width: isMobile ? "8px" : "12px",
                    height: isMobile ? "8px" : "12px",
                  },
                  "& .MuiSlider-track": {
                    width: isMobile ? "2px" : "4px",
                  },
                  "& .MuiSlider-rail": {
                    width: isMobile ? "4px" : "4px",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeekChange}
          sx={{ width: "80%", color: "#1e90ff", marginTop: "8px" }}
          onMouseEnter={() => setShowThumb(true)}
          onMouseLeave={() => setShowThumb(false)}
          componentsProps={{
            thumb: {
              style: {
                display: showThumb ? "block" : "none",
              },
            },
          }}
        />
      </Box>
    </div>
  );
};

export default MainStartSong;
