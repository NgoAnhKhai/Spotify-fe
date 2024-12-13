import apiService from "../api/apiService";

export async function fetchGetAllSong(page = 1, limit = 5) {
  try {
    const response = await apiService.get("/songs", {
      params: { page, limit },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch songs");
  }
}

export const fetchSearchSong = async ({ title, page = 1, limit = 5 }) => {
  try {
    const response = await apiService.get("/songs/search", {
      params: { title, page, limit },
    });

    if (response) {
      return {
        songs: response.songs,
        pagination: response.pagination,
      };
    }

    throw new Error("No data found");
  } catch (error) {
    console.error("Error fetching search songs:", error);
    throw error;
  }
};
