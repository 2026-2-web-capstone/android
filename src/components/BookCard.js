import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ShoppingCart, Eye } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../contexts/CartContext";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.lg * 3) / 2; // 2열 그리드용

const BookCard = ({ book, style }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const handlePress = () => {
    navigation.navigate("BookDetail", { bookId: book.id });
  };

  const handleAddToCart = () => {
    addToCart(book);
    // TODO: 토스트 메시지 표시
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, style]}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <Text style={styles.publisher} numberOfLines={1}>
          {book.publisher}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{book.price.toLocaleString()}원</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleAddToCart}
              style={styles.iconButton}
            >
              <ShoppingCart size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: colors.gray[100],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: spacing.md,
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
    lineHeight: fontSize.base * 1.4,
  },
  author: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  publisher: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BookCard;
