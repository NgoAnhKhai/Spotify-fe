import React, { useEffect, useState } from "react";
import MainHeader from "../../../layout/MainHeader";
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

import { useNavigate } from "react-router-dom";
import { fetchGetAllSongs } from "../../../services/adminServices.js/SongsAdminServices/fetchGetAllSongs";
import { fetchUpdateSong } from "../../../services/adminServices.js/SongsAdminServices/fetchUpdateSong";
import { fetchDeleteSong } from "../../../services/adminServices.js/SongsAdminServices/fetchDeleteArtist";

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
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  // Load songs from the server
  const loadSongs = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllSongs(currentPage, 5); // Lấy 10 bài hát mỗi lần
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

      if (Object.keys(updatedSong).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        return;
      }

      try {
        // Update song details
        await fetchUpdateSong(songToEdit._id, updatedSong);
        setSongs((prevSongs) =>
          prevSongs.map((song) => {
            return song._id === songToEdit._id
              ? { ...songToEdit, ...updatedSong }
              : song;
          })
        );
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

  useEffect(() => {
    loadSongs(page);
  }, [page]);

  // Delete Song
  const handleDeleteSong = async () => {
    if (songToDelete) {
      try {
        await fetchDeleteSong(songToDelete);
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

  // Close menu when clicking on a menu item
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MainHeader />
      <div className="dashboard-container">
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
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Duration
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Popularity
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  URL
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
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
