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

    const {
      remainingDays,
      remainingHours,
      remainingMinutes,
      remainingSeconds,
    } = response.user;

    return {
      ...response,
      user: {
        ...response.user,
        remainingDays,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
      },
    };
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
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found in localStorage");
    }
    const data = {
      oldPassword,
      newPassword,
      confirmPassword,
    };
    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await apiService.put(
      `/users/${userId}/profile/changePassword`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
