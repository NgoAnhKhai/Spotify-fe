import React from "react";
import { IconButton } from "@mui/material";
import { AdminPanelSettings as AdminIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminIconComponent = ({ user }) => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <IconButton
      color="inherit"
      onClick={handleAdminClick}
      sx={{
        color: "#fff",
        marginLeft: "16px",
        fontSize: "30px",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
      className="admin-icon-button"
    >
      <AdminIcon />
    </IconButton>
  );
};

export default AdminIconComponent;
