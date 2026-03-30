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
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme, mode } = useTheme();
  const signInMutation = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/(tabs)");
        },
        onError: async (err: any) => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert(
            "Sign In Failed",
            err instanceof Error ? err.message : "Something went wrong"
          );
        },
      }
    );
  };

  const themeIcon = mode === "system" ? "⚙️" : isDark ? "🌙" : "☀️";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Theme toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ alignSelf: "flex-end", marginBottom: 8 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
              <Text style={{ fontSize: 16 }}>{themeIcon}</Text>
            </View>
          </TouchableOpacity>

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <View
              style={{
                marginBottom: 14,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 36,
                    fontWeight: "800",
                    letterSpacing: -1,
                  }}
                >
                  G
                </Text>
              </LinearGradient>
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 28,
                fontWeight: "800",
                letterSpacing: -0.5,
                marginBottom: 6,
              }}
            >
              GymApp
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
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
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 22,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              Sign in to continue
            </Text>

            <AuthInput
              label="Email"
              icon="mail"
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              error={errors.email}
            />

            <AuthInput
              label="Password"
              icon="lock"
              placeholder="Min. 6 characters"
              textContentType="password"
              autoComplete="current-password"
              isPassword
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password)
                  setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
            />

            <TouchableOpacity
              style={{ alignItems: "flex-end", marginBottom: 20, marginTop: -4 }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            <GradientButton
              title="Sign In"
              onPress={handleSignIn}
              isLoading={signInMutation.isPending}
              style={{ marginTop: 4 }}
            />
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Create account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
