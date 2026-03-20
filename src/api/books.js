import client, { unwrap, handleError } from "./client";

/**
 * Page response: { content, totalElements, totalPages, size, number, ... }
 */
const pageParams = (page = 0, size = 20) => ({ params: { page, size } });

export const getHome = async () => {
  try {
    return await client.get("/home").then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getBooks = async (page = 0, size = 20) => {
  try {
    return await client.get("/books", pageParams(page, size)).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getNewBooks = async (page = 0, size = 20) => {
  try {
    return await client.get("/books/new", pageParams(page, size)).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getPopularBooks = async () => {
  try {
    return await client.get("/books/popular").then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getCategories = async () => {
  try {
    return await client.get("/categories").then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getBooksByCategory = async (categoryId, page = 0, size = 20) => {
  try {
    return await client
      .get(`/categories/${categoryId}/books`, pageParams(page, size))
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const searchBooks = async (keyword, page = 0, size = 20) => {
  try {
    return await client
      .get("/books/search", { params: { keyword, page, size } })
      .then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};

export const getBookDetail = async (bookId) => {
  try {
    return await client.get(`/books/${bookId}`).then(unwrap);
  } catch (e) {
    throw handleError(e);
  }
};
