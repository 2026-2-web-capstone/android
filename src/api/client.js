import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_V1 } from "./config";

const STORAGE_ACCESS_TOKEN = "accessToken";

export const getStoredAccessToken = () => AsyncStorage.getItem(STORAGE_ACCESS_TOKEN);
export const setStoredAccessToken = (token) =>
  token ? AsyncStorage.setItem(STORAGE_ACCESS_TOKEN, token) : AsyncStorage.removeItem(STORAGE_ACCESS_TOKEN);

const client = axios.create({
  baseURL: API_V1,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(
  async (config) => {
    const token = await getStoredAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await setStoredAccessToken(null);
    }
    return Promise.reject(err);
  }
);

/**
 * Backend ApiResponse: { success, data, error?: { code, message } }
 */
export const unwrap = (response) => {
  const body = response.data;
  if (body && body.success === true) return body.data;
  if (body && body.success === false && body.error)
    throw new Error(body.error.message || body.error.code || "Request failed");
  return body;
};

export const handleError = (err) => {
  const msg =
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    err.message ||
    "오류가 발생했습니다.";
  throw new Error(msg);
};

export default client;
