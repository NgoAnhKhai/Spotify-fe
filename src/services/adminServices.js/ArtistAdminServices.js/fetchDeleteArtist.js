import apiService from "../../../api/apiService";
export const fetchDeleteArtist = async (artistId) => {
  try {
    const response = await apiService.delete(`/admin/artists/${artistId}`);

    return response;
  } catch (error) {
    console.error("Error deleting artist:", error);
    throw new Error(error.response?.message || "Error deleting artist");
  }
};
