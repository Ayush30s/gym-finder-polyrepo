import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export function AuthInput({
  label,
  icon,
  error,
  isPassword = false,
  ...rest
}: AuthInputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 13,
          fontWeight: "600",
          marginBottom: 8,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isFocused ? colors.surface : colors.card,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: error
            ? colors.error
            : isFocused
            ? colors.primary
            : colors.border,
          paddingHorizontal: 14,
          height: 54,
        }}
      >
        <Feather
          name={icon}
          size={18}
          color={isFocused ? colors.primary : colors.textMuted}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 16,
            fontWeight: "400",
          }}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <Text
          style={{
            color: colors.error,
            fontSize: 12,
            marginTop: 5,
            marginLeft: 2,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
