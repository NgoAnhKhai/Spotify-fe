import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Button,
  Box,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate đúng chỗ

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha("#2a2a2a", 1),
  "&:hover": {
    backgroundColor: alpha("#fff", 0.25),
  },
  width: "474px",
  height: "48px",
  [theme.breakpoints.up("sm")]: {
    width: "474px",
  },
  "&:focus-within": {
    border: "2px solid #fff",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    height: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

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

const RegisterButton = styled(Button)(({ theme }) => ({
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
}));

export default function MainHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, margin: 0, padding: 0 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#000000",
            padding: "12px",
            boxShadow: "none",
          }}
        >
          <Toolbar
            sx={{
              padding: 0,
              margin: 0,
              height: "48px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              color="inherit"
              startIcon={
                darkMode ? (
                  <Brightness7 sx={{ ml: 1, fontSize: "30px" }} />
                ) : (
                  <Brightness4 sx={{ ml: 1, fontSize: "30px" }} />
                )
              }
              sx={{
                color: "#fff",
                fontWeight: "bold",
                backgroundColor: "#1f1f1f",
                border: "1px solid #1f1f1f",
                borderRadius: "50px",
                padding: "8px 16px",
                textTransform: "none",
                transition: "all 0.3s ease",
                mr: 2,
                "&:hover": {
                  backgroundColor: "transparent",
                  transform: "scale(1.1)",
                },
              }}
              onClick={handleThemeToggle}
            />

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                ml: 20,
              }}
            >
              <Button
                color="inherit"
                startIcon={
                  <HomeIcon sx={{ ml: 1, color: "#fff", fontSize: "30px" }} />
                }
                sx={{
                  color: "#1f1f1f",
                  fontWeight: "bold",
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #1f1f1f",
                  borderRadius: "50px",
                  padding: "8px 16px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "transparent",
                    transform: "scale(1.1)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.75rem",
                  },
                }}
              />
              <Search sx={{ padding: "0px 10px" }}>
                <SearchIconWrapper>
                  <SearchIcon sx={{ paddingRight: "10px" }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="What Do You Want To Play ?"
                  inputProps={{ "aria-label": "search" }}
                  sx={{ paddingTop: "8px" }}
                />
              </Search>
            </Box>

            <RegisterButton
              color="inherit"
              sx={{ ml: "auto" }}
              onClick={handleRegisterClick}
            >
              Đăng Ký
            </RegisterButton>
            <StyledButton color="inherit" sx={{ ml: "auto" }}>
              Đăng Nhập
            </StyledButton>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
