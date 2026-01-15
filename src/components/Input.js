import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing } from "../theme/colors";

const Input = forwardRef(
  ({ label, error, style, containerStyle, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError, style]}
          placeholderTextColor={colors.gray[400]}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    fontSize: fontSize.base,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.red[500],
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.red[600],
  },
});

export default Input;
