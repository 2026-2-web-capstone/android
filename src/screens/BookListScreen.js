import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
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
    getFilteredBooks,
    getNewBooks,
    getPopularBooks,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useBooks();

  // 필터에 따른 도서 목록 결정
  const getBooks = () => {
    if (filter === "new") {
      return getNewBooks();
    }
    if (filter === "popular") {
      return getPopularBooks();
    }
    return getFilteredBooks();
  };

  const books = getBooks();

  const getTitle = () => {
    if (filter === "new") return "신간 도서";
    if (filter === "popular") return "인기 도서";
    return "도서 목록";
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive,
      ]}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.categoryButtonTextActive,
        ]}
      >
        {category}
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

  return (
    <View style={styles.container}>
      {/* 필터가 없을 때만 카테고리 버튼 표시 */}
      {!filter && (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>
      )}

      {/* 도서 목록 */}
      {books.length > 0 ? (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
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
