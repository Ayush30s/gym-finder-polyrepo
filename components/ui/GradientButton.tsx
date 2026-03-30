import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function GradientButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
}: GradientButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.85}
      style={[{ borderRadius: 14, overflow: "hidden" }, style]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 56,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          opacity: disabled || isLoading ? 0.5 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              fontWeight: "700",
              letterSpacing: 0.4,
            }}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
