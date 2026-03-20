import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Search } from "lucide-react-native";
import BookCard from "../components/BookCard";
import { useBooks } from "../contexts/BookContext";
import { colors, borderRadius, fontSize, spacing } from "../theme/colors";

const SearchScreen = () => {
  const route = useRoute();
  const initialQuery = route.params?.query || "";
  const { searchQuery, setSearchQuery, searchBooks } = useBooks();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
  }, [initialQuery, setSearchQuery]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchBooks(searchQuery.trim(), 0, 50)
      .then((list) => {
        if (!cancelled) setResults(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [searchQuery, searchBooks]);

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
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="도서명으로 검색..."
            placeholderTextColor={colors.gray[400]}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      </View>

      {searchQuery ? (
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>검색 결과: "{searchQuery}"</Text>
          <Text style={styles.resultCount}>{results.length}건</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
