import React, { useState } from "react";
import {
  Drawer,
  Divider,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function LeftSideBar() {
  const [drawerWidth, setDrawerWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("/login");
  };
  const startResize = (e) => {
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
  };

  const stopResize = () => {
    setIsResizing(false);
    document.body.style.cursor = "default";
  };

  const handleResize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setDrawerWidth(newWidth);
      }
    }
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);
  const toggleDrawerSize = () => {
    if (isExpanded) {
      setDrawerWidth(240);
    } else {
      setDrawerWidth(500);
    }
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      setOpen(true);
    } else {
      console.log("Đã đăng nhập, thực hiện hành động");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
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
  const StyleButtonHold = styled(Button)(({ theme }) => ({
    color: "#000",
    fontWeight: "bold",
    border: "1px solid #fff",
    borderRadius: "25px",
    padding: "8px 16px",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#000",
      transform: "scale(1.1)",
    },
  }));
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          position: "sticky",
          boxSizing: "border-box",
          backgroundColor: "#121212",
          border: "none",
          color: "white",
          borderRadius: "10px",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ padding: "16px", textAlign: "center" }}>
        <Button
          onClick={toggleDrawerSize}
          variant="h6"
          component="div"
          sx={{ borderRadius: "10px", fontWeight: "bold" }}
        >
          Thư Viện
        </Button>
      </Box>
      <Divider sx={{ backgroundColor: "grey" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1e1e1e",
          padding: "16px",
          borderRadius: "15px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#1e1e1e",
            padding: "16px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <Typography
            fontWeight="bold"
            variant="body1"
            sx={{ marginBottom: "16px", color: "white" }}
          >
            Tạo danh sách đầu tiên của bạn
          </Typography>
          <Button
            sx={{
              backgroundColor: "white",
              color: "black",
              width: "100%",
              fontWeight: "bold",
            }}
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            Tạo Danh Sách Phát
          </Button>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Tạo danh sách phát
        </DialogTitle>
        <DialogContent>
          <Typography>Đăng nhập để tạo playlist</Typography>
        </DialogContent>
        <DialogActions>
          <StyleButtonHold onClick={handleClose} color="primary">
            Để sau
          </StyleButtonHold>
          <StyledButton
            onClick={() => {
              navigateLogin();
            }}
          >
            Đăng nhập
          </StyledButton>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: "0",
          bottom: 0,
          width: "5px",
          cursor: "ew-resize",
          backgroundColor: "#121212",
        }}
        onMouseDown={startResize}
      />
    </Drawer>
  );
}

export default LeftSideBar;
