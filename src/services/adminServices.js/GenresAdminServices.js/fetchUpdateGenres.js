import apiService from "../../../api/apiService";

export const fetchUpdateGenres = async (genreId, updatedGenre) => {
  try {
    const response = await apiService.put(
      `/admin/genres/${genreId}`,
      updatedGenre
    );

    return response;
  } catch (error) {
    console.error("Failed to update genre", error);
    throw new Error(error.response?.data?.message || "Failed to update genre");
  }
};
