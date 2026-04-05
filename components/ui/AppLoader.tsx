import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Typography } from "@/constants/fonts";

export const AppLoader = ({ text = "Loading..." }: { text?: string }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background + "CC", // blur effect
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />

      <Text
        style={[Typography.body, { color: colors.textMuted, marginTop: 12 }]}
      >
        {text}
      </Text>
    </View>
  );
};
