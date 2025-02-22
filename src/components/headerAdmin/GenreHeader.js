import React, { useContext, useState } from "react";
import {
  styled,
  alpha,
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  CssBaseline,
  Box,
  Avatar,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import { AdminPanelSettings as AdminIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { GenreContext } from "../../contexts/adminFindContext/findGenreContext";
import { fetchGenreByName } from "../../services/adminServices.js/GenresAdminServices.js/fetchFindGenreByName";

// Styled components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha("#2a2a2a", 1),
  width: "474px",
  height: "48px",
  "&:focus-within": {
    border: "2px solid #fff",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    height: "100%",
  },
}));

export default function GenreHeader() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const { setGenreName } = useContext(GenreContext);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    navigate("users/me/profile");
  };

  const handleLogout = () => {
    signout();
    setAnchorEl(null);
    navigate("/");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = async (event) => {
    const query = String(searchQuery).trim();

    if (event.key === "Enter" && query.trim() !== "") {
      try {
        const results = await fetchGenreByName(query);

        console.log("result:", results.genres);
        if (results) {
          setGenreName(results.genres);
          setSnackbarMessage("genre found successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("No genre found.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error searching genre:", error);
        setSnackbarMessage("Error while searching for genre.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleAdminClick = () => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard/users");
    } else {
      setSnackbarMessage("You do not have permission to access this page.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, margin: 0, padding: 0 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "12px",
            boxShadow: "none",
          }}
        >
          <Toolbar
            sx={{
              padding: 0,
              margin: 0,
              height: "48px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              onClick={handleAdminClick}
              sx={{
                color: "#fff",
                marginLeft: "16px",
                fontSize: "30px",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <AdminIcon />
            </IconButton>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                ml: 2,
                alignItems: "center",
              }}
            >
              <Button
                color="inherit"
                startIcon={
                  <HomeIcon sx={{ ml: 1, color: "#fff", fontSize: "30px" }} />
                }
                sx={{
                  color: "#1f1f1f",
                  fontWeight: "bold",
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #1f1f1f",
                  borderRadius: "50px",
                  padding: "8px 16px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "transparent",
                    transform: "scale(1.1)",
                  },
                }}
                onClick={() => navigate("/")}
              />
              <Search sx={{ padding: "0px 10px" }}>
                <SearchIconWrapper>
                  <SearchIcon sx={{ fontSize: "35px", paddingRight: "10px" }} />
                </SearchIconWrapper>
                <StyledInputBase
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyPress}
                  placeholder="What Do You Want ?"
                  inputProps={{ "aria-label": "search" }}
                  sx={{ paddingTop: "8px" }}
                />
              </Search>
            </Box>

            {!user ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/register")}
                  sx={{
                    fontWeight: "bold",
                    color: "#888",
                    backgroundColor: "transparent",
                    borderRadius: "25px",
                    padding: "8px 16px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#f0f0f0",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  Đăng Ký
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{
                    fontWeight: "bold",
                    color: "#000",
                    backgroundColor: "#fff",
                    border: "1px solid #fff",
                    borderRadius: "25px",
                    padding: "8px 16px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  Đăng Nhập
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{ padding: 0, ml: 2 }}
                >
                  <Avatar alt={user.email} src="/avatar-placeholder.png" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  sx={{ mt: "40px" }}
                >
                  <MenuItem onClick={handleMenuClose}>Cài đặt</MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              severity={snackbarSeverity}
              onClose={() => setSnackbarOpen(false)}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </AppBar>
      </Box>
    </>
  );
}
