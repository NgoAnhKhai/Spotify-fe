import apiService from "../api/apiService";

//MiddleContentDetailAlbum
export const fetchAlbumById = async (albumId) => {
  try {
    const response = await apiService.get(`/albums/${albumId}`);
    return response.album;
  } catch (error) {
    console.error("Không thể tải thông tin album:", error.message);
    throw error;
  }
};

//MiddleContentHomePage
export const fetchAllAlbums = async (page = 1, limit = 5) => {
  try {
    const response = await apiService.get(
      `/albums?page=${page}&limit=${limit}`
    );
    return {
      albums: response.albums,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("Không thể tải danh sách albums:", error.message);
    throw error;
  }
};
