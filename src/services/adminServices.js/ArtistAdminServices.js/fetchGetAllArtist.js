import apiService from "../../../api/apiService";

export const fetchGetAllArtist = async (page = 1, limit = 4) => {
  try {
    const response = await apiService.get("/artists", {
      params: {
        page,
        limit,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw new Error(error.response?.data?.message || "Error fetching artists");
  }
};
