import apiService from "../../../api/apiService";

export const fetchFindAlbumByTitle = async (title) => {
  try {
    if (!title) {
      throw new Error("albums name is required");
    }

    const response = await apiService.get(
      `/admin/albums/find?title=${encodeURIComponent(title)}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching albums by title:", error.message);
    throw error;
  }
};
