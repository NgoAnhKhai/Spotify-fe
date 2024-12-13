import apiService from "../../../api/apiService";

export const fetchDeleteGenre = async (genreId) => {
  try {
    const response = await apiService.delete(`/admin/genres/${genreId}`);

    return response;
  } catch (error) {
    console.error("Failed to delete genre", error);
    throw new Error(error.response?.data?.message || "Failed to delete genre");
  }
};
