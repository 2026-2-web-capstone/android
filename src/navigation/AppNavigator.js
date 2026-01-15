import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  BookOpen,
  ShoppingCart,
  User,
  Search,
  Settings,
} from "lucide-react-native";

import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

// Screens
import HomeScreen from "../screens/HomeScreen";
import BookListScreen from "../screens/BookListScreen";
import BookDetailScreen from "../screens/BookDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CartScreen from "../screens/CartScreen";
import MyPageScreen from "../screens/MyPageScreen";
import SearchScreen from "../screens/SearchScreen";
import AdminScreen from "../screens/AdminScreen";

import { colors, fontSize, fontWeight, spacing } from "../theme/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 하단 탭 네비게이터
const TabNavigator = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          switch (route.name) {
            case "Home":
              IconComponent = Home;
              break;
            case "Books":
              IconComponent = BookOpen;
              break;
            case "Cart":
              IconComponent = ShoppingCart;
              break;
            case "MyPage":
              IconComponent = User;
              break;
            case "Admin":
              IconComponent = Settings;
              break;
            default:
              IconComponent = Home;
          }

          return (
            <View>
              <IconComponent size={24} color={color} />
              {route.name === "Cart" && getTotalItems() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {getTotalItems() > 9 ? "9+" : getTotalItems()}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          height: 85,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.gray[900],
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          headerTitle: "도서 쇼핑몰",
        }}
      />
      <Tab.Screen
        name="Books"
        component={BookListScreen}
        options={{
          title: "도서",
          headerTitle: "도서 목록",
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "장바구니",
          headerTitle: "장바구니",
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: "마이페이지",
          headerTitle: "마이페이지",
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: "관리자",
            headerTitle: "관리자 페이지",
          }}
        />
      )}
    </Tab.Navigator>
  );
};

// 메인 스택 네비게이터
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.gray[900],
          headerTitleStyle: {
            fontWeight: "700",
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{
            title: "도서 상세",
            headerTransparent: true,
            headerTintColor: colors.gray[900],
          }}
        />
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={({ route }) => ({
            title:
              route.params?.filter === "new"
                ? "신간 도서"
                : route.params?.filter === "popular"
                ? "인기 도서"
                : "도서 목록",
          })}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "로그인" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "회원가입" }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: "검색",
            headerRight: () => <Search size={24} color={colors.gray[600]} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.red[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
});

export default AppNavigator;
