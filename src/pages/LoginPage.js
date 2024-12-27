import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  SnackbarContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage] = useState("");
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await signin(email, password);
      console.log("user", user);

      if (user && user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.message || "Tài Khoản Hoặc Mật Khẩu Sai!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-login"
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: 5,
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

        <Typography
          sx={{ fontWeight: "bold", color: "white" }}
          variant="h4"
          align="center"
        >
          Đăng nhập vào Spotify
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email@yourmail.com"
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
            label="Mật khẩu"
            // thay type="password" bằng điều kiện
            type={showPassword ? "text" : "password"}
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

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: {
                color: "white",
              },
            }}
          />
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "white" }}
          >
            Bạn chưa có tài khoản?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                color: "#1e90ff",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Hãy đăng ký.
            </Link>
          </Typography>

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
            {loading ? "Đang chờ..." : "Đăng nhập"}
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
