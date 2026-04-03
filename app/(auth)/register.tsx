import { Feather } from "@expo/vector-icons";
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
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRegister } from "@/api/authApi";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Fonts } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "@/components/Navbar"; // Ensure path is correct

export default function RegisterScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { _setSession } = useAuth();
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleRegister = () => {
    // ... validation and logic same as before
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // register.mutate logic here...
  };

  return (
    // 1. Root View (No ScrollView here)
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.primary + "15", colors.background]}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Navbar hamesha TOP par rahega */}
      <Navbar />

      {/* 3. KeyboardAvoidingView sirf content ko adjust karega */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[styles.innerContent, { paddingBottom: insets.bottom + 20 }]}
          >
            {/* Hero Section */}
            <View style={styles.hero}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Join Vigor
              </Text>
              <Text
                style={[styles.subheading, { color: colors.textSecondary }]}
              >
                Start your fitness journey today.
              </Text>
            </View>

            {/* Form Card */}
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

              <Pressable onPress={handleRegister} style={styles.mainButton}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.gradientBtn}
                >
                  {register.isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>

            {/* Footer */}
            <Pressable
              style={styles.footerLink}
              onPress={() => router.push("/(auth)/signin")}
            >
              <Text
                style={[styles.footerText, { color: colors.textSecondary }]}
              >
                Already have an account?{" "}
                <Text style={{ color: colors.primary, fontFamily: Fonts.bold }}>
                  Sign In
                </Text>
              </Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

// Input Component (Aesthetic)
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
  innerContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center", // Isse content screen ke beech mein rahega aur scroll nahi hoga
  },
  hero: { marginBottom: 20 },
  heading: { fontFamily: Fonts.bold, fontSize: 32, letterSpacing: -1 },
  subheading: { fontFamily: Fonts.medium, fontSize: 16, marginTop: 4 },
  form: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  buttonText: { color: "#fff", fontFamily: Fonts.bold, fontSize: 18 },
  footerLink: { alignItems: "center", marginTop: 25 },
  footerText: { fontFamily: Fonts.medium, fontSize: 14 },
});
