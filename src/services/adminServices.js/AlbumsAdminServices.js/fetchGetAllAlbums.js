import apiService from "../../../api/apiService";

export const fetchGetAllAlbums = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.get(
      `/albums?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.response?.message || error.message);
  }
};
