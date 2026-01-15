import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const LoadingSpinner = ({ size = "large", color = colors.primary[600] }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingSpinner;
