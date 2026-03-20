import client, { unwrap, handleError } from "./client";
import { API_V1 } from "./config";
import axios from "axios";

export const createBook = async (payload) => {
  try {
    return await client.post("/admin/books", payload).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const updateBook = async (bookId, payload) => {
  try {
    return await client.patch(`/admin/books/${bookId}`, payload).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const deleteBook = async (bookId) => {
  try {
    await client.delete(`/admin/books/${bookId}`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

/**
 * Upload image. file: { uri, name, type } (Expo ImagePicker result or similar)
 */
export const uploadMedia = async (file, accessToken) => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.name || "image.jpg",
    type: file.type || "image/jpeg",
  });
  const res = await axios.post(`${API_V1}/admin/media`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const body = res.data;
  if (body && body.success) return body.data;
  throw new Error(body?.error?.message || "Upload failed");
};
