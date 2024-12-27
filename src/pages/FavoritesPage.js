import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { fetchUnfollowingArtists } from "../services/favorites/unfollowArtists";
import { fetchAllFavoriteArtists } from "../services/favorites/fetchAllFavoriteArtists";
import { useAuth } from "../contexts/AuthContext";
import useMediaQuery from "@mui/material/useMediaQuery";

const FavoritesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [unfollowing, setUnfollowing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const isIpad = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadFavoriteArtists = async () => {
      try {
        if (isPhone || isIpad) {
          const response = await fetchAllFavoriteArtists(1, 1000);
          setFavoriteArtists(response.user.favoriteArtists);
          setTotalPages(1);
          setCurrentPage(1);
        } else {
          const response = await fetchAllFavoriteArtists(currentPage, 4);
          setFavoriteArtists(response.user.favoriteArtists);
          setTotalPages(response.pagination.totalPages);
        }
      } catch (err) {
        console.error("Error fetching favorite artists:", err);
        setError("Không thể tải danh sách nghệ sĩ yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteArtists();
  }, [user, navigate, currentPage, isPhone, isIpad]);

  const handleUnfollow = async (artistId) => {
    setUnfollowing(true);
    try {
      await fetchUnfollowingArtists(artistId);
      setFavoriteArtists((prevArtists) =>
        prevArtists.filter((artist) => artist._id !== artistId)
      );
      setSnackbarMessage("Huỷ theo dõi nghệ sĩ thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error unfollowing artist:", err);
      setSnackbarMessage(err.message || "Đã xảy ra lỗi khi huỷ theo dõi.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUnfollowing(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflowY: "auto",
        padding: theme.spacing(4),
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
            : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
        transition: "background 0.5s ease",
        minHeight: "70vh",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: isPhone ? "-70px" : isIpad ? "auto" : "0",
        width: isPhone ? "calc(100% + 70px)" : "100%",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: theme.spacing(4),
          textAlign: "center",
          fontWeight: "bold",
          color: theme.palette.text.primary,
          transition: "color 0.5s ease",
        }}
      >
        Favorite
      </Typography>

      {favoriteArtists.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: theme.palette.text.secondary }}
        >
          Bạn chưa yêu thích nghệ sĩ nào.
        </Typography>
      ) : (
        <>
          {isPhone || isIpad ? (
            <Box
              sx={{
                width: "100%",
                flexGrow: 1,
                overflowY: "auto",
                maxHeight: "80vh",
                paddingBottom: theme.spacing(4),
              }}
            >
              <Grid container spacing={4} justifyContent="center">
                {favoriteArtists.map((artist) => (
                  <Grid item xs={12} sm={6} md={4} key={artist._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2c3e50" : "#ecf0f1",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      {/* Đặt hình ảnh nghệ sĩ ở trung tâm và làm hình tròn */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            width: isIpad ? 200 : 150,
                            height: isIpad ? 200 : 150,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          image={
                            artist.imageURL
                              ? artist.imageURL
                              : "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={artist.name}
                        />
                      </Box>

                      {/* Name */}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          textAlign: "center",
                          padding: theme.spacing(2),
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component={RouterLink}
                          to={`/artists/${artist._id}`}
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            transition: "color 0.5s ease",
                            textDecoration: "none",
                            color: theme.palette.text.primary,
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                            cursor: "pointer",
                          }}
                        >
                          {artist.name}
                        </Typography>
                      </CardContent>

                      {/* Nút "Unfollow" */}
                      <CardActions
                        sx={{
                          justifyContent: "center",
                          paddingBottom: theme.spacing(2),
                        }}
                      >
                        <Tooltip title="Huỷ theo dõi nghệ sĩ">
                          <Button
                            size="small"
                            onClick={() => handleUnfollow(artist._id)}
                            sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                              border: `1px solid ${
                                theme.palette.mode === "dark"
                                  ? theme.palette.grey[700]
                                  : theme.palette.grey[300]
                              }`,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : theme.palette.text.primary,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? theme.palette.grey[700]
                                  : theme.palette.grey[300],
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? theme.palette.grey[600]
                                    : theme.palette.grey[400],
                              },
                            }}
                            disabled={unfollowing}
                          >
                            {unfollowing ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Unfollow"
                            )}
                          </Button>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            // Trên PC: Hiển thị danh sách có phân trang
            <>
              <Grid container spacing={4} justifyContent="center">
                {favoriteArtists.map((artist) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={artist._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2c3e50" : "#ecf0f1",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      {/* Đặt hình ảnh nghệ sĩ ở trung tâm và làm hình tròn */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          image={
                            artist.imageURL
                              ? artist.imageURL
                              : "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={artist.name}
                        />
                      </Box>

                      {/* Name */}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          textAlign: "center",
                          padding: theme.spacing(2),
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component={RouterLink}
                          to={`/artists/${artist._id}`}
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            transition: "color 0.5s ease",
                            textDecoration: "none",
                            color: theme.palette.text.primary,
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                            cursor: "pointer",
                          }}
                        >
                          {artist.name}
                        </Typography>
                      </CardContent>

                      {/* Nút "Unfollow"  */}
                      <CardActions
                        sx={{
                          justifyContent: "center",
                          paddingBottom: theme.spacing(2),
                        }}
                      >
                        <Tooltip title="Huỷ theo dõi nghệ sĩ">
                          <Button
                            size="small"
                            onClick={() => handleUnfollow(artist._id)}
                            sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                              border: `1px solid ${
                                theme.palette.mode === "dark"
                                  ? theme.palette.grey[700]
                                  : theme.palette.grey[300]
                              }`,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : theme.palette.text.primary,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? theme.palette.grey[700]
                                  : theme.palette.grey[300],
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? theme.palette.grey[600]
                                    : theme.palette.grey[400],
                              },
                            }}
                            disabled={unfollowing}
                          >
                            {unfollowing ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Unfollow"
                            )}
                          </Button>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

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
                <Button
                  variant="contained"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Typography>
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </>
      )}

      {/* Snackbar Thông Báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FavoritesPage;
