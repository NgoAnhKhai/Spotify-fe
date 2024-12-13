import apiService from "../../../api/apiService";

const fetchGetAllUser = async (currentPage = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await apiService.get(
      `/admin/users?page=${currentPage}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      users: response.users,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export default fetchGetAllUser;
