import React, { useEffect, useState } from "react";
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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [authToken, setAuthToken] = useState(null); // Lưu trữ token trong state
  const [tokenExpiration, setTokenExpiration] = useState(null); // Lưu thời gian hết hạn token

  const navigate = useNavigate();
  // Tạo một hiệu ứng kiểm tra token hết hạn
  useEffect(() => {
    if (authToken && tokenExpiration) {
      const timeout = setTimeout(() => {
        setAuthToken(null); // Xóa token khi hết hạn
        setTokenExpiration(null);
        setSnackbarMessage("Token đã hết hạn, vui lòng đăng nhập lại.");
        setOpenSnackbar(true);
      }, tokenExpiration - Date.now());

      return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
    }
  }, [authToken, tokenExpiration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.post("/user/login", {
        email,
        password,
      });
      if (response.token) {
        const expirationTime = Date.now() + 3600000;
        setAuthToken(response.token);
        setTokenExpiration(expirationTime);

        setSnackbarMessage("Đăng nhập thành công!");
        setOpenSnackbar(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-Login">
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: 2,
          backgroundColor: "#000",
          borderRadius: 2,
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
              backgroundColor: "#1dd75d",
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

export default LoginPage;
