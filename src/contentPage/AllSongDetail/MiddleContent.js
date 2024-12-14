import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchGetAllSong, fetchSearchSong } from "../../services/songService";
import { useContext } from "react";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import { useSearch } from "../../contexts/SearchContext";
import {
  fetchAddSongToPlaylist,
  fetchPlaylistUser,
} from "../../services/playlistService";
import SkeletonLoaderSong from "../../components/skeleton/AllSongSkeleton";

export default function MiddleContent() {
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [songsPerPage] = useState(10);
  const [playlists, setPlaylists] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedSongID, setSelectedSongID] = useState(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { setCurrentSong } = useContext(MusicPlayerContext);
  const theme = useTheme();
  const { searchResults, searchQuery, updateSearchResults } = useSearch();

  const loadSongs = async (page = 1) => {
    setLoading(true);
    try {
      const result = await fetchGetAllSong(page, songsPerPage);
      setTotalPages(result.totalPages);
      console.log("result.totalPages:", result.pagination.totalPages);

      setSongsData(result.songs);
      setLoading(false);
    } catch (err) {
      setError("Failed to load songs");
      setLoading(false);
    }
  };
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
    loadSongs();
    loadUserPlaylists();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const searchSongs = async () => {
        try {
          const response = await fetchSearchSong(searchQuery);
          if (response && response.songs && response.songs.length > 0) {
            setSnackbarMessage("Tìm kiếm thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            updateSearchResults(response.songs);
          } else {
            setSnackbarMessage("Không có bài hát nào tìm thấy");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            updateSearchResults([]);
          }
        } catch (err) {
          setSnackbarMessage("Có lỗi xảy ra khi tìm kiếm");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          updateSearchResults([]);
        }
      };

      searchSongs();
    }
  }, [searchQuery, updateSearchResults]);

  const handleSongClick = (song) => {
    setCurrentSong(song);
  };
  const handleAddModalOpen = (event) => {
    event.stopPropagation();
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

  const topResult = searchResults.length > 0 ? searchResults[0] : songsData[0];
  const listSongs =
    searchResults.length > 0 ? searchResults.slice(1) : songsData;

  // Khi đang tải dữ liệu
  if (loading) {
    return <SkeletonLoaderSong />;
  }

  // Khi có lỗi
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
        overflowY: "auto",
        minHeight: "100vh",
        height: "calc(100vh - 100px)",
        borderRadius: "10px",
        transition: "all 0.3s ease",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
            : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
        width: "100%",
        color: theme.palette.text.primary,
        p: 4,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#6200ea",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#e0e0e0",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "#6200ea #e0e0e0",
      }}
    >
      {/* Top result with Refresh button */}
      {topResult && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Top result
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                updateSearchResults([]);
                loadSongs();
              }}
            >
              Refresh
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              backgroundColor:
                theme.palette.mode === "dark" ? "#121212" : "#e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              alignItems: "center",
              mb: 4,
              cursor: "pointer",
            }}
            onClick={() => handleSongClick(topResult)}
          >
            <Box
              component="img"
              src={topResult.coverImageURL}
              alt={topResult.title}
              sx={{
                width: "150px",
                height: "150px",
                borderRadius: "8px",
                mr: 2,
                objectFit: "cover",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {topResult.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "grey" }}>
                Song • {topResult.artistID?.name}
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
        {listSongs.map((song) => (
          <Box
            key={song._id}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              borderRadius: "8px",
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
            </Box>
            {/* Add to Playlist Icon */}
            <AddIcon
              sx={{
                cursor: "pointer",
                marginLeft: "auto",
                fontSize: "30px",
                color: theme.palette.primary.main,
              }}
              onClick={(event) => {
                handleAddModalOpen(event);
                setSelectedSongID(song._id);
                setOpenAddModal(true);
              }}
            />
          </Box>
        ))}
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
              theme.palette.mode === "dark" ? "#424242" : "#ffffff", // Nền modal sáng hơn hoặc tối hơn tùy theo chế độ sáng tối
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
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
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
