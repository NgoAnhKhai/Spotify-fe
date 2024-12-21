// MainStartSong.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";

const MainStartSong = () => {
  const [volume, setVolume] = useState(50);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { searchResults, searchQuery } = useSearch();
  const audioRef = useRef(new Audio());
  const navigate = useNavigate();
  const { currentSong, setCurrentSong, playlist } =
    useContext(MusicPlayerContext);

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cập nhật src của audio khi currentSong thay đổi
  useEffect(() => {
    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.URL || currentSong.audioURL || "";
      audio.load();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      audio.src = "";
      setIsPlaying(false);
    }
  }, [currentSong]);

  // Thiết lập các sự kiện cho audio
  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      handleNextSong();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, currentSong]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
  };

  const handleSeekChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const handleNextSong = () => {
    if (playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song._id === currentSong?._id
      );
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentSong(playlist[nextIndex]);
    } else {
      console.warn("Playlist is empty.");
      setIsPlaying(false);
    }
  };

  const handlePreviousSong = () => {
    if (playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song._id === currentSong?._id
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;
      setCurrentSong(playlist[previousIndex]);
    } else {
      console.warn("Playlist is empty.");
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const navigateToArtist = (artistId) => {
    navigate(`/artists/${artistId}`);
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
          {/* Thông Tin Bài Hát */}
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
                  onClick={() =>
                    navigateToArtist(
                      currentSong.artistID._id || currentSong.artist._id
                    )
                  }
                  color="#4f5370"
                  variant="h7"
                  sx={{ cursor: "pointer" }}
                >
                  {currentSong.artistID?.name || currentSong.artist?.name}
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

          {/* Các Nút Điều Khiển Phát Nhạc */}
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

          {/* Điều Khiển Âm Lượng */}
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
                  width: isMobile ? "100%" : "120px",
                  height: isMobile ? "150px" : "4px",
                  "& .MuiSlider-thumb": {
                    width: isMobile ? "8px" : "12px",
                    height: isMobile ? "8px" : "12px",
                  },
                  "& .MuiSlider-track": {
                    width: isMobile ? "2px" : "4px",
                  },
                  "& .MuiSlider-rail": {
                    width: "4px",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Thanh Trượt Thời Gian Bài Hát */}
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeekChange}
          sx={{ width: "80%", color: "#1e90ff", marginTop: "8px" }}
        />
      </Box>
    </Box>
  );
};

export default MainStartSong;
