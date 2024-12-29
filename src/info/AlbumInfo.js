import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function AlbumInfo({ album, isFollowing, handleFollowClick }) {
  if (!album || !album.artistID) {
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
          Không tìm thấy thông tin album.
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
      {album.artistID?.imageURL ? (
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
          to={`/artists/${album.artistID?._id}`}
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          {album.artistID?.name || "Unknown Artist"}
        </Link>
      </Typography>
      {album.artistID?.role && (
        <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
          Vai trò: {album.artistID.role}
        </Typography>
      )}
      {album.artistID?.genre && (
        <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
          Thể loại: {album.artistID.genre}
        </Typography>
      )}

      <Typography>
        Start Year: {album.artistID?.description?.startYear || "N/A"}
      </Typography>
      <Typography>
        Difficulties: {album.artistID?.description?.difficulties || "N/A"}
      </Typography>
      {/* Button Follow */}
      <Button
        onClick={handleFollowClick}
        sx={{
          marginTop: "16px",
          backgroundColor: isFollowing ? "#f0f0f0" : "#fff",
          color: "#000",
          fontWeight: "bold",
          border: isFollowing ? "none" : "1px solid #fff",
          borderRadius: "25px",
          padding: "8px 16px",
          textTransform: "none",
          transition: "all 0.5s ease",
          "&:hover": {
            backgroundColor: isFollowing ? "#e0e0e0" : "#f0f0f0",
            transform: "scale(1.05)",
            transition: "all 0.5s ease",
          },
        }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Box>
  );
}

export default AlbumInfo;
