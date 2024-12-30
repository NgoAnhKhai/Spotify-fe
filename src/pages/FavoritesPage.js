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
  Pagination,
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
  const [unfollowingIds, setUnfollowingIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isMobile = useMediaQuery("(max-width:600px)");

  const itemsPerPage = isMobile ? 2 : 4;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadFavoriteArtists = async () => {
      setLoading(true);
      try {
        const response = await fetchAllFavoriteArtists(
          currentPage,
          itemsPerPage
        );
        console.log("API Response:", response);
        setFavoriteArtists(response.user.favoriteArtists);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching favorite artists:", err);
        setError("Không thể tải danh sách nghệ sĩ yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteArtists();
  }, [user, navigate, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleUnfollow = async (artistId) => {
    setUnfollowingIds((prev) => [...prev, artistId]);
    try {
      await fetchUnfollowingArtists(artistId);
      setSnackbarMessage("Huỷ theo dõi nghệ sĩ thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      const updatedPage = currentPage;
      const response = await fetchAllFavoriteArtists(updatedPage, itemsPerPage);
      setFavoriteArtists(response.user.favoriteArtists);
      setTotalPages(response.pagination.totalPages);

      if (currentPage > response.pagination.totalPages) {
        setCurrentPage(response.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error unfollowing artist:", err);
      setSnackbarMessage(err.message || "Đã xảy ra lỗi khi huỷ theo dõi.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUnfollowingIds((prev) => prev.filter((id) => id !== artistId));
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        width: "100%",
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
          <Grid container spacing={4} justifyContent="center">
            {favoriteArtists.map((artist) => (
              <Grid
                item
                xs={12}
                sm={isMobile ? 6 : 6}
                md={isMobile ? 6 : 4}
                lg={isMobile ? 6 : 3}
                key={artist._id}
              >
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
                  {/* Hình ảnh nghệ sĩ */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: isMobile ? 120 : 150,
                        height: isMobile ? 120 : 150,
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

                  {/* Tên nghệ sĩ */}
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
                        disabled={unfollowingIds.includes(artist._id)}
                      >
                        {unfollowingIds.includes(artist._id) ? (
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

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 1,
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Snackbar Thông Báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
