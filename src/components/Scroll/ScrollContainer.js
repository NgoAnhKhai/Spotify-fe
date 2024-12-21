// src/components/Scroll/ScrollContainer.js
import React from "react";
import { styled } from "@mui/system";

const ScrollContainer = styled("div")({
  flexGrow: 1,
  overflowY: "auto",
  padding: "16px",
  backgroundColor: "#121212",
  color: "white",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
});

const ScrollComponent = ({ children }) => {
  return <ScrollContainer>{children}</ScrollContainer>;
};

export default ScrollComponent;
