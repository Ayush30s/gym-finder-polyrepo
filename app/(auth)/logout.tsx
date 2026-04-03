import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Fonts, FontSizes } from "@/constants/fonts";

export default function LogoutScreen() {
  const { colors } = useTheme();
  const { signOut } = useAuth(); // Changed from logout to signOut

  useEffect(() => {
    const timer = setTimeout(() => {
      signOut(); // Clears storage and handles redirect
    }, 1500);
    return () => clearTimeout(timer);
  }, [signOut]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Logging you out...
      </Text>
      <Text style={[styles.subText, { color: colors.textSecondary }]}>
        Preparing your next session.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: { fontFamily: Fonts.bold, fontSize: FontSizes.xl, marginTop: 20 },
  subText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    marginTop: 8,
    textAlign: "center",
  },
});
