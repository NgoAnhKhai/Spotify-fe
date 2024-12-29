import "../../App.css";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  IconButton,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAlbumById, fetchAllAlbums } from "../../services/albumService";
import { PlayCircleFilled as PlayIcon } from "@mui/icons-material";
import { fetchGetAllSong } from "../../services/songService";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import { useAuth } from "../../contexts/AuthContext";
import SkeletonLoader from "../../components/skeleton/HomePageskeleton";
import { fetchSongUpdate } from "../../services/adminServices.js/SongsAdminServices/fetchSongUpdate";

const MiddleContent = ({ song }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();
  const { user } = useAuth();
  const { setCurrentSong, setPlaylist } = useContext(MusicPlayerContext);
  const isMobile = window.innerWidth <= 600;
  const loadAlbums = async (pageNumber) => {
    setLoading(true);
    try {
      const { albums, pagination } = await fetchAllAlbums(pageNumber, 5);
      setAlbums(albums || []);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải album:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async () => {
    setLoading(true);
    try {
      const data = await fetchGetAllSong(1, 10, "popularity", "desc");
      setPlaylist(data.songs);
      setSongs(data.songs);
    } catch (error) {
      console.error("Lỗi khi tải bài hát:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = async (song) => {
    if (!user) {
      setSnackbarMessage("Please log in to listen to the song.");
      setOpenSnackbar(true);
      navigate("/login");
      return;
    }

    setCurrentSong(song);
    setPlaylist(songs);

    setSongs((prevSongs) =>
      prevSongs.map((s) =>
        s._id === song._id ? { ...s, popularity: s.popularity + 1 } : s
      )
    );

    try {
      await fetchSongUpdate(song._id, {
        popularity: song.popularity + 1,
      });
    } catch (error) {
      setSongs((prevSongs) =>
        prevSongs.map((s) =>
          s._id === song._id ? { ...s, popularity: s.popularity - 1 } : s
        )
      );
    }
  };

  useEffect(() => {
    loadSongs();
    loadAlbums(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (songs.length > 0) {
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  const handleClick = async (id) => {
    navigate(`/album/${id}`);
    try {
      const albumData = await fetchAlbumById(id);
      setPlaylist(albumData.songs);
    } catch (error) {
      console.error("Lỗi khi tải album:", error);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
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
        maxHeight: isMobile ? "75vh" : "70vh",
        width: "100%",

        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "16px",
          }}
          className="songs-container"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: "16px",
              textAlign: "center",
            }}
            className="songs-title"
          >
            Top Songs
          </Typography>

          {/* Sử dụng Grid Container */}
          <Grid container spacing={2} className="songs-list">
            {loading ? (
              <SkeletonLoader className="skeleton-loader" />
            ) : songs.length > 0 ? (
              songs.slice(0, 4).map((song) => (
                <Grid item xs={12} sm={6} key={song._id} className="song-item">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      borderRadius: "8px",
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#121212" : "#e0e0e0",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#1e1e1e" : "#d0d0d0",
                        cursor: "pointer",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleSongClick(song)}
                    className="song-box"
                  >
                    <Box
                      component="img"
                      src={song.coverImageURL}
                      alt={song.title}
                      sx={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "4px",
                        objectFit: "cover",
                        marginRight: "16px",
                      }}
                      className="song-cover-image"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.text.primary,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                          width: "100%",
                        }}
                        className="song-title"
                      >
                        {song.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                        className="song-artist"
                      >
                        {song.artistID.name || "Unknown Artist"}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongClick(song);
                      }}
                      className="play-button"
                    >
                      <PlayIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography sx={{ color: theme.palette.text.primary }}>
                No songs available
              </Typography>
            )}
          </Grid>
        </Box>
      )}
      {/* Feature Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          marginTop: "0px",
          marginBottom: "32px",
        }}
        className="feature-section"
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: "24px",
          }}
          className="feature-title"
        >
          Feature
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginLeft: isMobile ? "-55px" : "0px",
            width: "100%",
            gap: "16px",
          }}
          className="feature-items-container"
        >
          {loading ? (
            <SkeletonLoader className="skeleton-loader" />
          ) : albums.length > 0 ? (
            albums.map((album, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
                  padding: "8px",
                  borderRadius: "8px",
                  color: theme.palette.text.primary,
                  width: "calc(20% - 16px)",
                  height: "calc(210.13px + 40px)",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0",
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleClick(album._id)}
                className="album-item"
              >
                <img
                  src={album.coverImageURL}
                  alt={album.coverImageURL}
                  style={{
                    width: "200.41px",
                    height: "200.13px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                  className="album-cover-image"
                />
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.primary,
                  }}
                  className="album-title"
                >
                  {album.title}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography
              sx={{
                color: theme.palette.text.primary,
                textAlign: "center",
              }}
              className="no-albums-text"
            >
              Không có album nào
            </Typography>
          )}
        </Box>
      </Box>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "100%^",
          marginLeft: isMobile ? "-55px" : "0px",
          marginTop: "16px",
        }}
        className="pagination-controls"
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={page === 1}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#1e90ff",
            color: "#fff",
          }}
          className="pagination-button"
        >
          Previous
        </Button>
        <Typography
          sx={{ color: theme.palette.text.primary }}
          className="pagination-text"
        >
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={page === totalPages}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#1e90ff",
            color: "#fff",
          }}
          className="pagination-button"
        >
          Next
        </Button>
      </Box>

      {/* Snackbar for unauthenticated users */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MiddleContent;
