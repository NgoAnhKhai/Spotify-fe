import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import {
  fetchPlaylistById,
  fetchRemoveSongToPlaylist,
  updatePlaylistCoverImage,
} from "../../services/playlistService";
import ImageUploader from "../../components/upload/ImageUpload";

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const playlistData = await fetchPlaylistById(id);
        setPlaylist(playlistData.playlist);
        setMusicPlaylist(playlistData.playlist.songs);
        setNewTitle(playlistData.playlist.title);
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

  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };
  const handleSaveTitle = async () => {
    try {
      const updatedPlaylist = await updatePlaylistCoverImage(id, {
        title: newTitle,
      });

      setPlaylist((prev) => ({
        ...prev,
        title: updatedPlaylist.playlist.title,
      }));

      setIsEditingTitle(false);

      setSnackbarMessage("Cập nhật tiêu đề thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating title:", error);
      setSnackbarMessage("Không thể cập nhật tiêu đề");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

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
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("coverImageURL", file);

    try {
      const updatedPlaylist = await updatePlaylistCoverImage(id, formData);
      setPlaylist(updatedPlaylist.playlist);
      setSnackbarMessage("Cập nhật ảnh thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      setSnackbarMessage("Không thể cập nhật ảnh");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        padding: 7,
        backgroundColor: theme.palette.background.default,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
            : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
        transition: "all 0.3s ease",
        color: theme.palette.text.primary,
        maxHeight: "70vh",
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
        <ImageUploader
          imageUrl={playlist?.coverImageURL}
          onUpload={handleUpload}
        />

        {/* Playlist Info */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {isEditingTitle ? (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveTitle}
              >
                Lưu
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                {playlist.title}
              </Typography>
              <IconButton onClick={handleEditTitle}>
                <EditIcon />
              </IconButton>
            </Box>
          )}
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
      <Box sx={{ flex: 1 }}>
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
