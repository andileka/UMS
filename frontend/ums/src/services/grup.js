import axios from "axios";
import { omitBy, isNil } from "lodash";
import { GRUPS_URL } from "../config/constants";

export const fetchGrups = async (params = {}) => {
  try {
    params = omitBy(params, isNil);
    const query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");

    const response = await axios.get(`${GRUPS_URL}?${query}`);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const fetchGrup = async (grupId) => {
  try {
    const response = await axios.get(`${GRUPS_URL}/${grupId}`);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const getEdditableUsersForGrup = async (grupId) => {
  try {
    const response = await axios.get(
      `${GRUPS_URL}/getEdditableUsersForGrup/${grupId}`
    );
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const createGrup = async (data) => {
  try {
    const response = await axios.post(`${GRUPS_URL}/create`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const removeUserFromGrup = async (data) => {
  try {
    const response = await axios.post(`${GRUPS_URL}/removeUserFromGrup`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const addUserToGrup = async (data) => {
  try {
    const response = await axios.post(`${GRUPS_URL}/addUserToGrup`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const updateGrup = async (grupId, data) => {
  try {
    const response = await axios.patch(`${GRUPS_URL}/${grupId}`, data);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const deleteGrup = async (grupId) => {
  try {
    const response = await axios.delete(`${GRUPS_URL}/${grupId}`);
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};
