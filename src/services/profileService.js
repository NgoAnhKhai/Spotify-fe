import apiService from "../api/apiService";

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.get(`/users/me/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.user;
    if (!userData) {
      throw new Error("Dữ liệu người dùng không hợp lệ.");
    }

    return userData;
  } catch (error) {
    console.error("Không thể tải thông tin người dùng:", error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId, updatedProfile) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.put(
      `/users/${userId}/profile`,
      updatedProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (error.response?.code === 11000) {
      throw new Error("Email này đã tồn tại, vui lòng sử dụng email khác.");
    }
    throw new Error(error.response?.message || error.message);
  }
};

export const upgradeSubscription = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.put(
      `/users/${userId}/buy`,
      { subscriptionType: "Premium" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Không thể nâng cấp tài khoản:", error.message);
    throw error;
  }
};

export const cancelSubscription = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.put(
      `/users/${userId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Không thể hủy gói Premium:", error.message);
    throw error;
  }
};
//ChangePassword

export const fetchChangePassword = async (
  userId,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await apiService.put(`/users/${userId}/profile`, {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.user;
  } catch (error) {
    throw error;
  }
};
