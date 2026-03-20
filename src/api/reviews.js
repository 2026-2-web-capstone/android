import client, { unwrap, handleError } from "./client";

const pageParams = (page = 0, size = 20) => ({ params: { page, size } });

export const getReviews = async (bookId, page = 0, size = 20) => {
  try {
    return await client
      .get(`/books/${bookId}/reviews`, pageParams(page, size))
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const createReview = async (bookId, rating, content) => {
  try {
    return await client
      .post(`/books/${bookId}/reviews`, { rating, content })
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const updateReview = async (reviewId, rating, content) => {
  try {
    return await client
      .patch(`/reviews/${reviewId}`, { rating, content })
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await client.delete(`/reviews/${reviewId}`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};
