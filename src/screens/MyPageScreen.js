import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import {
  User,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";
import * as userApi from "../api/user";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const MyPageScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, logout, deleteMe, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [purchases, setPurchases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }

    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
    }

    loadPurchases();
    loadReviews();
  }, [user, isAuthenticated]);

  const loadPurchases = useCallback(async () => {
    if (!user?.id) return;
    try {
      const page = await userApi.getMyPurchases(0, 50);
      const content = page.content || page;
      setPurchases(Array.isArray(content) ? content : []);
    } catch (error) {
      console.error("Failed to load purchases:", error);
      setPurchases([]);
    }
  }, [user?.id]);

  const loadReviews = useCallback(async () => {
    if (!user?.id) return;
    try {
      const page = await userApi.getMyReviews(0, 50);
      const content = page.content || page;
      setReviews(Array.isArray(content) ? content : []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    }
  }, [user?.id]);

  const onSubmit = async (data) => {
    try {
      await updateUser(data);
      Alert.alert("알림", "정보가 수정되었습니다.");
    } catch (e) {
      Alert.alert("알림", e.message || "수정에 실패했습니다.");
    }
  };

  const handleWithdraw = () => {
    Alert.alert("회원 탈퇴", "정말 탈퇴하시겠습니까?", [
      { text: "취소" },
      {
        text: "탈퇴",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMe();
            Alert.alert("알림", "탈퇴되었습니다.");
            navigation.navigate("Main");
          } catch (e) {
            Alert.alert("알림", e.message || "탈퇴에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Main");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: "profile", label: "내 정보", icon: User },
    { id: "purchases", label: "구매 목록", icon: ShoppingBag },
    { id: "reviews", label: "내가 쓴 댓글", icon: MessageSquare },
    { id: "settings", label: "설정", icon: Settings },
  ];

  const renderStars = (rating) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={star <= rating ? styles.starActive : styles.starInactive}
        >
          ★
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.tabButtonActive,
              ]}
            >
              <tab.icon
                size={20}
                color={
                  activeTab === tab.id ? colors.primary[700] : colors.gray[600]
                }
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab.id && styles.tabButtonTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 내 정보 */}
        {activeTab === "profile" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>내 정보 조회/수정</Text>

            <Controller
              control={control}
              name="name"
              rules={{ required: "이름을 입력해주세요." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="이름"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value } }) => (
                <Input
                  label="이메일"
                  value={value}
                  editable={false}
                  style={styles.disabledInput}
                />
              )}
            />

            <Button onPress={handleSubmit(onSubmit)}>정보 수정</Button>
          </View>
        )}

        {/* 구매 목록 */}
        {activeTab === "purchases" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>구매 목록</Text>
            {purchases.length > 0 ? (
              purchases.map((order) => (
                <View key={order.orderId} style={styles.purchaseItem}>
                  <View style={styles.purchaseInfo}>
                    <Text style={styles.purchaseTitle}>
                      주문번호: {order.orderNo}
                    </Text>
                    <Text style={styles.purchasePrice}>
                      {order.totalPrice?.toLocaleString()}원
                    </Text>
                    <Text style={styles.purchaseDate}>
                      주문일:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </Text>
                    <Text style={styles.orderStatus}>
                      {order.status === "PAID"
                        ? "결제완료"
                        : order.status === "REFUNDED"
                        ? "환불완료"
                        : order.status || ""}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>구매 내역이 없습니다.</Text>
              </View>
            )}
          </View>
        )}

        {/* 내가 쓴 댓글 */}
        {activeTab === "reviews" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>내가 쓴 댓글</Text>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewDate}>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </Text>
                  </View>
                  <Text style={styles.reviewText}>
                    {review.content || review.text}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>작성한 댓글이 없습니다.</Text>
              </View>
            )}
          </View>
        )}

        {/* 설정 */}
        {activeTab === "settings" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>설정</Text>

            <TouchableOpacity onPress={handleLogout} style={styles.settingItem}>
              <LogOut size={20} color={colors.gray[600]} />
              <Text style={styles.settingText}>로그아웃</Text>
            </TouchableOpacity>

            <View style={styles.dangerSection}>
              <Text style={styles.dangerTitle}>회원 탈퇴</Text>
              <Text style={styles.dangerDescription}>
                탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
              </Text>
              <Button variant="danger" onPress={handleWithdraw}>
                회원 탈퇴
              </Button>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  tabContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  tabButtonActive: {
    backgroundColor: colors.primary[100],
  },
  tabButtonText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  tabButtonTextActive: {
    color: colors.primary[700],
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  disabledInput: {
    backgroundColor: colors.gray[100],
  },
  purchaseItem: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  purchaseInfo: {
    flex: 1,
  },
  orderStatus: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  purchaseTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  purchaseAuthor: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  purchasePrice: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  purchaseDate: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  reviewItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: spacing.md,
  },
  starActive: {
    color: colors.yellow[400],
    fontSize: fontSize.base,
  },
  starInactive: {
    color: colors.gray[300],
    fontSize: fontSize.base,
  },
  reviewDate: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  reviewText: {
    fontSize: fontSize.base,
    color: colors.gray[700],
    lineHeight: fontSize.base * 1.5,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.gray[500],
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  settingText: {
    fontSize: fontSize.base,
    color: colors.gray[700],
  },
  dangerSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  dangerTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  dangerDescription: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default MyPageScreen;
