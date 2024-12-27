import apiService from "../../../api/apiService";

export const fetchDeleteAlbum = async (albumId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.delete(`/admin/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw new Error(error.response?.message || error.message);
  }
};
