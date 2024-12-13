import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../api/apiService";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiService.post("/authentications/register", {
        email,
        username,
        password,
      });

      setSnackbarMessage(
        "Chúc mừng! Vui lòng đợi chúng tôi sẽ chuyển hướng bạn đến đăng nhập"
      );
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-register"
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: 2,
          backgroundColor: "#000",
          borderRadius: 10,
          boxShadow: 3,
          border: "none",
        }}
      >
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
          }}
        >
          <img
            src="/Logo.png"
            alt="Spotify Logo"
            style={{ width: 150, height: "auto" }}
          />
        </Box>

        <Typography sx={{ color: "white" }} variant="h4" align="center">
          Sign up to start listening
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="name@domain.com"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                color: "white",
                borderColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "white",
              },
            }}
          />

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                color: "white",
                borderColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "white",
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                color: "white",
                borderColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "white",
              },
            }}
          />

          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              borderRadius: "15px",
              marginTop: 2,
              background: "linear-gradient(to bottom, #1e90fb 48%, #000000)",
              fontWeight: "bold",
              fontSize: "20px",
              height: "45px",
            }}
            disabled={loading}
          >
            {loading ? "Waiting..." : "Next"}
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <SnackbarContent
            message={snackbarMessage}
            sx={{
              backgroundColor: "#1dd75d",
              color: "#000",
              borderRadius: "4px",
              padding: "8px 16px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Snackbar>
      </Box>
    </div>
  );
};

export default RegisterPage;
