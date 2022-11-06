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
export const getAdmins = async () => {
  try {
    const { data } = await axios.get(ADMIN_URL + "/getAdmins");
    return data;
  } catch (err) {
    throw err;
  }
};
export const addAdmin = async (user) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addAdmin", user);
    return data;
  } catch (err) {
    throw err;
  }
};
export const getPassword = async (email) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/getPassword", {
      email: email,
    });
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateAdmin = async (user) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/updateAdmin", user);
    return data;
  } catch (err) {
    throw err;
  }
};
export const verifyToken = async (token) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/verifyToken", {
      token: token,
    });
    return data;
  } catch (err) {
    throw err;
  }
};
export const addMultipleUsers = async (users) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addMultipleUsers", {
      users: users,
    });
    return data;
  } catch (err) {
    throw err;
  }
};
export const getUniversities = async () => {
  try {
    const { data } = await axios.get(ADMIN_URL + "/getUniversities");
    return data;
  } catch (err) {
    throw err;
  }
};
export const addUniversity = async (university) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addUniversity", university);
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateUniversity = async (university) => {
  try {
    const { data } = await axios.post(
      ADMIN_URL + "/updateUniversity",
      university
    );
    return data;
  } catch (err) {
    throw err;
  }
};
