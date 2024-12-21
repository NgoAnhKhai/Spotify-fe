import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ImageUploader = ({ imageUrl, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const hasImage = !!imageUrl;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setOpen(false);
    }
  };

  return (
    <Box>
      {/* Ảnh hiển thị */}
      <Box
        sx={{
          position: "relative",
          width: "250px",
          height: "250px",
          borderRadius: "8px",
          overflow: "hidden",
          cursor: "pointer",
          background: hasImage ? "none" : "#",
          border: hasImage ? "none" : "2px dashed #121212",
          "&:hover .add-icon": {
            display: "flex",
          },
        }}
        onClick={() => setOpen(true)}
      >
        {hasImage && (
          <img
            src={imageUrl}
            alt="Playlist Cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Hiển thị dấu + */}
        <Box
          className="add-icon"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1)",
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "50%",
            display: hasImage ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "50px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translate(-50%, -50%) scale(1.2)",
            },
          }}
        >
          <Typography sx={{ fontSize: "24px", color: "#000" }}>+</Typography>
        </Box>
      </Box>

      {/* Dialog Upload */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật ảnh bìa</DialogTitle>
        <DialogContent>
          <Typography>Chọn ảnh mới để thay thế ảnh hiện tại.</Typography>
          <TextField
            type="file"
            fullWidth
            onChange={handleFileChange}
            inputProps={{ accept: "image/*" }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            disabled={!selectedFile}
          >
            Tải lên
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUploader;
