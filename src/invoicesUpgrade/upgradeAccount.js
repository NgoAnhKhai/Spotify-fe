// src/components/UpgradeAccount.js

import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import {
  cancelPayment,
  completePayment,
  createInvoice,
  getPendingInvoice, // Nếu bạn đã thêm hàm này
} from "../services/invoicesServices";

const UpgradeAccount = ({ onUpgradeSuccess }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // useEffect để tải hóa đơn Pending khi component mount
  useEffect(() => {
    const fetchPendingInvoice = async () => {
      setLoading(true);
      try {
        const pendingInvoice = await getPendingInvoice();
        if (pendingInvoice) {
          setInvoice(pendingInvoice);
          setSnackbar({
            open: true,
            message:
              "Đã có một hóa đơn chưa thanh toán. Vui lòng hoàn tất hoặc hủy bỏ.",
            severity: "info",
          });
        }
      } catch (error) {
        // Không cần thông báo nếu không có hóa đơn Pending
        console.error("Không tìm thấy hóa đơn Pending:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInvoice();
  }, []);

  // Mở hộp thoại xác nhận nâng cấp
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  // Đóng hộp thoại xác nhận nâng cấp
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  // Mở form thanh toán
  const handleOpenPaymentForm = () => {
    setOpenConfirmDialog(false);
    setOpenPaymentForm(true);
  };

  // Đóng form thanh toán
  const handleClosePaymentForm = () => {
    setOpenPaymentForm(false);
  };

  // Xử lý thay đổi trong form thanh toán
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi người dùng nhấn "Tiếp tục thanh toán"
  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      const data = await createInvoice();
      setInvoice(data.invoice);
      setSnackbar({
        open: true,
        message: "Hóa đơn đã được tạo thành công. Trạng thái: Pending.",
        severity: "success",
      });
      setOpenPaymentForm(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi tạo hóa đơn.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi người dùng hoàn tất thanh toán
  const handleCompletePayment = async () => {
    if (!invoice || invoice.status !== "Pending") {
      setSnackbar({
        open: true,
        message: "Không có hóa đơn nào để hoàn tất thanh toán.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await completePayment(invoice._id);
      setInvoice(null); // Sau khi thanh toán thành công, loại bỏ hóa đơn Pending
      setSnackbar({
        open: true,
        message:
          "Thanh toán đã được hoàn tất thành công. Bạn đã trở thành Premium!",
        severity: "success",
      });
      if (onUpgradeSuccess) {
        onUpgradeSuccess(data.user); // Gửi dữ liệu người dùng cập nhật
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi hoàn tất thanh toán.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi người dùng hủy bỏ thanh toán
  const handleCancelPayment = async () => {
    if (!invoice || invoice.status !== "Pending") {
      setSnackbar({
        open: true,
        message: "Không có hóa đơn nào để hủy bỏ.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await cancelPayment(invoice._id);
      setInvoice(null);
      setSnackbar({
        open: true,
        message: "Hủy bỏ thanh toán thành công. Bạn đã trở về trạng thái Free.",
        severity: "success",
      });
      // Sau khi hủy bỏ, gọi callback để cập nhật lại thông tin người dùng
      if (onUpgradeSuccess) {
        onUpgradeSuccess(); // Có thể tái tải hồ sơ nếu cần
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi hủy bỏ thanh toán.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Đóng Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Nếu chưa có hóa đơn Pending, hiển thị nút Nâng cấp tài khoản */}
      {!invoice && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenConfirmDialog}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Nâng cấp tài khoản"
          )}
        </Button>
      )}

      {/* Hộp thoại xác nhận nâng cấp */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác nhận nâng cấp</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn nâng cấp tài khoản lên Premium không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleOpenPaymentForm} color="primary" autoFocus>
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form thanh toán */}
      <Dialog
        open={openPaymentForm}
        onClose={handleClosePaymentForm}
        aria-labelledby="payment-form-title"
        aria-describedby="payment-form-description"
      >
        <DialogTitle id="payment-form-title">
          Thanh toán để nâng cấp
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="payment-form-description">
            Vui lòng nhập thông tin thanh toán để tiếp tục nâng cấp tài khoản.
          </DialogContentText>
          {/* Form thông tin thanh toán */}
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              label="Số thẻ"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Ngày hết hạn (MM/YY)"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handlePaymentInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="CVV"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handlePaymentInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentForm} color="primary">
            Hủy
          </Button>
          <Button onClick={handleProceedToPayment} color="primary" autoFocus>
            Tiếp tục thanh toán
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nếu có hóa đơn Pending, hiển thị thông tin và các nút hành động */}
      {invoice && (
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            backgroundColor: "#1e1e1e",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Thông tin Hóa đơn
          </Typography>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            ID Hóa đơn: {invoice._id}
          </Typography>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            Trạng thái: {invoice.status}
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              Vui lòng hoàn tất thanh toán để trở thành Premium.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCompletePayment}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Hoàn tất thanh toán"
                )}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelPayment}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Hủy Hóa Đơn"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar để thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpgradeAccount;
