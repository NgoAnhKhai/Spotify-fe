import apiService from "../api/apiService";

export const createInvoice = async () => {
  try {
    const response = await apiService.post("/invoices/create", {});

    return response;
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
  }
};

export const completePayment = async (invoiceId) => {
  try {
    if (!invoiceId) {
      throw new Error("invoiceId is required.");
    }

    const response = await apiService.post("/invoices/complete", {
      invoiceId,
    });

    return response;
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
  }
};

export const cancelPayment = async (invoiceId) => {
  try {
    if (!invoiceId) {
      throw new Error("invoiceId is required.");
    }

    const response = await apiService.post("/invoices/cancel", {
      invoiceId,
    });

    return response;
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
  }
};
export const getPendingInvoice = async () => {
  try {
    const response = await apiService.get("/invoices/pending");

    return response;
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
  }
};
