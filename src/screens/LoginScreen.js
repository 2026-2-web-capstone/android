import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigation.goBack();
      } else {
        setError("로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>로그인</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Controller
            control={control}
            name="email"
            rules={{
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다.",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="이메일"
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "비밀번호를 입력해주세요.",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.loginButton}
          >
            로그인
          </Button>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>회원가입</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.testAccountBox}>
            <Text style={styles.testAccountTitle}>테스트 계정:</Text>
            <Text style={styles.testAccountText}>
              일반 사용자: user@example.com / password
            </Text>
            <Text style={styles.testAccountText}>
              관리자: admin@example.com / password
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.gray[900],
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  errorBox: {
    backgroundColor: colors.red[50],
    borderWidth: 1,
    borderColor: colors.red[100],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.red[700],
    fontSize: fontSize.sm,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  registerText: {
    fontSize: fontSize.base,
    color: colors.gray[600],
  },
  registerLink: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.primary[600],
  },
  testAccountBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  testAccountTitle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  testAccountText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
});

export default LoginScreen;
