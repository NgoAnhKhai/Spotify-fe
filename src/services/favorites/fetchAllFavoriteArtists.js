import apiService from "../../api/apiService";

export const fetchAllFavoriteArtists = async (page = 1, limit = 4) => {
  try {
    const response = await apiService.get(
      `/users/favorite-artists?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error in fetchGetAllFavoriteArtists:", error);
    throw (
      error.response?.message ||
      "Đã xảy ra lỗi khi lấy danh sách nghệ sĩ ưa thích."
    );
  }
};
