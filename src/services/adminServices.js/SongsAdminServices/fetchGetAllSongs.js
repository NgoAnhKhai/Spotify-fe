import apiService from "../../../api/apiService";

export const fetchGetAllSongs = async (page = 1, limit = 5) => {
  try {
    const response = await apiService.get(`/songs`, {
      params: {
        page: page,
        limit: limit,
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to get songs", error);
    throw new Error(error.response?.data?.message || "Failed to get songs");
  }
};
