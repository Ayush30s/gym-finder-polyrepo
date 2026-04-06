import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

import { AuthInput } from "@/components/ui/AuthInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { useSignIn } from "@/hooks/useSignIn";

// ✅ GLOBAL DESIGN SYSTEM
import { Fonts, FontSizes, Typography } from "@/constants/fonts";
import { AppLoader } from "@/components/ui/AppLoader";
import { apiClient } from "@/services/apiClient";

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

export default function SignInScreen() {
  console.log("BASE URL:", apiClient.defaults.baseURL);
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme, mode } = useTheme();
  const signInMutation = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSignIn = async () => {
    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrors({});

    signInMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: async () => {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
          router.replace("/(tabs)");
        },
        onError: async (err: any) => {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
          Alert.alert(
            "Sign In Failed",
            err instanceof Error ? err.message : "Something went wrong",
          );
        },
      },
    );
  };

  // const themeIcon = mode === "system" ? "⚙️" : isDark ? "🌙" : "☀️";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 20,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Toggle */}
          {/* <TouchableOpacity
            onPress={toggleTheme}
            style={{ alignSelf: "flex-end", marginBottom: 8 }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: FontSizes.md }}>{themeIcon}</Text>
            </View>
          </TouchableOpacity> */}

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 32,
                  color: colors.white,
                }}
              >
                G
              </Text>
            </LinearGradient>

            <Text style={[Typography.heading, { color: colors.text }]}>
              GymApp
            </Text>

            <Text style={[Typography.caption, { color: colors.textMuted }]}>
              Your fitness journey starts here
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 24,
            }}
          >
            <Text style={[Typography.subHeading, { color: colors.text }]}>
              Welcome back
            </Text>

            <Text
              style={[
                Typography.caption,
                { color: colors.textMuted, marginBottom: 24 },
              ]}
            >
              Sign in to continue
            </Text>

            <AuthInput
              label="Email"
              icon="mail"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />

            <AuthInput
              label="Password"
              icon="lock"
              placeholder="Min. 6 characters"
              isPassword
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <TouchableOpacity
              style={{ alignItems: "flex-end", marginBottom: 20 }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: FontSizes.sm,
                  color: colors.primary,
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            <GradientButton
              title="Sign In"
              onPress={handleSignIn}
              isLoading={signInMutation.isPending}
            />
          </View>

          {/* Footer */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={[Typography.body, { color: colors.textMuted }]}>
              Don't have an account?{" "}
            </Text>

            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSizes.md,
                    color: colors.primary,
                  }}
                >
                  Create account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </LinearGradient>
      {signInMutation.isPending && <AppLoader text="Signing you in..." />}
    </KeyboardAvoidingView>
  );
}
