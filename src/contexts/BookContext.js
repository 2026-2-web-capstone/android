import React, { createContext, useContext, useState } from "react";
import { mockBooks, categories } from "../utils/mockData";

const BookContext = createContext();

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within BookProvider");
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState(mockBooks);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const getFilteredBooks = () => {
    let filtered = books;

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getBookById = (id) => {
    return books.find((book) => book.id === parseInt(id));
  };

  const getNewBooks = () => {
    // 최근 3개월 이내 출간된 도서
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return books.filter((book) => new Date(book.publishDate) >= threeMonthsAgo);
  };

  const getPopularBooks = () => {
    // 재고가 적은 순서로 인기 도서 (실제로는 판매량 기준)
    return [...books].sort((a, b) => a.stock - b.stock).slice(0, 5);
  };

  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: Math.max(...books.map((b) => b.id)) + 1,
    };
    setBooks([...books, newBook]);
    return newBook;
  };

  const updateBook = (id, bookData) => {
    setBooks(
      books.map((book) => (book.id === id ? { ...book, ...bookData } : book))
    );
  };

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const value = {
    books,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    getFilteredBooks,
    getBookById,
    getNewBooks,
    getPopularBooks,
    addBook,
    updateBook,
    deleteBook,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
