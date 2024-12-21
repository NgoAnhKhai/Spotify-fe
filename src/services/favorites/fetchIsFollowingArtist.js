import apiService from "../../api/apiService";

export const isFollowingArtist = async (artistId) => {
  try {
    const response = await apiService.get(`/users/follow/${artistId}`);
    console.log("isFollowingArtist response:", response);
    return response;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái theo dõi nghệ sĩ:", error);
    return false;
  }
};
