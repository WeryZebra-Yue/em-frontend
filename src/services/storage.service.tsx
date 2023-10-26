import axios from "axios";
import { UPLOAD_IMAGE_URL } from "../utils/general.constants";
export const uploadImage = async (images: any) => {
  try {
    const formData = new FormData();
    formData.append("photo", images);
    const { data } = await axios.post(UPLOAD_IMAGE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};
