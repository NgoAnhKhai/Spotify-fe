import React from "react";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SkeletonLoader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const skeletonWidth = isMobile ? 120 : 210;
  const skeletonHeight = isMobile ? 80 : 118;
  const textWidth = isMobile ? 120 : 210;

  const skeletonCount = isMobile ? 2 : 4;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 2,
      }}
    >
      {Array.from(new Array(skeletonCount)).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: skeletonWidth,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={skeletonWidth}
            height={skeletonHeight}
            sx={{
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
            }}
          />
          <Skeleton
            variant="text"
            width={textWidth}
            sx={{
              mt: 1,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
            }}
          />
          <Skeleton
            variant="text"
            width={textWidth}
            sx={{
              mt: 0.5,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SkeletonLoader;
