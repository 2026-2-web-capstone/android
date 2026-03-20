import React, { createContext, useContext, useState, useCallback } from "react";
import * as booksApi from "../api/books";
import * as adminApi from "../api/admin";

const BookContext = createContext();

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within BookProvider");
  }
  return context;
};

function mapSummary(book) {
  if (!book) return null;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    price: book.price ?? 0,
    image: book.thumbnailUrl,
    thumbnailUrl: book.thumbnailUrl,
    ratingAvg: book.ratingAvg ?? 0,
    reviewCount: book.reviewCount ?? 0,
  };
}

function mapDetail(book) {
  if (!book) return null;
  const firstImage = book.images && book.images[0];
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    description: book.description,
    price: book.price ?? 0,
    stock: book.stock ?? 0,
    categoryName: book.categoryName,
    category: book.categoryName,
    image: firstImage || book.thumbnailUrl,
    images: book.images || [],
    thumbnailUrl: book.thumbnailUrl,
    ratingAvg: book.ratingAvg ?? 0,
    reviewCount: book.reviewCount ?? 0,
  };
}

export const BookProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      const list = await booksApi.getCategories();
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  }, []);

  const getHome = useCallback(async () => {
    const home = await booksApi.getHome();
    return {
      newBooks: (home.newBooks || []).map(mapSummary),
      popularBooks: (home.popularBooks || []).map(mapSummary),
    };
  }, []);

  const getBooks = useCallback(async (page = 0, size = 20) => {
    const res = await booksApi.getBooks(page, size);
    const content = res.content || res;
    return Array.isArray(content) ? content.map(mapSummary) : [];
  }, []);

  const getNewBooks = useCallback(async (page = 0, size = 20) => {
    const res = await booksApi.getNewBooks(page, size);
    const content = res.content || res;
    return Array.isArray(content) ? content.map(mapSummary) : [];
  }, []);

  const getPopularBooks = useCallback(async () => {
    const list = await booksApi.getPopularBooks();
    return Array.isArray(list) ? list.map(mapSummary) : [];
  }, []);

  const getBooksByCategory = useCallback(async (categoryId, page = 0, size = 20) => {
    const res = await booksApi.getBooksByCategory(categoryId, page, size);
    const content = res.content || res;
    return Array.isArray(content) ? content.map(mapSummary) : [];
  }, []);

  const searchBooks = useCallback(async (keyword, page = 0, size = 20) => {
    const res = await booksApi.searchBooks(keyword, page, size);
    const content = res.content || res;
    return Array.isArray(content) ? content.map(mapSummary) : [];
  }, []);

  const getBookDetail = useCallback(async (bookId) => {
    const book = await booksApi.getBookDetail(bookId);
    return mapDetail(book);
  }, []);

  const addBook = useCallback(async (payload) => {
    const created = await adminApi.createBook(payload);
    return mapDetail(created);
  }, []);

  const updateBook = useCallback(async (bookId, payload) => {
    const updated = await adminApi.updateBook(bookId, payload);
    return mapDetail(updated);
  }, []);

  const deleteBook = useCallback(async (bookId) => {
    await adminApi.deleteBook(bookId);
  }, []);

  const setSelectedCategory = useCallback((nameOrId) => {
    if (nameOrId === "전체" || nameOrId == null) {
      setSelectedCategoryId(null);
      setSelectedCategoryName("전체");
      return;
    }
    const cat = categories.find((c) => c.name === nameOrId || c.id === nameOrId);
    if (cat) {
      setSelectedCategoryId(cat.id);
      setSelectedCategoryName(cat.name);
    } else {
      setSelectedCategoryId(nameOrId);
      setSelectedCategoryName(String(nameOrId));
    }
  }, [categories]);

  const value = {
    categories,
    loadCategories,
    selectedCategoryId,
    selectedCategoryName,
    selectedCategory: selectedCategoryName,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    getHome,
    getBooks,
    getNewBooks,
    getPopularBooks,
    getBooksByCategory,
    searchBooks,
    getBookDetail,
    addBook,
    updateBook,
    deleteBook,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
