import apiService from "../../../api/apiService";

export const fetchGenreByName = async (name) => {
  try {
    if (!name) {
      throw new Error("Genre name is required");
    }

    const response = await apiService.get(
      `/admin/genres/find?name=${encodeURIComponent(name)}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching genres by name:", error.message);
    throw error;
  }
};
