import React from "react";
import { Box, Skeleton, Grid, Typography } from "@mui/material";

const SkeletonLoaderSong = () => {
  return (
    <Box sx={{ padding: "16px", display: "flex", flexDirection: "column" }}>
      {/* Skeleton for Top Result */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
          backgroundColor: "#121212",
          padding: "16px",
          borderRadius: "10px",
        }}
      >
        <Skeleton variant="rectangular" width={300} height={200} />
        <Skeleton variant="text" width={200} height={30} sx={{ mt: 2 }} />
        <Skeleton variant="text" width={150} height={20} sx={{ mt: 1 }} />
      </Box>

      {/* Skeleton for Songs List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
          Songs
        </Typography>
        <Grid container spacing={2}>
          {/* Skeleton for each song in the list */}
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#121212",
                  padding: "12px",
                  borderRadius: "10px",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={60}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" />
                </Box>
                <Skeleton variant="rectangular" width={24} height={24} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SkeletonLoaderSong;
