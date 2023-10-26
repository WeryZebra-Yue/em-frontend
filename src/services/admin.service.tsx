import axios from "axios";
import { ADMIN_URL } from "../utils/general.constants";
import { store } from "../store";
import { AUTH_IN } from "../redux/Auth/AuthActions";

export const AuthService = async (email: any, password: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/auth", {
      email: email,
      password: password,
    });
    if (data.token)
      store.dispatch({
        type: AUTH_IN,
        payload: null,
      });
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllExaminers = async (token: any) => {
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
export const addExaminer = async (user: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addExaminer", user);
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateExaminer = async (user: any) => {
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
export const addAdmin = async (user: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addAdmin", user);
    return data;
  } catch (err) {
    throw err;
  }
};
export const getPassword = async (email: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/getPassword", {
      email: email,
    });
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateAdmin = async (user: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/updateAdmin", user);
    return data;
  } catch (err) {
    throw err;
  }
};
export const verifyToken = async (token: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/verifyToken", {
      token: token,
    });
    return data;
  } catch (err) {
    throw err;
  }
};
export const addMultipleUsers = async (users: any) => {
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
export const addUniversity = async (university: any) => {
  try {
    const { data } = await axios.post(ADMIN_URL + "/addUniversity", university);
    return data;
  } catch (err) {
    throw err;
  }
};
export const updateUniversity = async (university: any) => {
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
