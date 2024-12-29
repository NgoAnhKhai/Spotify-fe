import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import styled from "styled-components";

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

function ArtistInfo({ artist, isFollowing, handleFollowClick }) {
  return (
    <Box sx={{ padding: "16px", marginTop: "24px" }}>
      {/* Thông tin cơ bản của nghệ sĩ */}
      <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
        <img
          src={artist.imageURL}
          alt={artist.name}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "8px",
          }}
        />
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
          {artist.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          Followers: {artist.followersCount.toLocaleString()}
        </Typography>
      </Box>

      {/* Nút theo dõi */}
      <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
        <StyledButton
          variant="contained"
          color={isFollowing ? "secondary" : "primary"}
          onClick={handleFollowClick}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            padding: "8px 16px",
          }}
        >
          {isFollowing ? "Đã Theo Dõi" : "Theo Dõi"}
        </StyledButton>
      </Box>

      <Divider sx={{ backgroundColor: "grey", marginBottom: "16px" }} />

      {/* Danh sách các album của nghệ sĩ */}
      <Typography variant="h6" sx={{ color: "white", marginBottom: "8px" }}>
        Albums
      </Typography>
      {artist.albums && artist.albums.length > 0 ? (
        artist.albums.map((albumItem) => (
          <Box key={albumItem._id} sx={{ marginBottom: "16px" }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {albumItem.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "gray", marginBottom: "8px" }}
            >
              Release Date:{" "}
              {new Date(albumItem.releaseDate).toLocaleDateString()}
            </Typography>
            <Box sx={{ paddingLeft: "16px" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Songs:
              </Typography>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                {albumItem.listSong && albumItem.listSong.length > 0 ? (
                  albumItem.listSong.map((songId) => {
                    // Tìm bài hát trong danh sách songs của nghệ sĩ
                    const song = artist.songs.find((s) => s._id === songId);
                    return song ? (
                      <li key={song._id}>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          • {song.title}
                        </Typography>
                      </li>
                    ) : null;
                  })
                ) : (
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    No songs available.
                  </Typography>
                )}
              </ul>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "gray" }}>
          No albums available.
        </Typography>
      )}
    </Box>
  );
}

export default ArtistInfo;
