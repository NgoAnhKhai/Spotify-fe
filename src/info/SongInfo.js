// src/components/SongInfo.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function SongInfo({ song }) {
  if (!song || !song.artistID) {
    return (
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
          Không tìm thấy thông tin bài hát.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#1e1e1e",
        padding: "16px",
        borderRadius: "15px",
        mt: 2,
        textAlign: "center",
      }}
    >
      {/* Song Information */}
      <Box
        sx={{
          marginBottom: "16px",
        }}
      >
        {song.coverImageURL ? (
          <Box
            component="img"
            src={song.coverImageURL}
            alt={song.title}
            sx={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              mb: 2,
            }}
          />
        ) : (
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "8px",
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
          {song.title || "Unknown Title"}
        </Typography>
        <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
          Popularity: {song.popularity?.toLocaleString() || "N/A"}
        </Typography>
      </Box>

      {/* Artist Information */}
      <Box
        sx={{
          textAlign: "left",
          backgroundColor: "#242424",
          padding: "16px",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: "8px",
            color: "white",
            flex: "center",
            alignItems: "center",
          }}
        >
          About
        </Typography>
        {/* Hình Ảnh Nghệ Sĩ */}
        {song.artistID.imageURL ? (
          <Box
            component="img"
            src={song.artistID.imageURL}
            alt={song.artistID.name}
            sx={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "200px",
              borderRadius: "10px",
              backgroundColor: "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Typography>Không có ảnh</Typography>
          </Box>
        )}

        {/* Tên Nghệ Sĩ */}
        <Link
          to={`/artists/${song.artistID._id}`}
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginTop: "10px",
            display: "block",
            textAlign: "center",
          }}
        >
          {song.artistID.name || "Unknown Artist"}
        </Link>

        {/* Thông Tin Chi Tiết Nghệ Sĩ */}
        <Typography
          variant="body2"
          sx={{ color: "grey", marginBottom: "15px", textAlign: "center" }}
        >
          {song.artistID.followersCount?.toLocaleString() || "0"} followers
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "white",
            textAlign: "justify",
            lineHeight: "1.5",
            marginBottom: "8px",
          }}
        >
          Start Year:{" "}
          {song.artistID.description?.startYear || "No description available."}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "white",
            textAlign: "justify",
            lineHeight: "1.5",
          }}
        >
          Difficulties:{" "}
          {song.artistID.description?.difficulties ||
            "No description available."}
        </Typography>
      </Box>
    </Box>
  );
}

export default SongInfo;
