import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Modal,
  List,
  ListItem,
  ListItemText,
  Button,
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import { fetchArtistById } from "../../services/artistService";
import {
  fetchAddSongToPlaylist,
  fetchPlaylistUser,
  fetchRemoveSongToPlaylist,
} from "../../services/playlistService";
import ArtistSkeleton from "../../components/skeleton/ArtistSkeleton";
const ArtistDetailPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [selectedSongID, setSelectedSongID] = useState(null);
  const [playlistsContainSong, setPlaylistsContainSong] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPlaylist, setCurrentSong } = useContext(MusicPlayerContext);
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [artistDescription, setArtistDescription] = useState([]);
  const songListRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        const artistData = await fetchArtistById(id);
        console.log("data", artistData);

        setArtistDescription(artistData.artist.description);
        setArtist(artistData.artist);
        console.log(artistData.artist._id);

        setPlaylist(artistData.artist.songs || []);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải nghệ sĩ");
        setLoading(false);
      }
    };

    const loadUserPlaylists = async () => {
      try {
        const userPlaylists = await fetchPlaylistUser();
        if (userPlaylists && Array.isArray(userPlaylists.playlists)) {
          setPlaylists(userPlaylists.playlists);
          console.log("userPlaylists.playlists", userPlaylists.playlists);
        } else {
          setPlaylists([]);
        }
      } catch (error) {
        console.error("Error fetching user playlists:", error);
        setPlaylists([]);
      }
    };

    loadArtist();
    loadUserPlaylists();
  }, [id, setPlaylist]);
  if (loading) {
    return <ArtistSkeleton />;
  }
  if (!artist) {
    return <div>{error}</div>;
  }

  const handleSongClick = (songID) => {
    const songData = artist.songs.find((song) => song._id === songID);
    setCurrentSong(songData);
    console.log("SongData:", songData);
  };

  const handleOpenAddModal = (songID) => {
    setSelectedSongID(songID);
    setOpenModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenModal(false);
    setSelectedSongID(null);
  };

  const handleOpenRemoveModal = (songID) => {
    const playlistsWithThisSong = playlists.filter((playlist) =>
      playlist.songs?.some((song) => song._id === songID)
    );
    setPlaylistsContainSong(playlistsWithThisSong);
    setSelectedSongID(songID);
    setOpenRemoveModal(true);
  };

  const handleCloseRemoveModal = () => {
    setOpenRemoveModal(false);
    setSelectedSongID(null);
    setPlaylistsContainSong([]);
  };

  const handleAddSongToPlaylists = async () => {
    try {
      if (selectedPlaylists.length > 0 && selectedSongID) {
        for (let playlistID of selectedPlaylists) {
          await fetchAddSongToPlaylist(playlistID, selectedSongID);
        }
        setSnackbarMessage("Thêm bài hát vào playlist thành công!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        const updatedUserPlaylists = await fetchPlaylistUser();
        if (
          updatedUserPlaylists &&
          Array.isArray(updatedUserPlaylists.playlists)
        ) {
          setPlaylists(updatedUserPlaylists.playlists);
        }
      }
    } catch (error) {
      console.error("Error adding song to playlists:", error);
      setSnackbarMessage("Lỗi khi thêm bài hát vào playlist!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      handleCloseAddModal();
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistID) => {
    try {
      if (playlistID && selectedSongID) {
        await fetchRemoveSongToPlaylist(playlistID, selectedSongID);
        setSnackbarMessage("Xóa bài hát khỏi playlist thành công!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        const updatedUserPlaylists = await fetchPlaylistUser();
        if (
          updatedUserPlaylists &&
          Array.isArray(updatedUserPlaylists.playlists)
        ) {
          setPlaylists(updatedUserPlaylists.playlists);
        }
      }
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      setSnackbarMessage("Lỗi khi xóa bài hát!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      handleCloseRemoveModal();
    }
  };

  const isSongInAnyPlaylist = (songID) => {
    return playlists.some((playlist) =>
      playlist.songs?.some((song) => song._id === songID)
    );
  };

  const handlePlaylistSelection = (playlistID) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistID)
        ? prev.filter((id) => id !== playlistID)
        : [...prev, playlistID]
    );
  };
  const handleWheelScroll = (e) => {
    e.currentTarget.scrollTop += e.deltaY * 1.5;
  };
  return (
    <Box
      sx={{
        overflowY: "auto",
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
        width: isMobile ? "100%" : "100%",
        marginRight: isMobile ? "22%" : "",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Artist Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          background: "linear-gradient(to bottom, #1e90fb 15%, #000000)",
          borderRadius: "8px",
          padding: "24px",
          gap: "20px",
        }}
      >
        {/* Artist Image */}
        {artist.imageURL ? (
          <img
            src={artist.imageURL}
            alt={artist.name}
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              backgroundColor: "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "white" }}>No Image</Typography>
          </Box>
        )}

        {/* Artist Info */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", marginBottom: 1, fontStyle: "italic" }}
          >
            {artist.name || "Unknown Artist"}
          </Typography>
          {artist.role && (
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              Vai trò: {artist.role}
            </Typography>
          )}
          {artist.genre && (
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              Thể loại: {artist.genre}
            </Typography>
          )}
          {artistDescription && (
            <Box>
              {Object.entries(artistDescription).map(([key, value]) => (
                <Typography
                  key={key}
                  variant="body1"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {key}:
                  {Array.isArray(value)
                    ? value.map((item, idx) => (
                        <span key={idx} style={{ marginLeft: "8px" }}>
                          {item}
                        </span>
                      ))
                    : ` ${value}`}
                </Typography>
              ))}
            </Box>
          )}
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", fontStyle: "italic" }}
          >
            Followers:{artist.followersCount}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "15px",
              padding: "4px 8px",
              width: "auto",
              mt: 1,
              "&:hover": {
                backgroundColor: "#fff",
                color: "#000",
              },
            }}
          >
            follow
          </Button>
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
        <Typography sx={{ width: "5%", textAlign: "center" }}>+</Typography>
        {!isMobile && (
          <Typography
            sx={{
              width: "5%",
              textAlign: "center",
            }}
          >
            #
          </Typography>
        )}

        <Typography sx={{ width: "40%" }}>Title</Typography>
        <Typography sx={{ width: "35%" }}>Artist</Typography>
        <Box sx={{ width: "20%", display: "flex", justifyContent: "center" }}>
          <AccessTimeIcon />
        </Box>
      </Box>

      {/* Songs List */}
      <Box
        ref={songListRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
        }}
        onWheel={handleWheelScroll}
      >
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {artist.songs && artist.songs.length > 0 ? (
            artist.songs.map((song, index) => {
              const inPlaylist = isSongInAnyPlaylist(song._id);
              return (
                <Box
                  key={song._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    transition:
                      "transform 0.3s ease, background-color 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.02)",
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleSongClick(song._id)}
                >
                  <Tooltip
                    title={
                      inPlaylist
                        ? "Bài hát đang trong playlist. Click để xóa khỏi playlist."
                        : "Thêm bài hát vào playlist"
                    }
                    arrow
                  >
                    <IconButton
                      sx={{ width: "5%", textAlign: "center" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        inPlaylist
                          ? handleOpenRemoveModal(song._id)
                          : handleOpenAddModal(song._id);
                      }}
                    >
                      {inPlaylist ? (
                        <CheckIcon style={{ color: "black" }} />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  {!isMobile && (
                    <Typography sx={{ width: "5%", textAlign: "center" }}>
                      {index + 1}
                    </Typography>
                  )}
                  <Typography sx={{ width: "40%", fontWeight: "bold" }}>
                    {song.title}
                  </Typography>
                  <Typography sx={{ width: "35%" }}>
                    {artist.name || "Unknown Artist"}
                  </Typography>
                  <Typography sx={{ width: "20%", textAlign: "center" }}>
                    {song.duration || "0:00"}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body1" color="textSecondary">
              Không có bài hát nào.
            </Typography>
          )}
        </Box>

        {/* Add Playlist Modal */}
        <Modal open={openModal} onClose={handleCloseAddModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              background: "linear-gradient(to top, #1e90ff 15%, #000)",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              color="white"
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Chọn playlist để thêm bài hát
            </Typography>
            <List sx={{ color: "white" }}>
              {playlists.map((playlist) => (
                <ListItem key={playlist._id}>
                  <Checkbox
                    checked={selectedPlaylists.includes(playlist._id)}
                    onChange={() => handlePlaylistSelection(playlist._id)}
                  />
                  <ListItemText primary={playlist.title} />
                </ListItem>
              ))}
            </List>
            <Button
              onClick={handleAddSongToPlaylists}
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                color: "white",
                "&:hover": {
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.5)",
                },
                transition: "transform 0.5s ease",
              }}
            >
              Add to Playlists
            </Button>

            <Button
              onClick={handleCloseAddModal}
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: "5px",
                fontWeight: "bold",
                color: "white",
                "&:hover": {
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.5)",
                },
                transition: "transform 0.5s ease",
              }}
            >
              Hủy
            </Button>
          </Box>
        </Modal>

        {/* Remove Playlist Modal */}
        <Modal open={openRemoveModal} onClose={handleCloseRemoveModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bài hát đang có trong playlist nào bạn muốn xóa?
            </Typography>
            <List>
              {playlistsContainSong.map((playlist) => (
                <ListItem
                  button
                  key={playlist._id}
                  onClick={() => handleRemoveSongFromPlaylist(playlist._id)}
                >
                  <ListItemText primary={playlist.title} />
                </ListItem>
              ))}
            </List>
            <Button
              onClick={handleCloseRemoveModal}
              fullWidth
              variant="contained"
              color="info"
            >
              Hủy
            </Button>
          </Box>
        </Modal>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          autoHideDuration={3000}
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
    </Box>
  );
};

export default ArtistDetailPage;
