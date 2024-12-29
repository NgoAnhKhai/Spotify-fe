import apiService from "../api/apiService";

export async function fetchArtistById(id) {
  try {
    const response = await apiService.get(`/artists/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch artist");
  }
}
