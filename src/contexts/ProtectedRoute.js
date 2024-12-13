import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
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

  if (user) {
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
            Bạn cần đăng nhập để truy cập nội dung này.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: "20px",
              color: "#fff",
              borderColor: "#1e90ff",
              padding: "10px 20px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#1e90ff",
                color: "#fff",
                transform: "scale(1.05)",
              },
            }}
          >
            Ở lại
          </Button>
          <Button
            onClick={handleNavigateToLogin}
            variant="contained"
            sx={{
              backgroundColor: "#1e90ff",
              color: "#fff",
              borderRadius: "20px",
              padding: "10px 20px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#4ea1ff",
                transform: "scale(1.05)",
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

export default ProtectedRoute;
