import React, { useState, useEffect, useCallback, useContext } from "react";
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
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useMatch, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAlbumById } from "../../services/albumService";
import { fetchFollowingArtist } from "../../services/favorites/followArtists";
import { fetchUnfollowingArtists } from "../../services/favorites/unfollowArtists";
import { isFollowingArtist } from "../../services/favorites/fetchIsFollowingArtist";
import { MusicPlayerContext } from "../../contexts/MusicPlayerContext";
import ScrollComponent from "../Scroll/ScrollContainer";
import SongInfo from "../../info/SongInfo";
import AlbumInfo from "../../info/AlbumInfo";
import { fetchArtistById } from "../../services/artistService";
import ArtistInfo from "../../info/ArtistInfo";
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

function RightSideBar() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [drawerWidth, setDrawerWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [album, setAlbum] = useState(null);
  const [open, setOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const { currentSong } = useContext(MusicPlayerContext);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [artist, setArtist] = useState(null);
  const [artistLoading, setArtistLoading] = useState(false);
  const [artistError, setArtistError] = useState(null);
  const matchArtist = useMatch("/artist/:id");
  const matchAlbum = useMatch("/album/:id");

  // Resize Handlers
  const startResize = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
          setDrawerWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    const loadData = async () => {
      if (matchArtist) {
        const artistId = matchArtist.params.id;
        if (!artistId) {
          setArtist(null);
          setArtistLoading(false);
          return;
        }

        setArtistLoading(true);
        try {
          const response = await fetchArtistById(artistId);
          if (response.success) {
            setArtist(response.artist);
            if (user && response.artist._id) {
              const followingStatus = await isFollowingArtist(
                response.artist._id
              );
              setIsFollowing(followingStatus.isFollowing);
            }
          } else {
            setArtistError("Không tìm thấy nghệ sĩ.");
          }
        } catch (error) {
          console.error("Error fetching artist:", error);
          setArtistError("Đã xảy ra lỗi khi tải dữ liệu nghệ sĩ.");
        } finally {
          setArtistLoading(false);
        }
      } else if (matchAlbum) {
        const albumId = matchAlbum.params.id;
        if (!albumId) {
          setAlbum(null);
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const albumData = await fetchAlbumById(albumId);
          setAlbum(albumData);

          if (user && albumData.artistID && albumData.artistID._id) {
            const followingStatus = await isFollowingArtist(
              albumData.artistID._id
            );
            console.log("Following Status:", followingStatus.isFollowing);
            setIsFollowing(followingStatus.isFollowing);
          }

          setLoading(false);
        } catch (error) {
          console.error("Error loading album and follow status:", error);
          setLoading(false);
        }
      } else {
        setArtist(null);
        setAlbum(null);
        setArtistLoading(false);
        setLoading(false);
      }
    };

    loadData();
  }, [matchArtist, matchAlbum, user]);

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

  const handleFollowClick = async () => {
    if (!user) {
      setOpen(true);
      return;
    }

    try {
      if (isFollowing) {
        await fetchUnfollowingArtists(album.artistID._id);
        setIsFollowing(false);
        setSnackbarMessage("Huỷ theo dõi nghệ sĩ thành công!");
      } else {
        await fetchFollowingArtist(album.artistID._id);
        setIsFollowing(true);
        setSnackbarMessage("Theo dõi nghệ sĩ thành công!");
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error in follow/unfollow:", err);
      setSnackbarMessage(
        err.message || "Đã xảy ra lỗi khi cập nhật trạng thái theo dõi."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const toggleDrawerSize = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerWidth(isDrawerOpen ? 0 : 240);
    setIsExpanded(!isExpanded);
  };
  if (isMobile) {
    return null;
  }
  const navigateLogin = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
      }}
      className="right-side-bar"
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#121212",
            transition: "all 0.3s ease",
            border: "none",
            color: "white",
            borderRadius: "10px",
            position: "unset",
            maxHeight: "75vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",

            zIndex: 1201,
          },
        }}
        variant="permanent"
        anchor="right"
        className="drawer"
      >
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

        <ScrollComponent>
          {user ? (
            matchArtist || matchAlbum ? (
              <Box>
                {/* Nếu là trang album */}
                {matchAlbum && (
                  <>
                    {!loading && album ? (
                      <AlbumInfo
                        album={album}
                        isFollowing={isFollowing}
                        handleFollowClick={handleFollowClick}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "calc(100vh - 400px)",
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
                          Đang tải album...
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                {/* Nếu là trang nghệ sĩ */}
                {matchArtist && (
                  <>
                    {artistLoading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "calc(100vh - 400px)",
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
                          Đang tải thông tin nghệ sĩ...
                        </Typography>
                      </Box>
                    ) : artist ? (
                      <ArtistInfo
                        artist={artist}
                        isFollowing={isFollowing}
                        handleFollowClick={handleFollowClick}
                      />
                    ) : artistError ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "calc(100vh - 400px)",
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
                          {artistError}
                        </Typography>
                      </Box>
                    ) : null}
                  </>
                )}
              </Box>
            ) : currentSong ? (
              <SongInfo
                song={currentSong}
                isFollowing={isFollowing}
                handleFollowClick={handleFollowClick}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100vh - 200px)",
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
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 200px)",
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
              top: 0,
              right: drawerWidth - 5,
              width: "10px",
              height: "100%",
              cursor: "ew-resize",
              backgroundColor: "transparent",
              zIndex: 10,
            }}
            onMouseDown={startResize}
            className="resize-handle"
          />
        </ScrollComponent>
      </Drawer>
      {!isMobile && (
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
            right: "16px",
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
              transform: isDrawerOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.7s ease",
            }}
          />
        </Button>
      )}
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RightSideBar;
