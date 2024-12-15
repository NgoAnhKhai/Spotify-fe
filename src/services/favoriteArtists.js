import apiService from "../api/apiService";

export const fetchFollowArtist = async (artistId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiService.post(
      `/users/follow/${artistId}`,
      {}, // Body rỗng
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error following artist:", error.message);
    throw error;
  }
};

// Unfollow Artist
export const fetchUnfollowArtist = async (artistId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiService.post(
      `/users/unfollow/${artistId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error unfollowing artist:", error.message);
    throw error;
  }
};

// Get Favorite Artists
export const fetchFavoriteArtists = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiService.get(`/users/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching favorite artists:", error.message);
    throw error;
  }
};
