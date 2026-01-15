import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../theme/colors";

const Button = ({
  children,
  variant = "primary",
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondary;
      case "danger":
        return styles.danger;
      case "outline":
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryText;
      case "outline":
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "secondary"
              ? colors.primary[600]
              : colors.white
          }
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: {
    backgroundColor: colors.primary[600],
  },
  secondary: {
    backgroundColor: colors.gray[200],
  },
  danger: {
    backgroundColor: colors.red[600],
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary[600],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.gray[800],
  },
  outlineText: {
    color: colors.primary[600],
  },
});

export default Button;
