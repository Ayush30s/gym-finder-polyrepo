import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { Fonts } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useRegister } from "@/hooks/useRegister";

// const register = useRegister();

type Role = "USER" | "TRAINER" | "OWNER";

export default function RegisterScreen() {
  const register = useRegister();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Form State
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { id: "USER" as Role, label: "User", icon: "account" },
    { id: "TRAINER" as Role, label: "Trainer", icon: "arm-flex" },
    { id: "OWNER" as Role, label: "Gym Owner", icon: "storefront" },
  ];
  const handleRegister = () => {
    console.log("🟡 BUTTON CLICKED");

    if (!name || !email || !password) {
      Alert.alert("Error", "All fields required");
      return;
    }

    register.mutate(
      {
        name,
        email,
        password,
        role: "USER", // 🔥 IMPORTANT FIX
      },
      {
        onSuccess: () => {
          console.log("✅ REGISTER DONE");
          Alert.alert("Success", "Registration successful");
          router.replace("/(auth)/signin");
        },
        onError: (error: any) => {
          console.log("❌ REGISTER FAILED");

          Alert.alert(
            "Error",
            error?.response?.data?.message || "Registration failed",
          );
        },
      },
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary + "15", colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                styles.innerContent,
                {
                  paddingTop: insets.top + 40,
                  paddingBottom: insets.bottom + 20,
                },
              ]}
            >
              {/* Hero Section */}
              <View style={styles.hero}>
                <Text style={[styles.heading, { color: colors.text }]}>
                  {selectedRole ? `Join as ${selectedRole}` : "Join Vigor"}
                </Text>
                <Text
                  style={[styles.subheading, { color: colors.textSecondary }]}
                >
                  {selectedRole
                    ? `Complete your ${selectedRole.toLowerCase()} profile.`
                    : "Choose your account type to continue."}
                </Text>
              </View>

              {/* Role Selection Row */}
              <View style={styles.roleContainer}>
                {roleOptions.map((item) => {
                  const isActive = selectedRole === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setSelectedRole(item.id);
                        if (Platform.OS !== "web") Haptics.selectionAsync();
                      }}
                      style={[
                        styles.roleCard,
                        {
                          backgroundColor: isActive
                            ? colors.primary
                            : isDark
                              ? colors.surface
                              : "#FFF",
                          borderColor: isActive
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={26}
                        color={isActive ? "#FFF" : colors.primary}
                      />
                      <Text
                        style={[
                          styles.roleText,
                          { color: isActive ? "#FFF" : colors.text },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Form Section */}
              {selectedRole && (
                <View
                  style={[
                    styles.form,
                    {
                      backgroundColor: isDark ? colors.surface : "#FFF",
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <AestheticInput
                    label="Full Name"
                    icon="user"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChangeText={setName}
                    colors={colors}
                  />

                  <AestheticInput
                    label="Email Address"
                    icon="mail"
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    colors={colors}
                  />

                  <AestheticInput
                    label="Password"
                    icon="lock"
                    placeholder="Min. 6 characters"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    rightIcon={showPassword ? "eye-off" : "eye"}
                    onIconPress={() => setShowPassword(!showPassword)}
                    colors={colors}
                  />

                  {/* Inline Error Tracking */}
                  {register.isError && (
                    <Text style={styles.errorText}>
                      {(register.error as any)?.response?.data?.message ||
                        "Registration failed"}
                    </Text>
                  )}

                  <Pressable
                    onPress={handleRegister}
                    style={styles.mainButton}
                    disabled={register.isPending}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.primaryDark]}
                      style={styles.gradientBtn}
                    >
                      {register.isPending ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text style={styles.buttonText}>
                          Register as {selectedRole}
                        </Text>
                      )}
                    </LinearGradient>
                  </Pressable>
                </View>
              )}

              {/* Footer */}
              <Pressable
                style={styles.footerLink}
                onPress={() => router.push("/(auth)/signin")}
              >
                <Text
                  style={[styles.footerText, { color: colors.textSecondary }]}
                >
                  Already have an account?{" "}
                  <Text
                    style={{ color: colors.primary, fontFamily: Fonts.bold }}
                  >
                    Sign In
                  </Text>
                </Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const AestheticInput = ({
  label,
  icon,
  rightIcon,
  onIconPress,
  colors,
  ...props
}: any) => (
  <View style={styles.field}>
    <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    <View
      style={[
        styles.inputWrap,
        {
          backgroundColor: colors.border + "15",
          borderColor: colors.border + "40",
        },
      ]}
    >
      <Feather name={icon} size={18} color={colors.textSecondary} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholderTextColor={colors.textSecondary + "80"}
        autoCapitalize="none"
        {...props}
      />
      {rightIcon && (
        <Pressable onPress={onIconPress}>
          <Feather name={rightIcon} size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  innerContent: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  hero: { marginBottom: 20 },
  heading: { fontFamily: Fonts.bold, fontSize: 32, letterSpacing: -1 },
  subheading: { fontFamily: Fonts.medium, fontSize: 16, marginTop: 4 },
  roleContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  roleCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleText: { fontSize: 12, fontFamily: Fonts.bold },
  form: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    elevation: 2,
  },
  field: { gap: 6 },
  label: { fontFamily: Fonts.bold, fontSize: 13, marginLeft: 4 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  input: { flex: 1, fontFamily: Fonts.medium, fontSize: 16 },
  mainButton: { height: 56, marginTop: 10 },
  gradientBtn: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontFamily: Fonts.bold, fontSize: 16 },
  errorText: {
    color: "#FF4D4D",
    textAlign: "center",
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  footerLink: { alignItems: "center", marginTop: 25, marginBottom: 20 },
  footerText: { fontFamily: Fonts.medium, fontSize: 14 },
});
