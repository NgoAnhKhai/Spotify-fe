import React, { useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/darkMode/ThemeProvider";
import { useAuth } from "../contexts/AuthContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { fetchSearchSong } from "../services/songService";
import { useSearch } from "../contexts/SearchContext";

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

export default function MainHeader() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, signout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const open = Boolean(anchorEl);

  const { updateSearchResults } = useSearch();
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
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/songs?title=${encodeURIComponent(searchQuery)}`);

      try {
        const results = await fetchSearchSong({ title: searchQuery });
        if (results.songs && results.songs.length > 0) {
          updateSearchResults(results.songs);
          navigate("/songs");
        } else {
          setSnackbarMessage("Không có bài hát nào tìm thấy!");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error searching songs:", error);
        setSnackbarMessage("Không có bài hát nào tìm thấy!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
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
            {/* Icon Toggle Dark Mode */}
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{
                marginLeft: "16px",
                color: "#ffffff",
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Home, Search and Note Icon */}
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Search sx={{ padding: "0px 10px" }}>
                  <SearchIconWrapper>
                    <SearchIcon
                      sx={{ fontSize: "35px", paddingRight: "10px" }}
                    />
                  </SearchIconWrapper>
                  <StyledInputBase
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyPress} // Handle key press event
                    placeholder="What Do You Want To Play ?"
                    inputProps={{ "aria-label": "search" }}
                    sx={{ paddingTop: "8px" }}
                  />
                </Search>
                <IconButton
                  onClick={() => navigate("/songs")}
                  sx={{
                    ml: 2,
                    color: "#fff",
                    backgroundColor: "#1f1f1f",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "transparent",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <MusicNoteIcon sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            </Box>

            {/* Register, Login, and Avatar */}
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
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </AppBar>
      </Box>
    </>
  );
}
