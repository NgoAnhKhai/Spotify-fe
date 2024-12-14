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
import { fetchGetAllGenres } from "../../../services/adminServices.js/GenresAdminServices.js/fetchAllGenres";
import { fetchDeleteGenre } from "../../../services/adminServices.js/GenresAdminServices.js/fetchDeleteGenres";
import { fetchUpdateGenres } from "../../../services/adminServices.js/GenresAdminServices.js/fetchUpdateGenres";

const DashboardGenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [genreToEdit, setGenreToEdit] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const loadGenres = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllGenres(currentPage, 10);
      setGenres(data.genres);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load genres", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open Edit Dialog
  const openEditDialogHandler = (genre) => {
    setGenreToEdit(genre);
    setEditedName(genre.name);
    setEditedDescription(genre.description);
    setOpenEditDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setGenreToEdit(null);
    setEditedName("");
    setEditedDescription("");
  };

  // Open Delete Dialog
  const openDeleteDialogHandler = (genreId) => {
    setGenreToDelete(genreId);
    setOpenDeleteDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setGenreToDelete(null);
  };

  const handleSaveChanges = async () => {
    if (genreToEdit) {
      const updatedGenre = {};

      if (editedName !== genreToEdit.name) {
        updatedGenre.name = editedName;
      }

      if (editedDescription !== genreToEdit.description) {
        updatedGenre.description = editedDescription;
      }

      if (Object.keys(updatedGenre).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        return;
      }

      try {
        // Update genre details
        await fetchUpdateGenres(genreToEdit._id, updatedGenre);
        setGenres((prevGenres) =>
          prevGenres.map((genre) => {
            return genre._id === genreToEdit._id
              ? { ...genreToEdit, ...updatedGenre }
              : genre;
          })
        );

        setSnackbarMessage("Genre updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to update genre.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setOpenSnackbar(true);
      }
    }
  };

  useEffect(() => {
    loadGenres(page);
  }, [page]);

  // Delete Genre
  const handleDeleteGenre = async () => {
    if (genreToDelete) {
      try {
        await fetchDeleteGenre(genreToDelete);
        setGenres((prevGenres) =>
          prevGenres.filter((genre) => genre._id !== genreToDelete)
        );
        setSnackbarMessage("Genre deleted successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to delete genre.");
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
                  Genres name
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Description
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
              ) : (
                genres.map((genre, index) => (
                  <TableRow key={genre._id}>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {genre.name}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {genre.description}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialogHandler(genre)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => openDeleteDialogHandler(genre._id)}
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

        {/* Edit Genre Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Genre</DialogTitle>
          <DialogContent>
            <TextField
              label="Genre Name"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Description"
              fullWidth
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
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

        {/* Delete Genre Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Genre</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this genre?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteGenre} color="secondary">
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

export default DashboardGenresPage;
