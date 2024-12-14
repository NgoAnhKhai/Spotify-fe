import React, { useState, useEffect } from "react";
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
  const [playlists, setPlaylists] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const startResize = () => {
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
  };

  const stopResize = () => {
    setIsResizing(false);
    document.body.style.cursor = "default";
  };

  const handleResize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setDrawerWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  const toggleDrawerSize = () => {
    if (isExpanded) {
      setDrawerWidth(240);
    } else {
      setDrawerWidth(500);
    }
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
        ); // Remove the playlist from the list
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
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#000",
      transform: "scale(1.1)",
    },
  }));

  return (
    <div className="LeftSideBar">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "sticky",
            boxSizing: "border-box",
            backgroundColor: "#121212",
            border: "none",
            color: "white",
            borderRadius: "10px",
          },
        }}
        variant="permanent"
        anchor="left"
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
          >
            Thư Viện
          </Button>
        </Box>
        <Divider sx={{ backgroundColor: "grey" }} />

        {/* Content */}
        {playlists.length === 0 ? (
          <Box
            sx={{
              padding: "16px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="white">
              Chào mừng
            </Typography>
            <Typography color="grey">Tạo danh sách đầu tiên của bạn</Typography>
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
            >
              <Typography variant="h6" fontWeight="bold" color="white">
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
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}

        {/* Dialog Yêu cầu đăng nhập */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Tạo danh sách phát
          </DialogTitle>
          <DialogContent>
            <Typography>Đăng nhập để tạo playlist</Typography>
          </DialogContent>
          <DialogActions>
            <StyleButtonHold onClick={handleClose}>Để sau</StyleButtonHold>
            <StyledButton onClick={() => navigate("/login")}>
              Đăng nhập
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Dialog tạo playlist */}
        <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
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
            />
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleCreatePlaylist}>Tạo</StyledButton>
            <StyledButton onClick={handleCloseCreateDialog}>Đóng</StyledButton>
          </DialogActions>
        </Dialog>

        {/* Dialog xóa playlist */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Xóa Playlist</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa playlist này không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleDeletePlaylist}>Xóa</StyledButton>
            <StyledButton onClick={handleCloseDeleteDialog}>Hủy</StyledButton>
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
        />
      </Drawer>
    </div>
  );
}

export default LeftSideBar;
