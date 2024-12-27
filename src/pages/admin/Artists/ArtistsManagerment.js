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
  Button,
  Snackbar,
  Alert,
  DialogContent,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchGetAllArtist } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchGetAllArtist";
import { fetchDeleteArtist } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchDeleteArtist";
import { fetchUpdateArtist } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchUpdateArtist";
import { ArtistContext } from "../../../contexts/adminFindContext/findArtistContext";
import { fetchFindArtistByName } from "../../../services/adminServices.js/ArtistAdminServices.js/fetchFindArtistByName";
import { useTheme } from "@mui/material/styles";

const ArtistManagement = () => {
  const { artistName, setArtistName } = useContext(ArtistContext);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState(null);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedFollowersCount, setEditedFollowersCount] = useState("");
  const [editedImgURL, setEditedImgURL] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");

  const theme = useTheme();

  const loadArtists = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllArtist(currentPage, 10);
      setArtists(data.artists);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load artists", error);
      setSnackbarMessage("Failed to load artists.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setArtistName(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchFindArtistByName(searchQuery.trim());
      console.log("Search Response:", response);

      if (response && response.artists) {
        setArtistName(response.artists);
        setSnackbarMessage(`Found artist: ${response.artists.name}`);
        setSnackbarSeverity("success");
      } else {
        setArtistName(null);
        setSnackbarMessage("No artist found with the given name.");
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSnackbarMessage("Failed to search artist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!artistName) {
      loadArtists(page);
    }
  }, [artistName, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    loadArtists(value);
  };

  const handleRefresh = () => {
    setArtistName(null);
    setPage(1);
    loadArtists(1);
  };

  const openEditDialogHandler = (artist) => {
    setArtistToEdit(artist);
    setEditedName(artist.name);
    setEditedFollowersCount(artist.followersCount);
    setEditedImgURL(artist.imgURL);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setArtistToEdit(null);
    setEditedName("");
    setEditedFollowersCount("");
    setEditedImgURL("");
  };

  const handleSaveChanges = async () => {
    if (artistToEdit) {
      const updatedProfile = {
        name: editedName,
        followersCount: editedFollowersCount,
        imgURL: editedImgURL,
      };

      try {
        await fetchUpdateArtist(artistToEdit._id, updatedProfile);
        setArtists((prevArtists) =>
          prevArtists.map((artist) =>
            artist._id === artistToEdit._id
              ? { ...artist, ...updatedProfile }
              : artist
          )
        );
        setSnackbarMessage("Artist updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to update artist.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setSnackbarOpen(true);
      }
    }
  };

  const openDeleteDialogHandler = (artistId) => {
    setArtistToDelete(artistId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setArtistToDelete(null);
  };

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
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
          Artists Management
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
            placeholder="Search Artists"
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

      {/* Artists Table */}
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
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Followers
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Role
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
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : artistName ? (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>1</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {artistName.name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {artistName.followersCount}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {artistName.role || "N/A"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {/* Edit Icon */}
                  <IconButton
                    onClick={() => openEditDialogHandler(artistName)}
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
                    onClick={() => openDeleteDialogHandler(artistName._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : artists.length > 0 ? (
              artists.map((artist, index) => (
                <TableRow key={artist._id}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {artist.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {artist.followersCount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {artist.role || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {/* Edit Icon */}
                    <IconButton
                      onClick={() => openEditDialogHandler(artist)}
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
                      onClick={() => openDeleteDialogHandler(artist._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  No artists found.
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
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Artist</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
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
            label="Followers Count"
            type="number"
            value={editedFollowersCount}
            onChange={(e) => setEditedFollowersCount(e.target.value)}
            sx={{ marginBottom: "16px" }}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={editedImgURL}
            onChange={(e) => setEditedImgURL(e.target.value)}
            InputLabelProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Artist</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this artist?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteArtist}
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
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArtistManagement;
