import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import {
  fetchPlaylistById,
  fetchRemoveSongToPlaylist,
} from "../../services/playlistService";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPlaylist: setMusicPlaylist, setCurrentSong } =
    useContext(MusicPlayerContext);
  const theme = useTheme();

  // Thêm state cho Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const playlistData = await fetchPlaylistById(id);
        setPlaylist(playlistData.playlist);
        setMusicPlaylist(playlistData.playlist.songs);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải playlist");
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id, setMusicPlaylist]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSongClick = (songID) => {
    const songData = playlist.songs.find((song) => song._id === songID);
    setCurrentSong(songData);
    console.log("SongData:", songData);
  };

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      await fetchRemoveSongToPlaylist(playlistId, songId);
      setPlaylist((prev) => ({
        ...prev,
        songs: prev.songs.filter((song) => song._id !== songId),
      }));
      setSnackbarMessage("Xóa bài hát khỏi playlist thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error removing song:", err);
      setSnackbarMessage("Lỗi khi xóa bài hát!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        padding: 7,
        backgroundColor: theme.palette.background.default,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
            : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
        transition: "all 0.3s ease",
        color: theme.palette.text.primary,
        minHeight: "110vh",
        height: "100%",
        width: "100%",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Playlist Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to bottom, #1e90fb 15%, #000000)",
          borderRadius: "8px",
          padding: "24px",
          gap: "20px",
        }}
      >
        {/* Playlist Cover */}
        <img
          src={playlist.coverImageURL || "default-image.jpg"}
          alt={playlist.title}
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
          }}
        />
        {/* Playlist Info */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
              fontStyle: "italic",
            }}
          >
            {playlist.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontStyle: "italic",
            }}
          >
            {" Owner"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {playlist.description || "Playlist On Your Favorite"}
          </Typography>
        </Box>
      </Box>

      {/* Songs Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          borderBottom: `2px solid ${theme.palette.divider}`,
          fontWeight: "bold",
        }}
      >
        <Typography sx={{ width: "5%", textAlign: "center" }}>#</Typography>
        <Typography sx={{ width: "40%" }}>Title</Typography>
        <Typography sx={{ width: "35%" }}>Artist</Typography>
        <Box
          sx={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AccessTimeIcon />
        </Box>
      </Box>

      {/* Songs List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {playlist.songs && playlist.songs.length > 0 ? (
          playlist.songs.map((song, index) => (
            <Box
              key={song._id}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                cursor: "pointer",
                borderBottom: `1px solid ${theme.palette.divider}`,
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  transform: "scale(1.02)",
                },
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSong(playlist._id, song._id);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Box
                sx={{
                  width: "5%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography>{index + 1}</Typography>
              </Box>

              <Box
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleSongClick(song._id)}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {song.title}
                </Typography>
              </Box>
              <Typography
                sx={{ width: "35%" }}
                onClick={() => handleSongClick(song._id)}
              >
                {song.artistID?.name || "Unknown"}
              </Typography>
              <Typography
                sx={{
                  width: "20%",
                  textAlign: "center",
                }}
                onClick={() => handleSongClick(song._id)}
              >
                {song.duration || "0:00"}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            Không có bài hát nào trong playlist này.
          </Typography>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlaylistDetail;
