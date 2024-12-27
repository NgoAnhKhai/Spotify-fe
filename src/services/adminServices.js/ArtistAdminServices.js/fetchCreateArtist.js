import apiService from "../../../api/apiService";

export const fetchCreateArtist = async (artistData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("name", artistData.name);
    formData.append("description_startYear", artistData.description_startYear);

    if (artistData.description_difficulties) {
      formData.append(
        "description_difficulties",
        artistData.description_difficulties
      );
    }

    if (imageFile) {
      formData.append("imageURL", imageFile);
    }

    const response = await apiService.post("/admin/artists", formData);
    console.log("Create artist response:", response);
    return response;
  } catch (error) {
    console.error("Error creating artist:", error);
    const message =
      error.response?.error?.message ||
      error.message ||
      "Error creating artist";
    throw new Error(message);
  }
};
