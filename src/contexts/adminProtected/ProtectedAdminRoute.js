import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setOpen(true);
    } else if (user.role !== "admin") {
      setOpen(true);
    }
  }, [user]);

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleNavigateToLogin = () => {
    setOpen(false);
    setShouldRedirect(true);
  };

  if (shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role === "admin") {
    return children;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px",
            transition: "transform 0.5s ease, opacity 0.5s ease",
            transform: open ? "translateY(0)" : "translateY(-20px)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1e90ff",
          }}
        >
          Truy cập bị chặn
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#1e90ff",
            }}
          >
            Bạn cần đăng nhập và là admin để truy cập nội dung này.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              fontWeight: "bold",
              color: "#888",
              backgroundColor: "transparent",
              borderRadius: "25px",
              padding: "8px 16px",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#f0f0f0",
                transform: "scale(1.1)",
              },
            }}
          >
            Ở lại
          </Button>
          <Button
            onClick={handleNavigateToLogin}
            variant="contained"
            sx={{
              fontWeight: "bold",
              color: "#000",
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
            }}
          >
            Đăng nhập
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProtectedAdminRoute;
