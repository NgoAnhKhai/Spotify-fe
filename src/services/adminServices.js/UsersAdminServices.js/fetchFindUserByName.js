import apiService from "../../../api/apiService";

export const fetchFindUserByName = async (name) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.get(`admin/users/find?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Không thể tìm người dùng:", error.message);
    throw error;
  }
};
