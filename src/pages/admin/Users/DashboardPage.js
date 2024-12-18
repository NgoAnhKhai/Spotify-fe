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
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import fetchGetAllUser from "../../../services/adminServices.js/UsersAdminServices.js/fetchGetAllUser";
import fetchDeleteUser from "../../../services/adminServices.js/UsersAdminServices.js/fetchDeleteUser";
import { updateUserProfile } from "../../../services/profileService";
import { useNavigate } from "react-router-dom";
import fetchAssignRole from "../../../services/adminServices.js/UsersAdminServices.js/fetchAssignRole";
import fetchRevertToUser from "../../../services/adminServices.js/UsersAdminServices.js/fetchRevertToUser";
import UserHeader from "../../../components/headerAdmin/UserHeader.js";
import { NameContext } from "../../../contexts/adminFindContext/findUserContext.js";

const DashboardPage = () => {
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorEl, setAnchorEl] = useState(null);
  const { name, setName } = useContext(NameContext);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const loadUsers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const data = await fetchGetAllUser(currentPage, 10);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleRefresh = () => {
    setName(null);
    setPage(1);
    loadUsers(1);
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

  const handleSaveChanges = async () => {
    if (userToEdit) {
      const updatedProfile = {};

      if (editedUsername !== userToEdit.username) {
        updatedProfile.username = editedUsername;
      }

      if (editedEmail !== userToEdit.email) {
        updatedProfile.email = editedEmail;
      }

      if (Object.keys(updatedProfile).length === 0) {
        setSnackbarMessage("Không có thay đổi nào để lưu.");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        return;
      }

      try {
        await updateUserProfile(userToEdit._id, updatedProfile);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userToEdit._id ? { ...user, ...updatedProfile } : user
          )
        );
        if (name && name._id === userToEdit._id) {
          setName({ ...name, ...updatedProfile });
        }
        setSnackbarMessage("User updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to update user.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
      }
    }
  };

  useEffect(() => {
    if (!name) {
      loadUsers(page);
    }
  }, [page, name]);

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
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to assign role.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to revert user role.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleAssignArtistRole = (userId) => {
    const artistDetails = { name: "Artist Name", startYear: 2020 };
    handleAssignRole(userId, "artist", artistDetails);
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
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage("Failed to delete user.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        handleCloseDeleteDialog();
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
      <UserHeader />
      <div className="dashboard-container">
        {name && (
          <div style={{ marginBottom: "20px" }}>
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
              Kết quả tìm kiếm cho: <strong>{name.username}</strong>
            </Alert>
          </div>
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
                    fontWeight: "bold",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  Users
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  Invoices
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid #ddd",
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
              ) : name ? (
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    1
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {name.username}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {name.email}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {name.subscriptionType}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {new Date(name.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    {name.role}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialogHandler(name)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => openDeleteDialogHandler(name._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {user.username}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {user.subscriptionType}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ddd", textAlign: "center" }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialogHandler(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => openDeleteDialogHandler(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                      {user.role !== "admin" && (
                        <>
                          {user.role !== "artist" && (
                            <IconButton
                              onClick={() => handleAssignArtistRole(user._id)}
                            >
                              <PersonAddIcon />
                            </IconButton>
                          )}

                          {user.role === "artist" && (
                            <IconButton
                              onClick={() => handleRevertToUser(user._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </>
                      )}
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

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              fullWidth
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Email"
              fullWidth
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
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
            <Button onClick={handleDeleteUser} color="secondary">
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

export default DashboardPage;
