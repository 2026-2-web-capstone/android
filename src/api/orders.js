import client, { unwrap, handleError } from "./client";

export const createOrder = async (paymentMethod = "CARD") => {
  try {
    return await client
      .post("/orders", { paymentMethod })
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const createOrderDirect = async (bookId, quantity, paymentMethod = "CARD") => {
  try {
    return await client
      .post("/orders/direct", { bookId, quantity, paymentMethod })
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getOrder = async (orderId) => {
  try {
    return await client.get(`/orders/${orderId}`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const cancelOrder = async (orderId) => {
  try {
    await client.post(`/orders/${orderId}/cancel`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const refundOrder = async (orderId) => {
  try {
    await client.post(`/orders/${orderId}/refund`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};
