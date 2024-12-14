import React, { useEffect, useState } from "react";

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
import { fetchGetAllAlbums } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchGetAllAlbums";
import { fetchUpdateAlbums } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchUpdateAlbums";
import { fetchDeleteAlbum } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchDeleteAlbums";

const DashboardAlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [albumToEdit, setAlbumToEdit] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedReleaseDate, setEditedReleaseDate] = useState("");
  const [editedCoverImageURL, setEditedCoverImageURL] = useState("");
  const [editedListSong, setEditedListSong] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  // Load albums from the server
  const loadAlbums = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllAlbums(currentPage, 5);
      setAlbums(data.albums);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load albums", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open Edit Dialog
  const openEditDialogHandler = (album) => {
    setAlbumToEdit(album);
    setEditedTitle(album.title);
    setEditedReleaseDate(album.releaseDate);
    setEditedCoverImageURL(album.coverImageURL);
    setEditedListSong(album.listSong);
    setOpenEditDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setAlbumToEdit(null);
    setEditedTitle("");
    setEditedReleaseDate("");
    setEditedCoverImageURL("");
    setEditedListSong([]);
  };

  // Open Delete Dialog
  const openDeleteDialogHandler = (albumId) => {
    setAlbumToDelete(albumId);
    setOpenDeleteDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAlbumToDelete(null);
  };

  const handleSaveChanges = async () => {
    if (albumToEdit) {
      const updatedAlbum = {};

      if (editedTitle !== albumToEdit.title) {
        updatedAlbum.title = editedTitle;
      }

      if (editedReleaseDate !== albumToEdit.releaseDate) {
        updatedAlbum.releaseDate = editedReleaseDate;
      }

      if (editedCoverImageURL !== albumToEdit.coverImageURL) {
        updatedAlbum.coverImageURL = editedCoverImageURL;
      }

      if (editedListSong.length !== albumToEdit.listSong.length) {
        updatedAlbum.listSong = editedListSong;
      }

      if (Object.keys(updatedAlbum).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        return;
      }

      try {
        // Update album details
        await fetchUpdateAlbums(albumToEdit._id, updatedAlbum);
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album._id === albumToEdit._id
              ? { ...albumToEdit, ...updatedAlbum }
              : album
          )
        );

        setSnackbarMessage("Album updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to update album.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setOpenSnackbar(true);
      }
    }
  };

  useEffect(() => {
    loadAlbums(page);
  }, [page]);

  // Delete Album
  const handleDeleteAlbum = async () => {
    if (albumToDelete) {
      try {
        await fetchDeleteAlbum(albumToDelete);
        setAlbums((prevAlbums) =>
          prevAlbums.filter((album) => album._id !== albumToDelete)
        );
        setSnackbarMessage("Album deleted successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to delete album.");
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
                  Release Date
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cover Image URL
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Songs
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
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                albums.map((album, index) => (
                  <TableRow key={album._id}>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {album.title}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {new Date(album.releaseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {album.coverImageURL}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {album.listSong.length} songs
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialogHandler(album)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => openDeleteDialogHandler(album._id)}
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

        {/* Edit Album Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Album</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Release Date"
              fullWidth
              value={editedReleaseDate}
              onChange={(e) => setEditedReleaseDate(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Cover Image URL"
              fullWidth
              value={editedCoverImageURL}
              onChange={(e) => setEditedCoverImageURL(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Songs (comma separated IDs)"
              fullWidth
              value={editedListSong}
              onChange={(e) => setEditedListSong(e.target.value.split(","))}
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

        {/* Delete Album Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Album</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this album?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteAlbum} color="secondary">
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

export default DashboardAlbumsPage;
