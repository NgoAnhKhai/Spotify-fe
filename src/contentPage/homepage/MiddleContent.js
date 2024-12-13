import React, { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import apiService from "../../api/apiService";
import { useNavigate } from "react-router-dom";
import { fetchAllAlbums } from "../../services/albumService";

const MiddleContent = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();

  const loadAlbums = async (pageNumber) => {
    setLoading(true);
    try {
      const { albums, pagination } = await fetchAllAlbums(pageNumber, 5);
      setAlbums(albums || []);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải album:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums(page);
  }, [page]);

  const handleClick = (id) => {
    navigate(`/album/${id}`);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Box
      sx={{
        overflowY: "auto",
        borderRadius: "10px",
        height: "100%",
        maxHeight: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        width: "100%",
        position: "relative",

        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #1e90ff 15%, #000000)"
            : "linear-gradient(to bottom, #1e90ff 15%, #ffffff)",
        transition: "all 0.3s ease",
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          marginTop: "0px",
          marginBottom: "32px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: "24px",
            transition: "color 0.5s ease",
          }}
        >
          Feature
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            gap: "16px",
          }}
        >
          {loading ? (
            <Typography sx={{ color: theme.palette.text.primary }}>
              Loading...
            </Typography>
          ) : albums.length > 0 ? (
            albums.map((album, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
                  padding: "8px",
                  borderRadius: "8px",
                  color: theme.palette.text.primary,
                  width: "calc(16% - 16px)",
                  height: "calc(210.13px + 40px)",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0",
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleClick(album._id)}
              >
                <img
                  src={album.coverImageURL}
                  alt={album.coverImageURL}
                  style={{
                    width: "165.41px",
                    height: "241.13px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.primary,
                  }}
                >
                  {album.title}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography
              sx={{
                color: theme.palette.text.primary,
                textAlign: "center",
              }}
            >
              Không có album nào
            </Typography>
          )}
        </Box>
      </Box>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          marginTop: "16px",
        }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={page === 1}
          sx={{ backgroundColor: "#1e90ff", color: "#fff" }}
        >
          Previous
        </Button>
        <Typography sx={{ color: theme.palette.text.primary }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={page === totalPages}
          sx={{ backgroundColor: "#1e90ff", color: "#fff" }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default MiddleContent;
