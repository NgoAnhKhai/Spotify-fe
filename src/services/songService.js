import apiService from "../api/apiService";

export async function fetchGetAllSong(
  page = 1,
  limit = 5,
  sortBy = "popularity",
  order = "asc"
) {
  try {
    const response = await apiService.get("/songs", {
      params: { page, limit, sortBy, order },
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

    return response;
  } catch (error) {
    console.error("Error fetching search songs:", error);
    throw error;
  }
};

export const fetchCreateSong = async (songData) => {
  try {
    const response = await apiService.post("/admin/songs", songData);
    if (response.success) {
      console.log("Song created successfully:", response.data.song);
      return response;
    } else {
      throw new Error(response.message || "Failed to create song");
    }
  } catch (error) {
    console.error("Error creating song:", error.message);
    throw error;
  }
};
