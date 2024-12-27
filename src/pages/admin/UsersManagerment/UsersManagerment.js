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
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import fetchGetAllUser from "../../../services/adminServices.js/UsersAdminServices.js/fetchGetAllUser";
import fetchDeleteUser from "../../../services/adminServices.js/UsersAdminServices.js/fetchDeleteUser";
import { updateUserProfile } from "../../../services/profileService";
import { fetchFindUserByName } from "../../../services/adminServices.js/UsersAdminServices.js/fetchFindUserByName";
import { NameContext } from "../../../contexts/adminFindContext/findUserContext.js";
import fetchAssignRole from "../../../services/adminServices.js/UsersAdminServices.js/fetchAssignRole.js";
import fetchRevertToUser from "../../../services/adminServices.js/UsersAdminServices.js/fetchRevertToUser.js";
import { useTheme } from "@mui/material/styles";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");

  const { name, setName } = useContext(NameContext);
  const theme = useTheme();

  const loadUsers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllUser(currentPage, 10);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load users", error);
      setSnackbarMessage("Failed to load users.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    loadUsers(value);
  };

  const openEditDialogHandler = (user) => {
    setUserToEdit(user);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setUserToEdit(null);
    setEditedUsername("");
    setEditedEmail("");
  };

  const openDeleteDialogHandler = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleAssignRole = async (userId, newRole, artistDetails = null) => {
    try {
      await fetchAssignRole(userId, newRole, artistDetails);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      setSnackbarMessage("Role updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to assign role.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleRevertToUser = async (userId) => {
    try {
      await fetchRevertToUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: "user" } : user
        )
      );
      setSnackbarMessage("User reverted to normal.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to revert user role.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAssignArtistRole = (userId) => {
    const artistDetails = { name: "Artist Name", startYear: 2020 };
    handleAssignRole(userId, "artist", artistDetails);
  };

  const handleSaveChanges = async () => {
    if (userToEdit) {
      const updatedProfile = {};
      if (editedUsername !== userToEdit.username)
        updatedProfile.username = editedUsername;
      if (editedEmail !== userToEdit.email) updatedProfile.email = editedEmail;

      try {
        await updateUserProfile(userToEdit._id, updatedProfile);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userToEdit._id ? { ...user, ...updatedProfile } : user
          )
        );
        setSnackbarMessage("User updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleCloseEditDialog();
      } catch (error) {
        setSnackbarMessage("Failed to update user.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await fetchDeleteUser(userToDelete);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete)
        );
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleCloseDeleteDialog();
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Failed to delete user.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setName(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchFindUserByName(searchQuery.trim());

      if (response && response.user) {
        setName(response.user);
        setSnackbarMessage(`Found user: ${response.user.username}`);
        setSnackbarSeverity("success");
      } else {
        setName(null);
        setSnackbarMessage("No user found with the given name.");
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSnackbarMessage("Failed to search user.");
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

  useEffect(() => {
    if (!name) {
      loadUsers(page);
    }
  }, [page, name]);

  const handleRefresh = () => {
    setName(null);
    setPage(1);
    loadUsers(1);
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
          Users Management
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
            placeholder="Search Users"
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

      {/* Users Table */}
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
                Username
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Subscription
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Date
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
              <TableRow sx={{ height: "60px" }}>
                <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : name ? (
              name.role !== "admin" ? (
                <TableRow sx={{ height: "60px" }}>
                  <TableCell sx={{ textAlign: "center" }}>1</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {name.username}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {name.email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {name.subscriptionType || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Date(name.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {name.role}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {/* Edit Icon */}
                    <IconButton
                      onClick={() => openEditDialogHandler(name)}
                      sx={{
                        color:
                          theme.palette.mode === "light"
                            ? "#000"
                            : theme.palette.text.primary,
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    {/* Assign Role Icon */}
                    <IconButton
                      onClick={
                        name.role === "artist"
                          ? () => handleRevertToUser(name._id)
                          : () => handleAssignArtistRole(name._id)
                      }
                      sx={{
                        color:
                          theme.palette.mode === "light"
                            ? "#000"
                            : theme.palette.primary.main,
                      }}
                    >
                      {name.role === "artist" ? (
                        <CloseIcon />
                      ) : (
                        <PersonAddIcon />
                      )}
                    </IconButton>
                    {/* Delete Icon */}
                    <IconButton
                      sx={{ color: theme.palette.error.main }}
                      onClick={() => openDeleteDialogHandler(name._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow sx={{ height: "60px" }}>
                  <TableCell
                    colSpan={7}
                    sx={{
                      textAlign: "center",
                      color: theme.palette.text.secondary,
                      fontStyle: "italic",
                    }}
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )
            ) : users.filter((user) => user.role !== "admin").length > 0 ? (
              users
                .filter((user) => user.role !== "admin")
                .map((user, index) => (
                  <TableRow key={user._id} sx={{ height: "60px" }}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {user.username}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {user.subscriptionType || "N/A"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {user.role}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {/* Edit Icon */}
                      <IconButton
                        onClick={() => openEditDialogHandler(user)}
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#000"
                              : theme.palette.text.primary,
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      {/* Assign Role Icon */}
                      <IconButton
                        onClick={
                          user.role === "artist"
                            ? () => handleRevertToUser(user._id)
                            : () => handleAssignArtistRole(user._id)
                        }
                        sx={{
                          color:
                            theme.palette.mode === "light"
                              ? "#000"
                              : theme.palette.primary.main,
                        }}
                      >
                        {user.role === "artist" ? (
                          <CloseIcon />
                        ) : (
                          <PersonAddIcon />
                        )}
                      </IconButton>
                      {/* Delete Icon */}
                      <IconButton
                        sx={{ color: theme.palette.error.main }}
                        onClick={() => openDeleteDialogHandler(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow sx={{ height: "60px" }}>
                <TableCell
                  colSpan={7}
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  No users found.
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
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
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
            label="Email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
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
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersManagement;
