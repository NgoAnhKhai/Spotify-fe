import apiService from "../../../api/apiService";

const fetchAssignRole = async (userId, newRole, artistDetails) => {
  try {
    const payload = { userId, newRole };
    if (newRole === "artist" && artistDetails) {
      payload.artistDetails = artistDetails;
    }

    const response = await apiService.post("/admin/assignRole", payload);
    return response;
  } catch (error) {
    throw new Error(error.response ? error.response.message : error.message);
  }
};

export default fetchAssignRole;
