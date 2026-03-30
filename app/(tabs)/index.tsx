import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const QUICK_ACTIONS = [
  { icon: "activity" as const, label: "Workout", color: "#FF6B2B" },
  { icon: "heart" as const, label: "Health", color: "#EF4444" },
  { icon: "bar-chart-2" as const, label: "Progress", color: "#22C55E" },
  { icon: "calendar" as const, label: "Schedule", color: "#3B82F6" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme, mode } = useTheme();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          await signOut();
        },
      },
    ]);
  };

  const themeIcon = mode === "system" ? "☀️" : isDark ? "🌙" : "☀️";

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 16,
            paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                Hey, {user?.name?.split(" ")[0] || "Athlete"} 👋
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Ready to crush today?
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {/* Theme toggle */}
              <TouchableOpacity
                onPress={toggleTheme}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{themeIcon}</Text>
                </View>
              </TouchableOpacity>

              {/* Avatar / Sign out */}
              <TouchableOpacity
                onPress={handleSignOut}
                activeOpacity={0.75}
                style={{
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero banner */}
          <LinearGradient
            colors={[`${colors.primary}22`, `${colors.primaryDark}11`]}
            style={{
              borderRadius: 20,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: `${colors.primary}30`,
              marginBottom: 28,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 20,
                  fontWeight: "700",
                  marginBottom: 4,
                }}
              >
                Today's Plan
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                You have 3 sessions scheduled
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => Haptics.selectionAsync()}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignSelf: "flex-start",
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  >
                    View Workout
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 12, opacity: 0.7 }}>
              <Feather name="zap" size={48} color={colors.primary} />
            </View>
          </LinearGradient>

          {/* Quick Actions */}
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 14,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={{
                  width: "47%",
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "flex-start",
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.8}
                onPress={() => Haptics.selectionAsync()}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${action.color}20`,
                    marginBottom: 10,
                  }}
                >
                  <Feather name={action.icon} size={22} color={action.color} />
                </View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Activity */}
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 14,
            }}
          >
            Recent Activity
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.2 : 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Feather name="activity" size={32} color={colors.textMuted} />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                fontWeight: "600",
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              No activity yet
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Start your first workout to see your progress here
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
