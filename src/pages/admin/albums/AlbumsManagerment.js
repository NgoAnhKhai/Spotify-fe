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
import { fetchGetAllAlbums } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchGetAllAlbums";
import { fetchUpdateAlbums } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchUpdateAlbums";
import { fetchDeleteAlbum } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchDeleteAlbums";
import { fetchFindAlbumByTitle } from "../../../services/adminServices.js/AlbumsAdminServices.js/fetchFindAlbum";
import { AlbumContext } from "../../../contexts/adminFindContext/findAlbumContext";
import { useTheme } from "@mui/material/styles";

const AlbumsManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState(null);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedReleaseDate, setEditedReleaseDate] = useState("");
  const [editedCoverImageURL, setEditedCoverImageURL] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { albumTitle, setAlbumTitle } = useContext(AlbumContext);
  const theme = useTheme();

  const loadAlbums = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllAlbums(currentPage, 10);
      setAlbums(data.albums);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load albums", error);
      setSnackbarMessage("Failed to load albums.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setAlbumTitle(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchFindAlbumByTitle(searchQuery.trim());

      if (response && response.albums) {
        setAlbumTitle(response.albums);
        setSnackbarMessage(`Found album: ${response.albums.title}`);
        setSnackbarSeverity("success");
      } else {
        setAlbumTitle(null);
        setSnackbarMessage("No album found with the given title.");
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSnackbarMessage("Failed to search album.");
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

  const handlePageChange = (event, value) => {
    setPage(value);
    loadAlbums(value);
  };

  const handleRefresh = () => {
    setAlbumTitle(null);
    setPage(1);
    loadAlbums(1);
  };

  const openEditDialogHandler = (album) => {
    setAlbumToEdit(album);
    setEditedTitle(album.title);
    setEditedReleaseDate(album.releaseDate);
    setEditedCoverImageURL(album.coverImageURL);
    setOpenEditDialog(true);
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

      if (Object.keys(updatedAlbum).length === 0) {
        setSnackbarMessage("No changes to save.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        return;
      }

      try {
        await fetchUpdateAlbums(albumToEdit._id, updatedAlbum);
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album._id === albumToEdit._id
              ? { ...album, ...updatedAlbum }
              : album
          )
        );
        setSnackbarMessage("Album updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to update album.");
        setSnackbarSeverity("error");
      } finally {
        setOpenEditDialog(false);
        setSnackbarOpen(true);
      }
    }
  };

  const openDeleteDialogHandler = (albumId) => {
    setAlbumToDelete(albumId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAlbum = async () => {
    try {
      await fetchDeleteAlbum(albumToDelete);
      setAlbums((prev) => prev.filter((album) => album._id !== albumToDelete));
      setSnackbarMessage("Album deleted successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to delete album.");
      setSnackbarSeverity("error");
    } finally {
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (!albumTitle) {
      loadAlbums(page);
    }
  }, [page, albumTitle]);

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
          Albums Management
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
            placeholder="Search Albums"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyDown}
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

      {/* Albums Table */}
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
                Release Date
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Cover Image
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
            ) : albumTitle ? (
              // Display the single search result
              <TableRow key={albumTitle._id}>
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
                  {albumTitle.title}
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  {new Date(albumTitle.releaseDate).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  <a
                    href={albumTitle.coverImageURL}
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
                    onClick={() => openEditDialogHandler(albumTitle)}
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
                    onClick={() => openDeleteDialogHandler(albumTitle._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : albums.length > 0 ? (
              albums.map((album, index) => (
                <TableRow key={album._id}>
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
                    {album.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    {new Date(album.releaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    <a
                      href={album.coverImageURL}
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
                      onClick={() => openEditDialogHandler(album)}
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
                      onClick={() => openDeleteDialogHandler(album._id)}
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
                  No albums found.
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
        <DialogTitle>Edit Album</DialogTitle>
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
            label="Release Date"
            type="date"
            value={editedReleaseDate}
            onChange={(e) => setEditedReleaseDate(e.target.value)}
            sx={{ marginBottom: "16px" }}
            InputLabelProps={{
              shrink: true,
              style: { color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
          <TextField
            fullWidth
            label="Cover Image URL"
            value={editedCoverImageURL}
            onChange={(e) => setEditedCoverImageURL(e.target.value)}
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
        <DialogTitle>Delete Album</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this album?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAlbum}
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

export default AlbumsManagement;
