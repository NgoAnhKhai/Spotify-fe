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
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchGetAllGenres } from "../../../services/adminServices.js/GenresAdminServices.js/fetchAllGenres";
import { fetchDeleteGenre } from "../../../services/adminServices.js/GenresAdminServices.js/fetchDeleteGenres";
import { fetchUpdateGenres } from "../../../services/adminServices.js/GenresAdminServices.js/fetchUpdateGenres";
import { fetchGenreByName } from "../../../services/adminServices.js/GenresAdminServices.js/fetchFindGenreByName";
import { GenreContext } from "../../../contexts/adminFindContext/findGenreContext";
import { useTheme } from "@mui/material/styles";

const GenresManagement = () => {
  const { genreName, setGenreName } = useContext(GenreContext);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState(null);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");

  const theme = useTheme();

  const loadGenres = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllGenres(currentPage, 10);
      setGenres(data.genres);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load genres", error);
      setSnackbarMessage("Failed to load genres.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setGenreName(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchGenreByName(searchQuery.trim());
      console.log("response", response);

      if (response && response.genres) {
        setGenreName(response.genres);
        setSnackbarMessage(`Found genre: ${response.genres.name}`);
        setSnackbarSeverity("success");
      } else {
        setGenreName(null);
        setSnackbarMessage("No genre found with the given name.");
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSnackbarMessage("Failed to search genre.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!genreName) {
      loadGenres(page);
    }
  }, [genreName, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    loadGenres(value);
  };

  const handleRefresh = () => {
    setGenreName(null);
    setPage(1);
    loadGenres(1);
  };

  const openEditDialogHandler = (genre) => {
    setGenreToEdit(genre);
    setEditedName(genre.name);
    setEditedDescription(genre.description);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setGenreToEdit(null);
    setEditedName("");
    setEditedDescription("");
  };

  const handleSaveChanges = async () => {
    if (genreToEdit) {
      const updatedGenre = {
        name: editedName,
        description: editedDescription,
      };

      try {
        await fetchUpdateGenres(genreToEdit._id, updatedGenre);
        setGenres((prevGenres) =>
          prevGenres.map((genre) =>
            genre._id === genreToEdit._id
              ? { ...genre, ...updatedGenre }
              : genre
          )
        );

        if (genreName && genreName._id === genreToEdit._id) {
          setGenreName({ ...genreName, ...updatedGenre });
        }

        setSnackbarMessage("Genre updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to update genre.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setSnackbarOpen(true);
      }
    }
  };

  const openDeleteDialogHandler = (genreId) => {
    setGenreToDelete(genreId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setGenreToDelete(null);
  };

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
          Genres Management
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
            placeholder="Search Genres"
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

      {/* Genres Table */}
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
                Description
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
            ) : genreName ? (
              // Display the single search result
              <TableRow key={genreName._id}>
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
                  {genreName.name}
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  {genreName.description.length > 50
                    ? `${genreName.description.slice(0, 50)}...`
                    : genreName.description}
                </TableCell>
                <TableCell
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  {/* Edit Icon */}
                  <IconButton
                    onClick={() => openEditDialogHandler(genreName)}
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
                    onClick={() => openDeleteDialogHandler(genreName._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : genres.length > 0 ? (
              genres.map((genre, index) => (
                <TableRow key={genre._id}>
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
                    {genre.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    {genre.description.length > 50
                      ? `${genre.description.slice(0, 50)}...`
                      : genre.description}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    {/* Edit Icon */}
                    <IconButton
                      onClick={() => openEditDialogHandler(genre)}
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
                      onClick={() => openDeleteDialogHandler(genre._id)}
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
                  No genres found.
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
        <DialogTitle>Edit Genre</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Genre Name"
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
            label="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
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
        <DialogTitle>Delete Genre</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this genre?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteGenre}
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

export default GenresManagement;
