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
  CircularProgress,
} from "@mui/material";

import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAlbumById } from "../../services/albumService";

function RightSideBar() {
  const [drawerWidth, setDrawerWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [artist, setAristID] = useState({});
  const [album, setAlbum] = useState({});
  const [open, setOpen] = useState(false);
  const [song, setSong] = useState({});
  const [Loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("/login");
  };
  const { user } = useAuth();

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const albumData = await fetchAlbumById(id);
        setAlbum(albumData);
        setAristID(albumData.artistID.description);
        console.log(
          "albumData.artistID.description",
          albumData.artistID.description
        );

        setSong(albumData.listSong);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    loadAlbum();
  }, [id]);

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
      const newWidth = window.innerWidth - e.clientX;
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
      anchor="right"
    >
      <div className="RightSideBar">
        {/* Header */}
        <Box sx={{ padding: "16px", textAlign: "center" }}>
          <Button
            onClick={toggleDrawerSize}
            variant="h6"
            component="div"
            sx={{ borderRadius: "10px", fontWeight: "bold", color: "#fff" }}
          >
            Artist
          </Button>
        </Box>
        <Divider sx={{ backgroundColor: "grey" }} />

        {user ? (
          !id ? (
            // Chưa click vào album (id chưa có)
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: user ? "calc(100vh - 400px)" : "100vh",
                backgroundColor: "#1e1e1e",
                padding: "16px",
                borderRadius: "15px",
                mt: 2,
              }}
            >
              <Typography
                fontWeight="bold"
                variant="body1"
                sx={{ color: "white", textAlign: "center" }}
              >
                Chào mừng! Hãy thưởng thức âm nhạc của bạn.
              </Typography>
            </Box>
          ) : (
            // Đã click vào album (có id), hiển thị info artist
            album &&
            album.artistID && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "calc(100vh - 400px)",
                  backgroundColor: "#1e1e1e",
                  padding: "16px",
                  borderRadius: "15px",
                  mt: 2,
                  textAlign: "center",
                }}
              >
                {album.artistID.imageURL ? (
                  <Box
                    component="img"
                    src={album.artistID.imageURL}
                    alt={album.artistID.name}
                    sx={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      mb: 2,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      backgroundColor: "#333",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography>Không có ảnh</Typography>
                  </Box>
                )}

                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Link
                    to={`/artists/${album.artistID._id}`}
                    style={{
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    {album.artistID.name || "Unknown Artist"}
                  </Link>
                </Typography>
                {album.artistID.role && (
                  <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
                    Vai trò: {album.artistID.role}
                  </Typography>
                )}
                {album.artistID.genre && (
                  <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
                    Thể loại: {album.artistID.genre}
                  </Typography>
                )}
                <Typography>Start Year: {artist.startYear}</Typography>
                <Typography>Difficulties: {artist.difficulties}</Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    fontWeight: "bold",
                    textTransform: "none",
                    mt: 2,
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                    },
                  }}
                >
                  Follow
                </Button>
              </Box>
            )
          )
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: album ? "calc(100vh - 400px)" : "100vh",
              backgroundColor: "#1e1e1e",
              padding: "16px",
              borderRadius: "15px",
              mt: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#1e1e1e",
                padding: "16px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              <Typography
                fontWeight="bold"
                variant="body1"
                sx={{ marginBottom: "16px", color: "white" }}
              >
                Hãy mở bài nhạc và tận hưởng nào
              </Typography>
              <Button
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  width: "100%",
                  fontWeight: "bold",
                }}
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Trước tiên hãy đăng nhập
              </Button>
            </Box>
          </Box>
        )}

        {/* Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Đăng nhập để tiếp tục
          </DialogTitle>
          <DialogContent>
            <Typography>
              Vui lòng đăng nhập để truy cập chức năng này.
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyleButtonHold onClick={() => setOpen(false)} color="primary">
              Để sau
            </StyleButtonHold>
            <StyledButton onClick={() => navigateLogin()}>
              Đăng nhập
            </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Resize handle */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "0",
            bottom: 0,
            width: "5px",
            cursor: "ew-resize",
            backgroundColor: "#121212",
          }}
          onMouseDown={startResize}
        />
      </div>
    </Drawer>
  );
}

export default RightSideBar;
