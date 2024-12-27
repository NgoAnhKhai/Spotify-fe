import React, { useState, useEffect, useContext } from "react";
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
  getPendingInvoice,
} from "../services/invoicesServices";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";

const UpgradeAccount = ({ onUpgradeSuccess }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const { updateSubscriptionType, setCurrentSong, setPlaylist, resetPlayer } =
    useContext(MusicPlayerContext);
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

  useEffect(() => {
    const fetchPendingInvoice = async () => {
      setLoading(true);
      try {
        const response = await getPendingInvoice();
        console.log("pendingInvoice:", response);

        if (response && response.invoice) {
          setInvoice(response.invoice);
          setSnackbar({
            open: true,
            message:
              "Đã có một hóa đơn chưa thanh toán. Vui lòng hoàn tất hoặc hủy bỏ.",
            severity: "info",
          });
        }
      } catch (error) {
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

  // Đóng form thanh toán
  const handleClosePaymentForm = () => {
    setOpenPaymentForm(false);
  };

  // Xử lý thay đổi trong form thanh toán
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const data = await createInvoice();
      setInvoice(data.invoice);
      setSnackbar({
        open: true,
        message: "Hóa đơn đã được tạo thành công. Trạng thái: Pending.",
        severity: "success",
      });
      setOpenConfirmDialog(false);
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

  // Xử lý khi người dùng nhấn "Thanh Toán"
  const handleProceedToPayment = () => {
    setOpenPaymentForm(true);
  };

  // Xử lý khi người dùng nhấn "Hoàn tất thanh toán" trong form thanh toán
  const handleCompletePayment = async () => {
    if (!invoice || invoice.paymentStatus !== "Pending") {
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
      setInvoice(null);
      setSnackbar({
        open: true,
        message:
          "Thanh toán đã được hoàn tất thành công. Bạn đã trở thành Premium!",
        severity: "success",
      });
      setOpenPaymentForm(false);
      if (onUpgradeSuccess) {
        onUpgradeSuccess("upgrade", data.user);
      }
      if (data?.user?.subscriptionType) {
        updateSubscriptionType(data.user.subscriptionType);
      }
      setCurrentSong(null);
      setPlaylist([]);
      resetPlayer();
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

  // Xử lý khi người dùng nhấn "Hủy Hóa Đơn"
  const handleCancelPayment = async () => {
    if (!invoice || invoice.paymentStatus !== "Pending") {
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
        message: "Hủy hóa đơn thành công.",
        severity: "success",
      });

      if (onUpgradeSuccess) {
        onUpgradeSuccess("cancel");
      }
      resetPlayer();
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
          <Button onClick={handleContinue} color="primary" autoFocus>
            Tiếp tục
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
            Trạng thái: {invoice.paymentStatus}
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              Bạn đã có một hóa đơn chưa thanh toán. Vui lòng hoàn tất hoặc hủy
              bỏ.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleProceedToPayment}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Thanh Toán"
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

      {/* Form thanh toán - chỉ hiển thị khi người dùng nhấn "Thanh Toán" */}
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
          <Button onClick={handleCompletePayment} color="primary" autoFocus>
            Hoàn tất thanh toán
          </Button>
        </DialogActions>
      </Dialog>

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
