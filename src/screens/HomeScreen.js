import React from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react-native";
import BookCard from "../components/BookCard";
import { useBooks } from "../contexts/BookContext";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const { books, getNewBooks, getPopularBooks } = useBooks();
  const newBooks = getNewBooks();
  const popularBooks = getPopularBooks();
  const allBooks = books.slice(0, 8);

  const renderHorizontalBookList = (data, title, icon, filterType) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BookList", { filter: filterType })
          }
          style={styles.moreButton}
        >
          <Text style={styles.moreButtonText}>더보기</Text>
          <ArrowRight size={16} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.horizontalCard}>
            <BookCard book={item} style={{ width: 150 }} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            좋은 책과 함께하는{"\n"}특별한 하루
          </Text>
          <Text style={styles.heroSubtitle}>
            다양한 도서를 만나보고, 지식을 나누며 성장하세요.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Books")}
            style={styles.heroButton}
          >
            <Text style={styles.heroButtonText}>도서 둘러보기</Text>
            <ArrowRight size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 신간 도서 */}
      {renderHorizontalBookList(
        newBooks.slice(0, 5),
        "신간 도서",
        <Sparkles size={24} color={colors.primary[600]} />,
        "new"
      )}

      {/* 인기 도서 */}
      {renderHorizontalBookList(
        popularBooks,
        "인기 도서",
        <TrendingUp size={24} color={colors.primary[600]} />,
        "popular"
      )}

      {/* 전체 도서 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <BookOpen size={24} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>전체 도서</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Books")}
            style={styles.moreButton}
          >
            <Text style={styles.moreButtonText}>더보기</Text>
            <ArrowRight size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          {allBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  heroContainer: {
    padding: spacing.lg,
  },
  hero: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  heroTitle: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.md,
    lineHeight: fontSize["3xl"] * 1.3,
  },
  heroSubtitle: {
    fontSize: fontSize.lg,
    color: colors.primary[100],
    marginBottom: spacing.xl,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignSelf: "flex-start",
    gap: spacing.sm,
  },
  heroButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary[600],
  },
  section: {
    paddingVertical: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  moreButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary[600],
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  horizontalCard: {
    marginRight: spacing.md,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default HomeScreen;
