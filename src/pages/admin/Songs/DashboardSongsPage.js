import React, { useContext, useEffect, useState } from "react";
import {
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
  Button,
  Snackbar,
  Alert,
  DialogContent,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

import SongHeader from "../../../components/headerAdmin/SongHeader";
import { SongContext } from "../../../contexts/adminFindContext/findSongContext";
import { fetchGetAllSong } from "../../../services/songService";
import { fetchSongUpdate } from "../../../services/adminServices.js/SongsAdminServices/fetchSongUpdate";
import { fetchSongDelete } from "../../../services/adminServices.js/SongsAdminServices/fetchDeleteSong";

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
  const [editedDuration, setEditedDuration] = useState("");
  const [editedPopularity, setEditedPopularity] = useState("");
  const [editedURL, setEditedURL] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const { songTitle, setSongTitle } = useContext(SongContext);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadSongs = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllSong(currentPage, 5);
      console.log("data", data);

      setSongs(data.songs);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load songs", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open Edit Dialog
  const openEditDialogHandler = (song) => {
    setSongToEdit(song);
    setEditedTitle(song.title);
    setEditedDuration(song.duration);
    setEditedPopularity(song.popularity);
    setEditedURL(song.URL);
    setOpenEditDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSongToEdit(null);
    setEditedTitle("");
    setEditedDuration("");
    setEditedPopularity("");
    setEditedURL("");
  };

  // Open Delete Dialog
  const openDeleteDialogHandler = (songId) => {
    setSongToDelete(songId);
    setOpenDeleteDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSongToDelete(null);
  };

  const handleSaveChanges = async () => {
    if (songToEdit) {
      const updatedSong = {};

      if (editedTitle !== songToEdit.title) {
        updatedSong.title = editedTitle;
      }

      if (editedDuration !== songToEdit.duration) {
        updatedSong.duration = editedDuration;
      }

      if (editedPopularity !== songToEdit.popularity) {
        updatedSong.popularity = editedPopularity;
      }

      if (editedURL !== songToEdit.URL) {
        updatedSong.URL = editedURL;
      }
      if (songToEdit.coverImageURL) {
        updatedSong.coverImageURL = songToEdit.coverImageURL;
      }

      if (Object.keys(updatedSong).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        return;
      }

      try {
        // Update song details
        await fetchSongUpdate(songToEdit._id, updatedSong);
        setSongs((prevSongs) =>
          prevSongs.map((song) => {
            return song._id === songToEdit._id
              ? { ...songToEdit, ...updatedSong }
              : song;
          })
        );
        if (songTitle && songTitle._id === songToEdit._id) {
          setSongTitle({ ...songTitle, ...updatedSong });
        }
        setSnackbarMessage("Song updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to update song.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setOpenSnackbar(true);
      }
    }
  };
  const handleRefresh = () => {
    setSongTitle(null);
    setPage(1);
    loadSongs(1);
  };
  useEffect(() => {
    if (!setSongTitle) {
      loadSongs(page);
    }
  }, [page]);

  // Delete Song
  const handleDeleteSong = async () => {
    if (songToDelete) {
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
        handleCloseDeleteDialog();
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const navigateRoute = (view) => {
    switch (view) {
      case "Users":
        navigate("/admin/dashboard/Users");
        break;
      case "Artists":
        navigate("/admin/dashboard/artists");
        break;
      case "Genres":
        navigate("/admin/dashboard/genres");
        break;
      case "Songs":
        navigate("/admin/dashboard/songs");
        break;
      default:
        navigate("/admin/dashboard/albums");
        break;
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <SongHeader />
      <div className="dashboard-container">
        {songTitle && (
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="refresh"
                size="small"
                onClick={handleRefresh}
                color="inherit"
              >
                <RefreshIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Showing results for: <strong>{songTitle.name}</strong>
          </Alert>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    width: "50px",
                    cursor: "pointer",
                  }}
                >
                  <IconButton onClick={handleMenuClick} color="primary">
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        navigateRoute("Users");
                        handleMenuClose();
                      }}
                    >
                      Users
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigateRoute("Artists");
                        handleMenuClose();
                      }}
                    >
                      Artists
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigateRoute("Genres");
                        handleMenuClose();
                      }}
                    >
                      Genres
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigateRoute("Songs");
                        handleMenuClose();
                      }}
                    >
                      Songs
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigateRoute("Albums");
                        handleMenuClose();
                      }}
                    >
                      Albums
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Duration
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Popularity
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  URL
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
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
                  <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : songTitle ? (
                <TableRow key={songTitle._id}>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    1
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {songTitle.title}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {songTitle.duration}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {songTitle.popularity}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    <a
                      href={songTitle.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {songTitle.URL}
                    </a>
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialogHandler(songTitle)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => openDeleteDialogHandler(songTitle._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : (
                songs.map((song, index) => (
                  <TableRow key={song._id}>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {song.title}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {song.duration}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {song.popularity}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      <a
                        href={song.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {song.URL}
                      </a>
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialogHandler(song)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => openDeleteDialogHandler(song._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        />

        {/* Edit Song Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Song</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Duration"
              fullWidth
              value={editedDuration}
              onChange={(e) => setEditedDuration(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Popularity"
              fullWidth
              value={editedPopularity}
              onChange={(e) => setEditedPopularity(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="URL"
              fullWidth
              value={editedURL}
              onChange={(e) => setEditedURL(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Cover Image URL"
              fullWidth
              value={songToEdit?.coverImageURL ?? ""}
              onChange={(e) =>
                setSongToEdit({ ...songToEdit, coverImageURL: e.target.value })
              }
              sx={{ marginBottom: "20px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Song Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Song</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this song?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteSong} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default DashboardSongsPage;
