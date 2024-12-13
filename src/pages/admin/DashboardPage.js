import React, { useEffect, useState } from "react";
import MainHeader from "../../layout/MainHeader";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import fetchGetAllUser from "../../services/adminServices.js/UsersAdminServices.js/fetchGetAllUser";
import fetchDeleteUser from "../../services/adminServices.js/UsersAdminServices.js/fetchDeleteUser";
import { updateUserProfile } from "../../services/profileService";

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

  // Load users from the server
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

  // Open Edit Dialog
  const openEditDialogHandler = (user) => {
    setUserToEdit(user);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
    setOpenEditDialog(true);
  };

  // Open Delete Dialog
  const openDeleteDialogHandler = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setUserToEdit(null);
    setEditedUsername("");
    setEditedEmail("");
  };

  // Close Delete Dialog
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

        setSnackbarMessage("User updated successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to update user.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseEditDialog();
        setOpenSnackbar(true);
      }
    }
  };

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  // Delete User
  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await fetchDeleteUser(userToDelete);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete)
        );
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to delete user.");
        setSnackbarSeverity("error");
      } finally {
        handleCloseDeleteDialog();
        setOpenSnackbar(true);
      }
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
                  <IconButton color="primary">
                    <AddIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Users
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Invoices
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Date
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
