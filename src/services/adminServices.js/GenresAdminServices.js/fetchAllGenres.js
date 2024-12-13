import apiService from "../../../api/apiService";

export const fetchGetAllGenres = async (currentPage = 1, limit = 10) => {
  try {
    const response = await apiService.get(`/genres`, {
      params: {
        page: currentPage,
        limit: limit,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch genres", error);
    throw new Error(error.response?.data?.message || "Failed to fetch genres");
  }
};
