import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>로그인이 필요합니다.</Text>
        <Button
          onPress={() => navigation.navigate("Login")}
          style={styles.loginButton}
        >
          로그인하기
        </Button>
      </View>
    );
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("알림", "장바구니가 비어있습니다.");
      return;
    }

    Alert.alert("구매 확인", "구매하시겠습니까?", [
      { text: "취소" },
      {
        text: "구매",
        onPress: async () => {
          // 구매 내역 저장
          const purchases = cartItems.map((item) => ({
            ...item,
            date: new Date().toISOString(),
          }));

          try {
            const existingPurchases = await AsyncStorage.getItem(
              `purchases_${user?.id}`
            );
            const parsedPurchases = existingPurchases
              ? JSON.parse(existingPurchases)
              : [];
            await AsyncStorage.setItem(
              `purchases_${user?.id}`,
              JSON.stringify([...parsedPurchases, ...purchases])
            );

            Alert.alert("알림", "구매가 완료되었습니다!");
            clearCart();
            navigation.navigate("MyPage");
          } catch (error) {
            Alert.alert("오류", "구매 처리 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert("장바구니 비우기", "장바구니를 비우시겠습니까?", [
      { text: "취소" },
      {
        text: "비우기",
        style: "destructive",
        onPress: clearCart,
      },
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={64} color={colors.gray[400]} />
        <Text style={styles.emptyTitle}>장바구니가 비어있습니다</Text>
        <Text style={styles.emptyText}>
          원하는 도서를 장바구니에 담아보세요.
        </Text>
        <Button
          onPress={() => navigation.navigate("Books")}
          style={styles.browseButton}
        >
          도서 둘러보기
        </Button>
      </View>
    );
  }

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.itemInfo}>
        <TouchableOpacity
          onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
        >
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <Text style={styles.itemAuthor}>{item.author}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()}원</Text>

        <View style={styles.itemActions}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Minus size={16} color={colors.gray[700]} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Plus size={16} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemRight}>
            <Text style={styles.itemTotal}>
              {(item.price * item.quantity).toLocaleString()}원
            </Text>
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.deleteButton}
            >
              <Trash2 size={20} color={colors.red[600]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 주문 요약 */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>상품 금액</Text>
          <Text style={styles.summaryValue}>
            {getTotalPrice().toLocaleString()}원
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>배송비</Text>
          <Text style={styles.summaryValue}>무료</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>총 결제금액</Text>
          <Text style={styles.totalValue}>
            {getTotalPrice().toLocaleString()}원
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleCheckout} style={styles.checkoutButton}>
            구매하기
          </Button>
          <Button
            variant="secondary"
            onPress={handleClearCart}
            style={styles.clearButton}
          >
            장바구니 비우기
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.gray[500],
    marginBottom: spacing.xl,
  },
  loginButton: {
    paddingHorizontal: spacing.xxl,
  },
  browseButton: {
    paddingHorizontal: spacing.xxl,
  },
  listContent: {
    padding: spacing.lg,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 110,
    borderRadius: borderRadius.md,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  itemAuthor: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  itemPrice: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.md,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    marginHorizontal: spacing.md,
    minWidth: 24,
    textAlign: "center",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  itemTotal: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
  },
  deleteButton: {
    padding: spacing.sm,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.base,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: fontSize.base,
    color: colors.gray[900],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  checkoutButton: {
    width: "100%",
  },
  clearButton: {
    width: "100%",
  },
});

export default CartScreen;
