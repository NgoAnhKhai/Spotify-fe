import apiService from "../api/apiService";
export const fetchCreatePlaylistUser = async (title, userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const body = { title };

    const response = await apiService.post(`/playlists/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error creating playlist:", error.message);
    throw error;
  }
};

export const fetchPlaylistUser = async (userId, page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại.");
    }

    const response = await apiService.get(`/users/${userId}/playlists`, {
      params: {
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.playlists || response.playlists.length === 0) {
      throw new Error("Không tìm thấy playlist cho người dùng này.");
    }

    return {
      playlists: response.playlists,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("Không thể tải playlist của người dùng:", error.message);
    throw error;
  }
};

export const fetchPlaylistById = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiService.get(`/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching playlist by ID:", error.message);
    throw error;
  }
};

export const fetchAddSongToPlaylist = async (playlistId, songId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const body = {
      songID: songId,
    };

    const response = await apiService.post(
      `/playlists/${playlistId}/add`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding song to playlist:", error.message);
    throw error;
  }
};

export const fetchRemoveSongToPlaylist = async (playlistId, songId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const body = { songId };

    const response = await apiService.delete(`/playlists/${playlistId}`, {
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error removing song from playlist:", error.message);
    throw error;
  }
};

export const fetchDeletePlaylist = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiService.delete(
      `/playlists/${playlistId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error deleting playlist:", error.message);
    throw error;
  }
};

export const updatePlaylistCoverImage = async (playlistId, formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await apiService.put(
      `/playlists/${playlistId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating playlist cover image:", error.message);
    throw error;
  }
};
