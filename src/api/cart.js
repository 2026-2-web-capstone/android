import client, { unwrap, handleError } from "./client";

export const getCart = async () => {
  try {
    return await client.get("/cart").then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const addCartItem = async (bookId, quantity = 1) => {
  try {
    return await client.post("/cart/items", { bookId, quantity }).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    await client.delete(`/cart/items/${cartItemId}`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};
