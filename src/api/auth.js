import client, { unwrap, handleError, setStoredAccessToken } from "./client";

export const signin = async (email, password) => {
  try {
    const data = await client
      .post("/users/signin", { email, password })
      .then(unwrap);
    if (data.accessToken) await setStoredAccessToken(data.accessToken);
    return { success: true, data };
  } catch (e) {
    throw handleError(e);
  }
};

export const signup = async (payload) => {
  try {
    const data = await client.post("/users/signup", payload).then(unwrap);
    if (data.accessToken) await setStoredAccessToken(data.accessToken);
    return { success: true, data };
  } catch (e) {
    throw handleError(e);
  }
};

export const signout = async (refreshToken = null) => {
  try {
    await client
      .post("/users/signout", refreshToken != null ? { refreshToken } : {})
      .then(unwrap);
    await setStoredAccessToken(null);
  } catch (e) {
    handleError(e);
  }
};

export const getMe = async () => {
  const data = await client.get("/users/me").then(unwrap);
  return data;
};

export const updateMe = async (payload) => {
  const data = await client.patch("/users/me", payload).then(unwrap);
  return data;
};

export const deleteMe = async () => {
  await client.delete("/users/me").then(unwrap);
  await setStoredAccessToken(null);
};
