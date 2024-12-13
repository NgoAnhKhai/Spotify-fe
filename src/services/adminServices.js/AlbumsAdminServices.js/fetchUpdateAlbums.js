import apiService from "../../../api/apiService";

export const fetchUpdateAlbums = async (albumId, updatedInfo) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.put(
      `/admin/albums/${albumId}`,
      updatedInfo,
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
