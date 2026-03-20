import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import BookCard from "../components/BookCard";
import { useBooks } from "../contexts/BookContext";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const BookListScreen = () => {
  const route = useRoute();
  const filter = route.params?.filter;
  const {
    getNewBooks,
    getPopularBooks,
    getBooks,
    getBooksByCategory,
    categories,
    loadCategories,
    selectedCategoryId,
    selectedCategoryName,
    setSelectedCategory,
  } = useBooks();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (filter === "new") {
        const res = await getNewBooks(0, 50);
        setBooks(Array.isArray(res) ? res : []);
      } else if (filter === "popular") {
        const res = await getPopularBooks();
        setBooks(Array.isArray(res) ? res : []);
      } else if (selectedCategoryId) {
        const res = await getBooksByCategory(selectedCategoryId, 0, 50);
        setBooks(Array.isArray(res) ? res : []);
      } else {
        const res = await getBooks(0, 50);
        setBooks(Array.isArray(res) ? res : []);
      }
    } catch (e) {
      setError(e.message || "로딩 실패");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [
    filter,
    selectedCategoryId,
    getNewBooks,
    getPopularBooks,
    getBooks,
    getBooksByCategory,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (!filter) loadCategories();
      loadBooks();
    }, [filter, loadBooks, loadCategories])
  );

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => setSelectedCategory(category.name)}
      style={[
        styles.categoryButton,
        selectedCategoryName === category.name && styles.categoryButtonActive,
      ]}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategoryName === category.name &&
            styles.categoryButtonTextActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBookItem = ({ item, index }) => (
    <View
      style={[
        styles.bookItem,
        index % 2 === 0 ? styles.bookItemLeft : styles.bookItemRight,
      ]}
    >
      <BookCard book={item} />
    </View>
  );

  if (loading && books.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!filter && (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory("전체")}
              style={[
                styles.categoryButton,
                selectedCategoryName === "전체" && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategoryName === "전체" &&
                    styles.categoryButtonTextActive,
                ]}
              >
                전체
              </Text>
            </TouchableOpacity>
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>
      )}

      {error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : books.length > 0 ? (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderBookItem}
          numColumns={2}
          contentContainerStyle={styles.bookList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[200],
    marginRight: spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary[600],
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray[700],
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  bookList: {
    padding: spacing.lg,
  },
  bookItem: {
    flex: 1,
    maxWidth: "50%",
  },
  bookItemLeft: {
    paddingRight: spacing.sm,
  },
  bookItemRight: {
    paddingLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.gray[500],
  },
});

export default BookListScreen;
