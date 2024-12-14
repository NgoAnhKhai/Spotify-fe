import React from "react";
import { Box, Skeleton, Typography, Grid } from "@mui/material";

const ArtistSkeleton = () => {
  return (
    <Box sx={{ padding: "16px", display: "flex", flexDirection: "column" }}>
      {/* Skeleton for Artist Info */}
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
        <Skeleton
          variant="rectangular"
          width={200}
          height={200}
          sx={{ borderRadius: "50%" }}
        />
        <Skeleton variant="text" width={250} height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" width={150} height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width={200} height={20} sx={{ mt: 1 }} />
      </Box>

      {/* Skeleton for Songs List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
          Songs
        </Typography>
        <Grid container spacing={2}>
          {/* Skeleton for Table Headers */}
          <Grid item xs={1}>
            <Skeleton variant="text" width="100%" height={30} />
          </Grid>
          <Grid item xs={5}>
            <Skeleton variant="text" width="100%" height={30} />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="text" width="100%" height={30} />
          </Grid>
          <Grid item xs={2}>
            <Skeleton variant="text" width="100%" height={30} />
          </Grid>

          {/* Skeleton for each song in the list */}
          {[...Array(5)].map((_, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ marginBottom: "10px" }}
            >
              <Grid item xs={1}>
                <Skeleton variant="text" width="100%" height={20} />
              </Grid>
              <Grid item xs={5}>
                <Skeleton variant="text" width="100%" height={20} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="text" width="100%" height={20} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="text" width="100%" height={20} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ArtistSkeleton;
