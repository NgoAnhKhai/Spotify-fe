import apiService from "../../../api/apiService";

export const fetchUpdateArtist = async (artistId, updatedData) => {
  try {
    const response = await apiService.put(
      `/admin/artists/${artistId}`,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw new Error(error.response?.data?.message || "Error updating artist");
  }
};
