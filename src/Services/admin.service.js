import axios from "axios";
import { ADMIN_URL } from "../Utils/constants";

export const AuthService = async (email, password) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/auth", {
      email: email,
      password: password,
    });
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllExaminers = async (token) => {
  try {
    const { data } = await axios.get(ADMIN_URL + "/getAllExaminers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};
export const addExaminer = async (user) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addExaminer", user);
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateExaminer = async (user) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/updateExaminer", user);
    return data;
  } catch (err) {
    throw err;
  }
};
