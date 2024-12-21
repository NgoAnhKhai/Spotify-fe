import apiService from "../../api/apiService";

export const fetchUnfollowingArtists = async (artistId) => {
  try {
    const response = await apiService.delete(`/users/unfollow/${artistId}`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.message || "Failed to fetch unfollowing artist"
    );
  }
};
