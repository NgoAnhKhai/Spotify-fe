import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchGetAllSong } from "../../../services/songService";
import { fetchSongUpdate } from "../../../services/adminServices.js/SongsAdminServices/fetchSongUpdate";
import { fetchSongDelete } from "../../../services/adminServices.js/SongsAdminServices/fetchDeleteSong";
import { fetchFindSongByTitle } from "../../../services/adminServices.js/SongsAdminServices/fetchFindSongByTitle";
import { SongContext } from "../../../contexts/adminFindContext/findSongContext";
import { useTheme } from "@mui/material/styles";

const DashboardSongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [songToEdit, setSongToEdit] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedURL, setEditedURL] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const { songTitle, setSongTitle } = useContext(SongContext);
  const theme = useTheme();

  const loadSongs = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllSong(currentPage, 10);
      setSongs(data.songs);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load songs", error);
      setSnackbarMessage("Failed to load songs.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    loadSongs(value);
  };

  const openEditDialogHandler = (song) => {
    setSongToEdit(song);
    setEditedTitle(song.title);
    setEditedURL(song.URL);
    setOpenEditDialog(true);
  };

  const handleSaveChanges = async () => {
    if (songToEdit) {
      const updatedSong = {};

      if (editedTitle !== songToEdit.title) {
        updatedSong.title = editedTitle;
      }

      if (editedURL !== songToEdit.URL) {
        updatedSong.URL = editedURL;
      }

      if (Object.keys(updatedSong).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        return;
      }

      try {
        await fetchSongUpdate(songToEdit._id, updatedSong);
        setSongs((prevSongs) =>
          prevSongs.map((song) =>
            song._id === songToEdit._id ? { ...song, ...updatedSong } : song
          )
        );
        setSnackbarMessage("Song updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to update song.");
        setSnackbarSeverity("error");
      } finally {
        setOpenEditDialog(false);
        setSnackbarOpen(true);
      }
    }
  };

  const openDeleteDialogHandler = (songId) => {
    setSongToDelete(songId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSong = async () => {
    try {
      await fetchSongDelete(songToDelete);
      setSongs((prevSongs) =>
        prevSongs.filter((song) => song._id !== songToDelete)
      );
      setSnackbarMessage("Song deleted successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to delete song.");
      setSnackbarSeverity("error");
    } finally {
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setSongTitle(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchFindSongByTitle(searchQuery.trim());

      if (response && response.song) {
        setSongTitle(response.song);
        setSnackbarMessage(`Found song: ${response.song.title}`);
        setSnackbarSeverity("success");
      } else {
        setSongTitle(null);
        setSnackbarMessage("No song found with the given title.");
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSnackbarMessage("Failed to search song.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRefresh = () => {
    setSongTitle(null);
    setPage(1);
    loadSongs(1);
  };

  useEffect(() => {
    if (!songTitle) {
      loadSongs(page);
    }
  }, [page, songTitle]);

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Songs Management
        </Typography>

        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <IconButton
            aria-label="refresh"
            size="small"
            onClick={handleRefresh}
            color="inherit"
          >
            <RefreshIcon fontSize="inherit" />
          </IconButton>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Songs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => handleKeyDown(e)}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
              color: theme.palette.text.primary,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary,
              },
            }}
          />
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            onClick={() => handleSearch(searchQuery)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Songs Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          boxShadow: theme.shadows[3],
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                height: "60px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
              }}
            >
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                URL
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : songTitle ? (
              <TableRow key={songTitle._id}>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  1
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  {songTitle.title}
                </TableCell>

                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  <a
                    href={songTitle.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.palette.success.main }}
                  >
                    Link
                  </a>
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  {/* Edit Icon */}
                  <IconButton
                    onClick={() => openEditDialogHandler(songTitle)}
                    sx={{
                      color:
                        theme.palette.mode === "light"
                          ? "#000"
                          : theme.palette.text.primary,
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  {/* Delete Icon */}
                  <IconButton
                    sx={{ color: theme.palette.error.main }}
                    onClick={() => openDeleteDialogHandler(songTitle._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : songs.length > 0 ? (
              songs.map((song, index) => (
                <TableRow key={song._id}>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    {song.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    <a
                      href={song.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: theme.palette.success.main }}
                    >
                      Link
                    </a>
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    {/* Edit Icon */}
                    <IconButton
                      onClick={() => openEditDialogHandler(song)}
                      sx={{
                        color:
                          theme.palette.mode === "light"
                            ? "#000"
                            : theme.palette.text.primary,
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    {/* Delete Icon */}
                    <IconButton
                      sx={{ color: theme.palette.error.main }}
                      onClick={() => openDeleteDialogHandler(song._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  No songs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 4,
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            sx={{ marginBottom: "16px", mt: 1 }}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
          <TextField
            fullWidth
            label="URL"
            value={editedURL}
            onChange={(e) => setEditedURL(e.target.value)}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Song</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this song?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSong}
            sx={{ color: theme.palette.error.main }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardSongsPage;
