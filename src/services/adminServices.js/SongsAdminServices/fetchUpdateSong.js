import apiService from "../../../api/apiService";

export const fetchUpdateSong = async (songId, updatedSongData) => {
  try {
    const response = await apiService.put(
      `/admin/songs/${songId}`,
      updatedSongData
    );

    return response;
  } catch (error) {
    console.error("Failed to update song", error);
    throw new Error(error.response?.data?.message || "Failed to update song");
  }
};
