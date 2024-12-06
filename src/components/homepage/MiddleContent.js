import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import styled from "styled-components";
import apiService from "../../api/apiService";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  fontWeight: "bold",
  borderRadius: "25px",
  padding: "16px 32px",
  width: "100%",
  transition: "transform 0.3s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#000",
    transform: "scale(1.05)",
  },
}));

const MiddleContent = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const albumResponse = await apiService.get("/song");
      const songResponse = await apiService.get("/album");

      console.log("Album Response:", albumResponse.data.albums);
      console.log("Song Response:", songResponse.data.songs);

      setAlbums(albumResponse.data.albums || []);
      setSongs(songResponse.data.songs || []);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121212",
        padding: "16px",
        position: "relative",
      }}
    >
      {/* Panel Box */}
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#1e1e1e",
          padding: "8px 16px",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Panel
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          backgroundColor: "#1e1e1e",
          padding: "32px",
          borderRadius: "15px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "white", marginBottom: "20px" }}
        >
          Tạo danh sách phát mới
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "white",
            marginBottom: "32px",
            fontSize: "16px",
            opacity: 0.8,
          }}
        >
          Hãy bắt đầu với danh sách phát đầu tiên của bạn và khám phá âm nhạc
          yêu thích!
        </Typography>

        {/* Fetch data when button is clicked */}
        <StyledButton onClick={fetchData}>Tạo Danh Sách Phát</StyledButton>

        {/* Nếu đang tải dữ liệu */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: "#121212",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Render the list of albums and songs */}
        <Box sx={{ marginTop: "32px" }}>
          <Typography
            variant="h6"
            sx={{ color: "white", marginBottom: "16px" }}
          >
            Danh sách album:
          </Typography>
          <Box>
            {albums.length > 0 ? (
              albums.map((album, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#333",
                    marginBottom: "8px",
                    padding: "16px",
                    borderRadius: "8px",
                    color: "white",
                  }}
                >
                  <Typography variant="body1">{album.title}</Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "white" }}>
                Không có album nào
              </Typography>
            )}
          </Box>

          <Typography
            variant="h6"
            sx={{ color: "white", marginTop: "32px", marginBottom: "16px" }}
          >
            Danh sách bài hát:
          </Typography>
          <Box>
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#333",
                    marginBottom: "8px",
                    padding: "16px",
                    borderRadius: "8px",
                    color: "white",
                  }}
                >
                  <Typography variant="body1">{song.title}</Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "white" }}>
                Không có bài hát nào
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MiddleContent;
