import "../App.css";
import React, { useContext, useState } from "react";
import { Snackbar, Alert, useMediaQuery } from "@mui/material";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/darkMode/ThemeProvider";
import { useAuth } from "../contexts/AuthContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { AdminPanelSettings as AdminIcon } from "@mui/icons-material";
import { fetchSearchSong } from "../services/songService";
import { useSearch } from "../contexts/SearchContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha("#2a2a2a", 1),
  width: "474px",
  height: "48px",
  "&:focus-within": {
    border: "2px solid #fff",
  },
  [theme.breakpoints.down("md")]: {
    width: "60px",
    marginRight: "0",
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

const StyledAvatar = styled(Avatar)(({ theme, isMobile }) => ({
  width: isMobile ? "30px" : "40px",
  height: isMobile ? "30px" : "40px",
  borderRadius: "50%",
  backgroundColor: "#888",
  fontSize: isMobile ? "20px" : "inherit",
  color: "#fff",
  display: isMobile ? "flex" : "block",
  justifyContent: isMobile ? "center" : "initial",
  alignItems: isMobile ? "center" : "initial",
  textTransform: isMobile ? "uppercase" : "none",
  transition: "all 0.3s ease",
}));

export default function MainHeader() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, signout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [authAnchorEl, setAuthAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const isMobile = window.innerWidth <= 600;
  const open = Boolean(anchorEl);
  const isIpad = useMediaQuery("(min-width:768px) and (max-width:1024px)");
  const [showSearch, setShowSearch] = useState(!isIpad);
  const { setCurrentSong } = useContext(MusicPlayerContext);
  const { updateSearchResults } = useSearch();
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    navigate(`users/${user.userId}/profile`);
  };

  const handleLogout = () => {
    signout();
    setCurrentSong(null);
    setAnchorEl(null);
    navigate("/");
  };
  const handleAuthMenuClick = (event) => {
    setAuthAnchorEl(event.currentTarget);
  };

  const handleAuthMenuClose = () => {
    setAuthAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = async (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      try {
        navigate("/songs");
        const results = await fetchSearchSong({ title: searchQuery });
        if (results.songs) {
          updateSearchResults(results.songs);
          console.log("Search Results:", results.songs);

          setSnackbarMessage(`Tìm thấy ${results.songs.length} bài hát.`);
          setSnackbarSeverity("success");
        } else {
          updateSearchResults([]);
          setSnackbarMessage("Không có bài hát nào tìm thấy!");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Error searching songs:", error);
        setSnackbarMessage("Lỗi khi tìm kiếm bài hát!");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  const handleMusicIconClick = () => {
    if (!user) {
      setSnackbarMessage("Please log in to listen to music.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      navigate("/login");
    } else {
      navigate("/songs");
    }
  };
  const handleAdminClick = () => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      setSnackbarMessage("You do not have permission to access this page.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };
  const handleFavoriteClick = () => {
    if (!user) {
      setSnackbarMessage("Vui lòng đăng nhập để thêm vào yêu thích.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      navigate("/login");
    } else {
      navigate("/me/favorites");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{ flexGrow: 1, margin: 0, padding: 0, overflowX: "auto" }}
        className="app-container"
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "12px",
            boxShadow: "none",
          }}
          className="app-bar"
        >
          <Toolbar
            sx={{
              padding: 0,
              margin: 0,
              height: "48px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="toolbar"
          >
            {/* Icon Toggle Dark Mode */}
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{
                marginLeft: "16px",
                color: "#ffffff",
              }}
              className="dark-mode-toggle"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {user && user.role === "admin" && (
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
                className="admin-icon-button"
              >
                <AdminIcon />
              </IconButton>
            )}
            {/*favorite Icon */}
            <IconButton
              color="inherit"
              onClick={handleFavoriteClick}
              sx={{
                marginLeft: "8px",
                transition: "color 0.3s",
              }}
              className="favorite-icon-button"
            >
              {user &&
              user.favoriteArtists &&
              user.favoriteArtists.length > 0 ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            {/* Home, Search and Note Icon */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: isMobile ? "flex-start" : "center",
                ml: isMobile ? 0 : 2,
                alignItems: "center",
              }}
              className="nav-buttons-container"
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
                className="home-button"
              />
              <Box
                sx={{
                  flexGrow: isMobile ? 1 : "unset",
                  display: "flex",
                  alignItems: "center",
                }}
                className="search-container"
              >
                <Search
                  sx={{
                    padding: isMobile ? "0px 4px" : "0px 3px",
                    width: isMobile ? "100%" : "474px",
                  }}
                  className="search-icon"
                >
                  <SearchIconWrapper>
                    <SearchIcon
                      sx={{ fontSize: "30px", paddingRight: "2px" }}
                      className="search-icon-inner"
                      onClick={() => {
                        if (isIpad && !showSearch) {
                          setShowSearch(true);
                        }
                      }}
                    />
                  </SearchIconWrapper>
                  {showSearch && (
                    <StyledInputBase
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyPress}
                      placeholder="Search..."
                      inputProps={{ "aria-label": "search" }}
                      sx={{ ml: "10px", paddingTop: "8px", width: "200px" }}
                      className="search-input"
                    />
                  )}
                </Search>
                <IconButton
                  onClick={handleMusicIconClick}
                  sx={{
                    ml: isMobile ? 10 : 2,
                    color: "#fff",
                    backgroundColor: "#1f1f1f",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "transparent",
                      transform: "scale(1.1)",
                    },
                  }}
                  className="music-icon-button"
                >
                  <MusicNoteIcon sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            </Box>

            {/* Register, Login, and Avatar */}
            {!user ? (
              <>
                {isMobile ? (
                  <IconButton
                    sx={{
                      color: "#fff",
                      mr: 10,
                      ml: 0,
                      padding: 0,
                    }}
                    onClick={handleAuthMenuClick}
                    aria-controls={authAnchorEl ? "auth-menu" : undefined}
                    aria-haspopup="true"
                  >
                    <MoreVertIcon fontSize="large" />
                  </IconButton>
                ) : (
                  <Box>
                    <Button
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
                      onClick={() => navigate("/register")}
                    >
                      Đăng Ký
                    </Button>
                    <Button
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
                      onClick={() => navigate("/login")}
                    >
                      Đăng Nhập
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{ padding: 0, mr: 15 }}
                  className="user-avatar-button"
                >
                  <StyledAvatar isMobile={isMobile}>
                    {isMobile ? <MoreVertIcon /> : <Avatar />}
                  </StyledAvatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  sx={{ mt: "40px" }}
                  className="user-menu"
                >
                  <MenuItem onClick={handleMenuClose} className="menu-item">
                    Cài đặt
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="menu-item">
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            )}
            <Menu
              id="auth-menu"
              anchorEl={authAnchorEl}
              open={Boolean(authAnchorEl)}
              onClose={handleAuthMenuClose}
              MenuListProps={{
                "aria-labelledby": "auth-button",
              }}
            >
              {/* Đăng Ký */}
              <MenuItem
                onClick={() => {
                  navigate("/register");
                  handleAuthMenuClose();
                }}
                sx={{
                  fontWeight: "bold",
                  color: "#888",
                  backgroundColor: "transparent",
                  borderRadius: "25px",
                  padding: "8px 16px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    color: "#000",
                    transform: "scale(1.1)",
                  },
                }}
              >
                Đăng Ký
              </MenuItem>

              {/* Đăng Nhập */}
              <MenuItem
                onClick={() => {
                  navigate("/login");
                  handleAuthMenuClose();
                }}
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
              </MenuItem>
            </Menu>
          </Toolbar>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            className="snackbar"
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
              className="alert-snackbar"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </AppBar>
      </Box>
    </>
  );
}
