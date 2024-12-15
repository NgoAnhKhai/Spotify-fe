import apiService from "../../../api/apiService";

export const fetchFindArtistByName = async (name) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại.");

    const response = await apiService.get(`/admin/artists/find?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching artist by name:", error.message);

    throw error;
  }
};
