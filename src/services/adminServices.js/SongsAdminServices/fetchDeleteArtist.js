import apiService from "../../../api/apiService";

export const fetchDeleteSong = async (songId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.delete(`/admin/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw new Error(error.response?.message || error.message);
  }
};
