import React, { useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Search } from "lucide-react-native";
import BookCard from "../components/BookCard";
import { useBooks } from "../contexts/BookContext";
import { colors, borderRadius, fontSize, spacing } from "../theme/colors";

const SearchScreen = () => {
  const route = useRoute();
  const initialQuery = route.params?.query || "";
  const { getFilteredBooks, searchQuery, setSearchQuery } = useBooks();

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredBooks = getFilteredBooks();

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
      {/* 검색 입력 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="도서명 또는 저자명으로 검색..."
            placeholderTextColor={colors.gray[400]}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      {/* 검색 결과 */}
      {searchQuery ? (
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>검색 결과: "{searchQuery}"</Text>
          <Text style={styles.resultCount}>{filteredBooks.length}건</Text>
        </View>
      ) : null}

      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookItem}
          numColumns={2}
          contentContainerStyle={styles.bookList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? "검색 결과가 없습니다." : "검색어를 입력해주세요."}
          </Text>
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
  searchContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray[900],
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  resultTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.gray[900],
  },
  resultCount: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
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

export default SearchScreen;
