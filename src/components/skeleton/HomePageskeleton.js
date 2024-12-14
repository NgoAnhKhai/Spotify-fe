import React from "react";
import { Box, Skeleton } from "@mui/material";

const SkeletonLoader = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Skeleton variant="rectangular" width={210} height={118} />
        <Skeleton variant="text" width={210} />
        <Skeleton variant="text" width={210} />
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Skeleton variant="rectangular" width={210} height={118} />
        <Skeleton variant="text" width={210} />
        <Skeleton variant="text" width={210} />
      </Box>
    </Box>
  );
};

export default SkeletonLoader;
