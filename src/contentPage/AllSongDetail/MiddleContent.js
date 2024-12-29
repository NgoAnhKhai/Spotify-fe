import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Snackbar,
  Alert,
  ListItemText,
  Checkbox,
  ListItem,
  List,
  Modal,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { fetchGetAllSong, fetchSearchSong } from "../../services/songService";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import { useSearch } from "../../contexts/SearchContext";
import {
  fetchAddSongToPlaylist,
  fetchPlaylistUser,
} from "../../services/playlistService";
import SkeletonLoaderSong from "../../components/skeleton/AllSongSkeleton";
import { fetchSongUpdate } from "../../services/adminServices.js/SongsAdminServices/fetchSongUpdate";

export default function MiddleContent() {
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [playlists, setPlaylists] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedSongID, setSelectedSongID] = useState(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { setCurrentSong, setPlaylist } = useContext(MusicPlayerContext);
  const theme = useTheme();
  const { searchResults, searchQuery, updateSearchResults } = useSearch();
  const isMobile = useMediaQuery("(max-width:600px)");

  const loadSongs = async (page = 1) => {
    setLoading(true);
    try {
      const result = await fetchGetAllSong(page, 5, "popularity", "desc");
      setTotalPages(result.pagination.totalPages);
      setSongsData(result.songs);
      setPlaylist(result.songs);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load songs");
      setLoading(false);
    }
  };

  // Hàm để tải playlist của người dùng
  const loadUserPlaylists = async () => {
    try {
      const userPlaylists = await fetchPlaylistUser();
      if (userPlaylists && Array.isArray(userPlaylists.playlists)) {
        setPlaylists(userPlaylists.playlists);
      }
    } catch (err) {
      console.error("Error fetching playlists", err);
    }
  };

  useEffect(() => {
    loadSongs(currentPage);
    loadUserPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Tải kết quả tìm kiếm khi có query
  useEffect(() => {
    if (searchQuery) {
      const searchSongs = async () => {
        setLoading(true);
        try {
          const response = await fetchSearchSong(searchQuery);
          if (response && response.songs && response.songs.length > 0) {
            setSnackbarMessage("Tìm kiếm thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            updateSearchResults(response.songs);
            setPlaylist(response.songs);
          } else {
            setSnackbarMessage("Không có bài hát nào tìm thấy");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            updateSearchResults([]);
            setPlaylist([]);
          }
        } catch (err) {
          setSnackbarMessage("Không có bài hát nào tìm thấy");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          updateSearchResults([]);
          setPlaylist([]);
        } finally {
          setLoading(false);
        }
      };
      searchSongs();
    } else {
      setPlaylist(songsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, songsData]);

  const handleSongClick = async (song) => {
    if (!song || !song._id) {
      setSnackbarMessage("Song data is invalid or not available");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setCurrentSong(song);
    try {
      await fetchSongUpdate(song._id, {
        popularity: song.popularity + 1,
      });
    } catch (error) {
      console.error("Failed to update song popularity", error);
      setSongsData((prevSongs) =>
        prevSongs.map((s) =>
          s._id === song._id ? { ...s, popularity: s.popularity - 1 } : s
        )
      );
    }
  };

  const handleAddModalOpen = (event, songID) => {
    event.stopPropagation();
    setSelectedSongID(songID);
    setOpenAddModal(true);
  };

  const handleAddToPlaylist = async () => {
    try {
      if (selectedPlaylists.length > 0 && selectedSongID) {
        for (let playlistID of selectedPlaylists) {
          await fetchAddSongToPlaylist(playlistID, selectedSongID);
        }
        setSnackbarMessage("Song added to playlist successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      setSnackbarMessage("You already have one in your playlist");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenAddModal(false);
      setSelectedPlaylists([]);
    }
  };

  const handleSelectPlaylist = (playlistID) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistID)
        ? prev.filter((id) => id !== playlistID)
        : [...prev, playlistID]
    );
  };

  const listSongs =
    searchQuery && searchResults.length > 0 ? searchResults : songsData;

  if (loading) {
    return <SkeletonLoaderSong />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
              : "linear-gradient(to bottom, #f0f0f0 15%, #ffffff)",
        }}
      >
        <Typography sx={{ color: theme.palette.text.primary }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        maxHeight: "70vh",
        borderRadius: "10px",
        width: isMobile ? "90%" : "100%",
        marginLeft: isMobile ? "auto" : "0",
        margin: isMobile ? "0 auto" : "0",
        transition: "all 0.3s ease",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
            : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
        color: theme.palette.text.primary,
        p: isMobile ? 2 : 4,
      }}
    >
      {/* Top result with Refresh button */}
      {listSongs.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: isMobile ? 1 : 2,
              mb: 2,
            }}
          >
            <Typography
              sx={{ marginLeft: isMobile ? "-10px" : "0px" }}
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              {searchQuery ? "Search Results" : "All Songs"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              marginLeft: isMobile ? "100px" : "0",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "flex-end",
              gap: 2,
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPlaylist(listSongs);
                if (listSongs.length > 0) {
                  setCurrentSong(listSongs[0]);
                }
              }}
              sx={{
                width: isMobile ? "50%!important" : "auto",
                marginRight: 2,
                margin: "10px",
                padding: "5px 10px",
              }}
            >
              Play All
            </Button>

            <Button
              sx={{
                marginRight: 2,
                marginLeft: isMobile ? "-50" : "auto",

                padding: "5px 10px",
              }}
              onClick={() => {
                updateSearchResults([]);
                setPlaylist(songsData);
              }}
            >
              <RefreshIcon />
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              width: isMobile ? "70%" : "100%",
              marginLeft: isMobile ? "30px" : "auto",

              backgroundColor:
                theme.palette.mode === "dark" ? "#121212" : "#e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              alignItems: "center",
              mb: 4,
              cursor: "pointer",
            }}
            onClick={() => handleSongClick(listSongs[0])}
          >
            <Box
              component="img"
              src={listSongs[0].coverImageURL}
              alt={listSongs[0].title}
              sx={{
                width: isMobile ? "100%" : "150px",
                height: isMobile ? "auto" : "150px",
                borderRadius: "8px",
                mr: isMobile ? 0 : 2,
                mb: isMobile ? 2 : 0,
                objectFit: "cover",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {listSongs[0].title}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey" }}>
                Song • {listSongs[0].artistID?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey" }}>
                Popularity: {listSongs[0].popularity}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* Song list */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Songs
      </Typography>

      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {listSongs.slice(1).map((song) => (
          <Box
            key={song._id}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              borderRadius: "8px",
              width: isMobile ? "70%" : "100%",
              marginLeft: isMobile ? "30px" : "auto",
              transition: "0.3s",
              backgroundColor:
                theme.palette.mode === "dark" ? "#121212" : "#e0e0e0",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1e1e1e" : "#d0d0d0",
                cursor: "pointer",
              },
            }}
            onClick={() => handleSongClick(song)}
          >
            <Box
              component="img"
              src={song.coverImageURL}
              alt={song.title}
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                mr: 2,
                objectFit: "cover",
              }}
            />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {song.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey" }}>
                {song.artistID?.name || "Unknown Artist"}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey" }}>
                Popularity: {song.popularity}
              </Typography>
            </Box>
            {/* Add to Playlist Icon */}
            <AddIcon
              sx={{
                cursor: "pointer",
                marginLeft: "auto",
                fontSize: "30px",
                color: theme.palette.primary.main,
              }}
              onClick={(event) => handleAddModalOpen(event, song._id)}
            />
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          width: isMobile ? "70%" : "100%",
          marginLeft: isMobile ? "30px" : "auto",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      {/* Add to Playlist Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor:
              theme.palette.mode === "dark" ? "#424242" : "#ffffff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: 24,
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: theme.palette.text.primary }}
          >
            Select Playlist
          </Typography>
          <List sx={{ padding: 0 }}>
            {playlists.map((playlist) => (
              <ListItem
                key={playlist._id}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333333" : "#f9f9f9",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}
              >
                <Checkbox
                  checked={selectedPlaylists.includes(playlist._id)}
                  onChange={() => handleSelectPlaylist(playlist._id)}
                  sx={{
                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    "&.Mui-checked": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
                <ListItemText
                  primary={playlist.title}
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToPlaylist}
            sx={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Add to Playlist
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
