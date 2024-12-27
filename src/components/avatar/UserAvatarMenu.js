import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";

import { styled } from "@mui/system";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const StyledAvatar = styled(Avatar)(({ isMobile }) => ({
  width: isMobile ? "30px" : "40px",
  height: isMobile ? "30px" : "40px",
  borderRadius: "50%",
  backgroundColor: "#888",
  fontSize: isMobile ? "20px" : "inherit",
  color: "#fff",
  transition: "all 0.3s ease",
}));

const UserMenuComponent = ({ user, isMobile, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <IconButton
        onClick={handleMenuClick}
        sx={{ padding: 0, mr: 15 }}
        className="user-avatar-button"
      >
        <StyledAvatar isMobile={isMobile}>
          {isMobile ? <MoreVertIcon /> : <Avatar />}
        </StyledAvatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        sx={{ mt: "40px" }}
        className="user-menu"
      >
        <MenuItem onClick={onLogout} className="menu-item">
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenuComponent;
