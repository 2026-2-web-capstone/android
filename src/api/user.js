import client, { unwrap, handleError } from "./client";

const pageParams = (page = 0, size = 20) => ({ params: { page, size } });

export const getMyOrders = async (page = 0, size = 20) => {
  try {
    return await client
      .get("/users/me/orders", pageParams(page, size))
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getMyPurchases = async (page = 0, size = 20) => {
  try {
    return await client
      .get("/users/me/purchases", pageParams(page, size))
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getMyRefunds = async (page = 0, size = 20) => {
  try {
    return await client
      .get("/users/me/refunds", pageParams(page, size))
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getMyReviews = async (page = 0, size = 20) => {
  try {
    return await client
      .get("/users/me/reviews", pageParams(page, size))
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};
