import apiService from "../../../api/apiService";

export const fetchFindSongByTitle = async (title) => {
  try {
    if (!title) {
      throw new Error("Song title is required");
    }

    const response = await apiService.get(
      `/admin/songs/find?title=${encodeURIComponent(title)}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching song by title:", error.message);
    throw error;
  }
};
