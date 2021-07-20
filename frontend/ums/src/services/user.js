import axios from "axios";
import { omitBy, isNil } from "lodash";
import { USERS_URL } from "../config/constants";

export const fetchUsers = async (params = {}) => {
  try {
    params = omitBy(params, isNil);
    const query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");

    const response = await axios.get(`${USERS_URL}?${query}`);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await axios.get(`${USERS_URL}/${userId}`);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(`${USERS_URL}/create`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const getEdditableGrupsForUser = async (userId) => {
  try {
    const response = await axios.get(
      `${USERS_URL}/getEdditableGrupsForUser/${userId}`
    );
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await axios.patch(`${USERS_URL}/${userId}`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};
export const removeGrupFromUser = async (data) => {
  try {
    const response = await axios.post(`${USERS_URL}/removeGrupFromUser`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const addGrupToUser = async (data) => {
  try {
    const response = await axios.post(`${USERS_URL}/addGrupToUser`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${USERS_URL}/${userId}`);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};
