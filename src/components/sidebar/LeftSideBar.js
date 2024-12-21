import "../../App.css";
import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Divider,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchPlaylistUser,
  fetchCreatePlaylistUser,
  fetchDeletePlaylist,
} from "../../services/playlistService";

function LeftSideBar() {
  const [drawerWidth, setDrawerWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = window.innerWidth <= 600;
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await fetchPlaylistUser(user.userId);
          setPlaylists(data.playlists);
        } catch (error) {
          console.error("Error fetching playlists: ", error);
        }
      } else {
        setPlaylists([]);
      }
    };

    fetchData();
  }, [user]);
  const startResize = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "default";
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
          setDrawerWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mouseup", stopResize);
      window.addEventListener("mousemove", handleResize);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, handleResize, stopResize]);

  const toggleDrawerSize = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerWidth(isDrawerOpen ? 0 : 240);
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/me/playlist/${playlistId}`);
  };

  const handleOpenCreateDialog = () => {
    if (!user) {
      setOpen(true);
      return;
    }
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setPlaylistTitle("");
  };

  const handleCreatePlaylist = async () => {
    if (!playlistTitle.trim()) {
      return;
    }

    try {
      console.log("User object:", user);
      const userId = user.userId || user.userId;

      if (!userId) {
        throw new Error("User ID is missing.");
      }

      await fetchCreatePlaylistUser(playlistTitle.trim(), userId);
      const data = await fetchPlaylistUser(userId);
      setPlaylists(data.playlists);
      console.log("data:", data.playlists);
      handleCloseCreateDialog();
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      if (playlistToDelete) {
        await fetchDeletePlaylist(playlistToDelete);
        setPlaylists(
          playlists.filter((playlist) => playlist._id !== playlistToDelete)
        );
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleOpenDeleteDialog = (playlistId) => {
    setPlaylistToDelete(playlistId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPlaylistToDelete(null);
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    color: "#000",
    fontWeight: "bold",
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
  }));

  const StyleButtonHold = styled(Button)(({ theme }) => ({
    color: "#000",
    fontWeight: "bold",
    border: "1px solid #fff",
    borderRadius: "25px",
    padding: "8px 16px",
    top: "1px",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#000",
      transform: "scale(1.1)",
    },
  }));

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
      className="left-side-bar"
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: isMobile ? "fixed" : "null",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#121212",
            transition: "all 0.3s ease",
            border: "none",
            color: "white",
            maxHeight: "100%",
            borderRadius: "10px",
            position: "relative",
          },
        }}
        variant="permanent"
        anchor="left"
        className="drawer"
      >
        <Box
          sx={{
            padding: "16px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
          className="sidebar-header"
        >
          <IconButton
            onClick={handleOpenCreateDialog}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              "&:hover": { transform: "scale(1.1)" },
            }}
            className="create-button"
          >
            <AddIcon sx={{ color: "#000", fontWeight: "bold" }} />
          </IconButton>
          <Button
            onClick={toggleDrawerSize}
            variant="h6"
            component="div"
            sx={{
              borderRadius: "10px",
              fontWeight: "bold",
              color: "white",
              textTransform: "none",
            }}
            className="library-button"
          >
            Thư Viện
          </Button>
        </Box>
        <Divider sx={{ backgroundColor: "grey" }} className="divider" />

        {/* Content */}
        {playlists.length === 0 ? (
          <Box
            sx={{
              padding: "16px",
              textAlign: "center",
              height: "250px",
            }}
            className="empty-playlist-message"
          >
            <Typography variant="h6" color="white" className="welcome-message">
              Chào mừng
            </Typography>
            <Typography color="grey" className="create-first-playlist-message">
              Tạo danh sách đầu tiên của bạn
            </Typography>
          </Box>
        ) : (
          playlists.map((playlist) => (
            <Box
              key={playlist._id}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#1e1e1e",
                borderRadius: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={() => handlePlaylistClick(playlist._id)}
              className="playlist-item"
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="white"
                className="playlist-title"
              >
                {playlist.title}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDeleteDialog(playlist._id);
                }}
                sx={{
                  marginLeft: "auto",
                  color: "#fff",
                }}
                className="delete-button"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}

        {/* Dialog Yêu cầu đăng nhập */}
        <Dialog open={open} onClose={handleClose} className="login-dialog">
          <DialogTitle sx={{ fontWeight: "bold" }} className="dialog-title">
            Tạo danh sách phát
          </DialogTitle>
          <DialogContent>
            <Typography className="dialog-message">
              Đăng nhập để tạo playlist
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyleButtonHold onClick={handleClose} className="dialog-button">
              Để sau
            </StyleButtonHold>
            <StyledButton
              onClick={() => navigate("/login")}
              className="dialog-button"
            >
              Đăng nhập
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Dialog tạo playlist */}
        <Dialog
          open={openCreateDialog}
          onClose={handleCloseCreateDialog}
          className="create-playlist-dialog"
        >
          <DialogTitle sx={{ fontWeight: "bold" }} className="dialog-title">
            Tạo playlist mới
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên Playlist"
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              variant="outlined"
              sx={{ marginBottom: 2 }}
              className="playlist-name-input"
            />
          </DialogContent>
          <DialogActions>
            <StyledButton
              onClick={handleCreatePlaylist}
              className="dialog-button"
            >
              Tạo
            </StyledButton>
            <StyledButton
              onClick={handleCloseCreateDialog}
              className="dialog-button"
            >
              Đóng
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Dialog xóa playlist */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          className="delete-playlist-dialog"
        >
          <DialogTitle sx={{ fontWeight: "bold" }} className="dialog-title">
            Xóa Playlist
          </DialogTitle>
          <DialogContent>
            <Typography className="dialog-message">
              Bạn có chắc chắn muốn xóa playlist này không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyledButton
              onClick={handleDeletePlaylist}
              className="dialog-button"
            >
              Xóa
            </StyledButton>
            <StyledButton
              onClick={handleCloseDeleteDialog}
              className="dialog-button"
            >
              Hủy
            </StyledButton>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            cursor: "ew-resize",
          }}
          onMouseDown={startResize}
          className="resize-handle"
        />
      </Drawer>
      <Button
        onClick={toggleDrawerSize}
        sx={{
          borderRadius: "50%",
          minWidth: "48px",
          minHeight: "48px",
          width: "48px",
          height: "48px",
          position: "fixed",
          top: "50%",
          left: "16px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            transform: "translateY(-50%) scale(1.1)",
          },
        }}
      >
        <ArrowLeftIcon
          sx={{
            fontSize: "24px",
            transform: isDrawerOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </Button>
    </Box>
  );
}

export default LeftSideBar;
