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

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register: registerUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await registerUser(data.email, data.password, data.name);
      if (result.success) {
        navigation.navigate("Home");
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
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
          <Text style={styles.title}>회원가입</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Controller
            control={control}
            name="name"
            rules={{
              required: "이름을 입력해주세요.",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="이름"
                placeholder="이름을 입력하세요"
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
              minLength: {
                value: 6,
                message: "비밀번호는 최소 6자 이상이어야 합니다.",
              },
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

          <Controller
            control={control}
            name="passwordConfirm"
            rules={{
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다.",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.registerButton}
          >
            회원가입
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
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
  registerButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: fontSize.base,
    color: colors.gray[600],
  },
  loginLink: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.primary[600],
  },
});

export default RegisterScreen;
