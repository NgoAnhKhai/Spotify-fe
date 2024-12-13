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
import { fetchGetAllArtist } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchGetAllArtist";
import { fetchDeleteArtist } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchDeleteArtist";
import { fetchUpdateArtist } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchUpdateArtist";

const DashboardArtistPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [artistToEdit, setArtistToEdit] = useState(null);
  const [editedName, setEditedName] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const [editedSong, setEditedSong] = useState("");
  const [editedAlbum, setEditedAlbum] = useState("");
  const [editedImgURL, setEditedImgURL] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedFollowersCount, setEditedFollowersCount] = useState("");
  const [editedStartYear, setEditedStartYear] = useState("");
  const [editedDifficulties, setEditedDifficulties] = useState("");

  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  // Load users from the server
  const loadArtists = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllArtist(currentPage, 10);
      setArtists(data.artists);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load artists", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open Edit Dialog
  const openEditDialogHandler = (artist) => {
    setArtistToEdit(artist);
    setEditedName(artist.name);
    setEditedImgURL(artist.imgURL);
    setOpenEditDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setArtistToEdit(null);
    setEditedName("");
    setEditedDescription("");
    setEditedFollowersCount("");
    setEditedSong("");
    setEditedAlbum("");
    setEditedImgURL("");
  };
  // Open Delete Dialog
  const openDeleteDialogHandler = (artistId) => {
    setArtistToDelete(artistId);
    setOpenDeleteDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setArtistToDelete(null);
  };
  const handleSaveChanges = async () => {
    if (artistToEdit) {
      const updatedProfile = {};

      if (editedName !== artistToEdit.name) {
        updatedProfile.name = editedName;
      }
      if (editedFollowersCount !== artistToEdit.followersCount) {
        updatedProfile.followersCount = editedFollowersCount;
      }

      if (editedImgURL !== artistToEdit.imgURL) {
        updatedProfile.imgURL = editedImgURL;
      }

      if (Object.keys(updatedProfile).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        return;
      }

      try {
        // Update artist details using fetchUpdateArtist
        await fetchUpdateArtist(artistToEdit._id, updatedProfile);
        setArtists((prevArtists) =>
          prevArtists.map((artist) => {
            return artist._id === artistToEdit._id
              ? { ...artistToEdit, ...updatedProfile }
              : artist;
          })
        );

        setSnackbarMessage("Artist updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to update artist.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setOpenSnackbar(true);
      }
    }
  };
  useEffect(() => {
    loadArtists(page);
  }, [page]);

  // Delete Artist
  const handleDeleteArtist = async () => {
    if (artistToDelete) {
      try {
        await fetchDeleteArtist(artistToDelete);
        setArtists((prevArtists) =>
          prevArtists.filter((artist) => artist._id !== artistToDelete)
        );
        setSnackbarMessage("Artist deleted successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to delete artist.");
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
                  Artists
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Followers Count
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Song
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Album
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Role
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
                artists.map((artist, index) => (
                  <TableRow key={artist._id}>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {artist.name}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {artist.followersCount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {Array.isArray(artist.songs) &&
                      artist.songs.length > 0 ? (
                        artist.songs.map((song, index) => (
                          <div key={index}>{song.title}</div>
                        ))
                      ) : (
                        <span>No songs available</span>
                      )}
                    </TableCell>

                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {Array.isArray(artist.albums) &&
                      artist.albums.length > 0 ? (
                        artist.albums.map((album, index) => (
                          <div key={index}>{album.title}</div>
                        ))
                      ) : (
                        <span>No albums available</span>
                      )}
                    </TableCell>

                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {artist.role}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialogHandler(artist)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => openDeleteDialogHandler(artist._id)}
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

        {/* Edit Artist Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Artist</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Followers Count"
              fullWidth
              type="number"
              value={editedFollowersCount}
              onChange={(e) => setEditedFollowersCount(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />

            <TextField
              label="Image URL"
              fullWidth
              value={editedImgURL}
              onChange={(e) => setEditedImgURL(e.target.value)}
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

        {/* Delete User Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this user?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteArtist} color="secondary">
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

export default DashboardArtistPage;
