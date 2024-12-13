import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";

const MainStartSong = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showThumb, setShowThumb] = useState(false);
  const audioRef = useRef(null);

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

    window.addEventListener("storage", handleLogout);

    return () => {
      window.removeEventListener("storage", handleLogout);
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#121212",
        padding: "16px",
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
          }}
        >
          <VolumeUpIcon sx={{ color: "white", marginRight: "10px" }} />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            sx={{ color: "#1e90ff", width: "100px" }}
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
  );
};

export default MainStartSong;
