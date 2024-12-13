import apiService from "../../../api/apiService";

const fetchDeleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await apiService.delete(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export default fetchDeleteUser;
