import apiService from "../../../api/apiService";

const fetchRevertToUser = async (userId) => {
  try {
    const response = await apiService.post("/admin/revertToUser", { userId });

    return response;
  } catch (error) {
    console.error("Error in revertToUser:", error);
    throw error;
  }
};

export default fetchRevertToUser;
