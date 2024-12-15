import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  fetchUserProfile,
  updateUserProfile,
  upgradeSubscription,
  cancelSubscription,
  fetchChangePassword,
} from "../services/profileService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  const [updatedProfile, setUpdatedProfile] = useState({
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const isMobile = window.innerWidth <= 600;
  const theme = useTheme();
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserProfile();
        setUserProfile(userData);
        setUpdatedProfile({
          username: userData.username,
          email: userData.email,
        });
      } catch (error) {
        showSnackbar("Không thể tải thông tin người dùng.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (name === "newPassword" || name === "confirmPassword") {
        if (updatedData.newPassword !== updatedData.confirmPassword) {
          setPasswordMismatchError(true);
        } else {
          setPasswordMismatchError(false);
        }
      }

      return updatedData;
    });
  };
  const handlePasswordVisibilityToggle = (field) => {
    if (field === "oldPassword") {
      setOldPasswordVisible((prev) => !prev);
    } else if (field === "newPassword") {
      setNewPasswordVisible((prev) => !prev);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible((prev) => !prev);
    }
  };
  const handleChangePassword = async () => {
    console.log("Password Data Before Send:", passwordData);
    setLoading(true);
    try {
      await fetchChangePassword(
        userProfile._id,
        passwordData.oldPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSnackbar("Mật khẩu đã được thay đổi thành công!");
    } catch (error) {
      showSnackbar("Đã xảy ra lỗi khi thay đổi mật khẩu.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await updateUserProfile(userProfile._id, updatedProfile);
      setUserProfile((prev) => ({ ...prev, ...updatedProfile }));
      setEditMode(false);
      showSnackbar("Cập nhật thông tin thành công!");
    } catch (error) {
      showSnackbar("Không thể cập nhật thông tin.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = async () => {
    setLoading(true);
    try {
      const userData = await upgradeSubscription(userProfile._id);
      console.log("Dữ liệu sau khi nâng cấp:", userData);

      if (userData && userData.user) {
        const {
          remainingDays,
          remainingHours,
          remainingMinutes,
          remainingSeconds,
        } = userData.user;
        setUserProfile((prev) => ({
          ...prev,
          subscriptionType: "Premium",
          remainingDays,
          remainingHours,
          remainingMinutes,
          remainingSeconds,
        }));
      } else {
        const updatedUserData = await fetchUserProfile();
        console.log("User data sau khi fetch lại:", updatedUserData);
        setUserProfile(updatedUserData);
      }

      showSnackbar("Bạn đã nâng cấp tài khoản thành công!");
    } catch (error) {
      showSnackbar("Đã xảy ra lỗi khi nâng cấp tài khoản.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await cancelSubscription(userProfile._id);
      setUserProfile((prev) => ({
        ...prev,
        subscriptionType: "Free",
        remainingDays: null,
      }));
      showSnackbar("Bạn đã hủy gói Premium thành công!");
    } catch (error) {
      showSnackbar("Đã xảy ra lỗi khi hủy gói Premium.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Typography color="error" sx={{ textAlign: "center", marginTop: "20px" }}>
        Loading...
      </Typography>
    );
  }
  return (
    <div
      className="containerProfile"
      style={{
        overflowY: "auto",
        maxHeight: "90vh",
        width: isMobile ? "80%" : "100%",
      }}
    >
      <Box
        sx={{
          padding: "24px",
          backgroundColor: "#121212",
          color: "#ffffff",
          borderRadius: "10px",
          maxWidth: "800px",
          margin: "0 auto",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
          Hồ sơ cá nhân
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                padding: "16px",
                backgroundColor: "#1e1e1e",
                borderRadius: "10px",
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "#ff4081", marginBottom: 2, fontWeight: "bold" }}
              >
                {userProfile.subscriptionType === "Premium"
                  ? "Premium Individual"
                  : "Free"}
              </Typography>
              {userProfile.subscriptionType === "Premium" && (
                <>
                  <Typography sx={{ marginTop: 2 }}>
                    Bạn đang sử dụng tài khoản <b>Premium</b>. Chúc bạn trải
                    nghiệm tuyệt vời!
                  </Typography>
                  <Typography sx={{ marginTop: 2 }}>
                    Bạn đã mua gói vào ngày:{" "}
                    <b style={{ color: "#1e90ff" }}>
                      {new Date(userProfile.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </b>
                  </Typography>
                  <Typography sx={{ marginTop: 2 }}>
                    Sẽ hết hạn trong:{" "}
                    <b style={{ color: "#1e90ff" }}>
                      {userProfile.remainingDays} ngày,{" "}
                      {userProfile.remainingHours} giờ,{" "}
                      {userProfile.remainingMinutes} phút,{" "}
                      {userProfile.remainingSeconds} giây
                    </b>
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      marginTop: 2,
                      color: "#fff",
                      borderColor: "#ff4081",
                      "&:hover": { backgroundColor: "#ff4081", color: "#fff" },
                    }}
                    onClick={handleCancelSubscription}
                  >
                    Hủy gói Premium
                  </Button>
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#1e1e1e",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1e90ff", color: "#fff" }}
                onClick={handleEditToggle}
              >
                {editMode ? "Hủy bỏ chỉnh sửa" : "Chỉnh sửa hồ sơ"}
              </Button>
              {userProfile.subscriptionType !== "Premium" && (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#1e90ff", color: "#fff" }}
                  onClick={handleUpgradeSubscription}
                >
                  Nâng cấp tài khoản
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            marginTop: 4,
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            padding: "16px",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Tài khoản
          </Typography>

          {editMode ? (
            <>
              <TextField
                label="Tên người dùng"
                name="username"
                value={updatedProfile.username}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#121212", marginBottom: "16px" }}
              />
              <TextField
                label="Email"
                name="email"
                value={updatedProfile.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#121212", marginBottom: "16px" }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
                onClick={handleSaveChanges}
              >
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Tên người dùng:</strong> {userProfile.username}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {userProfile.email}
              </Typography>
            </>
          )}
        </Box>
        <Box
          sx={{
            marginTop: 4,
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            padding: "16px",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Đổi Mật Khẩu
          </Typography>
          <Box sx={{ position: "relative" }}>
            <TextField
              label="Mật khẩu cũ"
              name="oldPassword"
              type={oldPasswordVisible ? "text" : "password"}
              value={passwordData.oldPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#121212" : "#ffffff",
                marginBottom: "16px",
                input: { color: theme.palette.text.primary }, // Màu chữ của input
                "& .MuiInputLabel-root": { color: theme.palette.text.primary }, // Màu chữ của label
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.text.primary, // Màu viền cho chế độ sáng/tối
                  },
                },
              }}
            />
            <IconButton
              onClick={() => handlePasswordVisibilityToggle("oldPassword")}
              sx={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                color: theme.palette.text.primary, // Màu của icon
              }}
            >
              {oldPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>

          {/* Mật khẩu mới */}
          <Box sx={{ position: "relative" }}>
            <TextField
              label="Mật khẩu mới"
              name="newPassword"
              type={newPasswordVisible ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#121212" : "#ffffff",
                marginBottom: "16px",
                input: { color: theme.palette.text.primary },
                "& .MuiInputLabel-root": { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                },
              }}
            />
            <IconButton
              onClick={() => handlePasswordVisibilityToggle("newPassword")}
              sx={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                color: theme.palette.text.primary,
              }}
            >
              {newPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>

          {/* Xác nhận mật khẩu mới */}
          <Box sx={{ position: "relative" }}>
            <TextField
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type={confirmPasswordVisible ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              variant="outlined"
              error={passwordMismatchError}
              helperText={
                passwordMismatchError ? "Mật khẩu xác nhận không khớp" : ""
              }
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#121212" : "#ffffff",
                marginBottom: "16px",
                input: { color: theme.palette.text.primary },
                "& .MuiInputLabel-root": { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                },
              }}
            />
            <IconButton
              onClick={() => handlePasswordVisibilityToggle("confirmPassword")}
              sx={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                color: theme.palette.text.primary,
              }}
            >
              {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
            onClick={handleChangePassword}
            disabled={passwordMismatchError}
          >
            Đổi mật khẩu
          </Button>
        </Box>

        {/* Snackbar để thông báo */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default ProfilePage;
