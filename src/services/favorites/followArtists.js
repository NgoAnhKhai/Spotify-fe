import apiService from "../../api/apiService";

export const fetchFollowingArtist = async (artistId) => {
  try {
    const response = await apiService.post(`/users/follow/${artistId}`);
    return response;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
};
