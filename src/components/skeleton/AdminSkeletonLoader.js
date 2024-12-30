import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";

const AdminSkeletonLoader = () => {
  const skeletonCount = 5;

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#121212",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Box
              sx={{
                padding: "20px",
                backgroundColor: "#1e1e1e",
                textAlign: "center",
                borderRadius: "10px",
                "& > *": {
                  marginBottom: "10px",
                },
              }}
            >
              {/* Skeleton cho Icon */}
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{
                  margin: "0 auto",
                  backgroundColor: "#333",
                }}
              />
              {/* Skeleton cho Giá trị */}
              <Skeleton
                variant="text"
                width={80}
                height={30}
                sx={{
                  margin: "0 auto",
                  backgroundColor: "#333",
                }}
              />
              {/* Skeleton cho Label */}
              <Skeleton
                variant="text"
                width={100}
                height={20}
                sx={{
                  margin: "0 auto",
                  backgroundColor: "#333",
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminSkeletonLoader;
