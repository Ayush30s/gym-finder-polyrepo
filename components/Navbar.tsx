import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  useDerivedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Fonts, FontSizes } from "@/constants/fonts";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// --- Premium Rotating Toggle Component ---
const ThemeToggle = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const progress = useDerivedValue(() => {
    return withSpring(isDark ? 1 : 0, { damping: 15, stiffness: 150 });
  });

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border + "50", colors.primary + "30"],
    ),
  }));

  const knobStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [4, 28]);
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);
    return {
      transform: [{ translateX }, { rotate: `${rotate}deg` }],
      backgroundColor: isDark ? colors.primary : "#FFFFFF",
    };
  });

  return (
    <Pressable onPress={toggleTheme}>
      <Animated.View style={[styles.toggleTrack, trackStyle]}>
        <Animated.View style={[styles.toggleKnob, knobStyle, styles.shadow]}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={14}
            color={isDark ? "#FFFFFF" : colors.primary}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

// --- Main Navbar Component ---
export default function Navbar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { colors, isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const slideAnim = useSharedValue(SCREEN_WIDTH);

  const toggleMenu = (open: boolean) => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    slideAnim.value = withSpring(open ? 0 : SCREEN_WIDTH, {
      damping: 25,
      stiffness: 100,
      overshootClamping: true,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const NavItem = ({ icon, label, href, onPress, destructive }: any) => {
    const isActive = pathname === href;
    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.03)",
          },
          isActive && {
            backgroundColor: colors.primary + "15",
            borderColor: colors.primary + "30",
            borderWidth: 1,
          },
        ]}
        onPress={() => {
          toggleMenu(false);
          if (href) router.push(href);
          if (onPress) onPress();
        }}
      >
        <Feather
          name={icon}
          size={20}
          color={
            destructive ? colors.error : isActive ? colors.primary : colors.text
          }
        />
        <Text
          style={[
            styles.menuText,
            { color: destructive ? colors.error : colors.text },
            isActive && { fontFamily: Fonts.bold, color: colors.primary },
          ]}
        >
          {label}
        </Text>
        {isActive && (
          <View
            style={[styles.activeDot, { backgroundColor: colors.primary }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* 1. Main Header Bar */}
      <BlurView
        intensity={Platform.OS === "ios" ? 40 : 100}
        tint={isDark ? "dark" : "light"}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.background, opacity: 0.85 },
          ]}
        />

        <TouchableOpacity style={styles.row} onPress={() => router.push("/")}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.logoBadge}
          >
            <Text style={styles.logoText}>G</Text>
          </LinearGradient>
          <Text style={[styles.brandName, { color: colors.text }]}>GymApp</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <ThemeToggle />
          <TouchableOpacity
            onPress={() => toggleMenu(true)}
            style={[
              styles.iconButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Feather name="menu" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* 2. Full Screen Menu Overlay */}
      <Animated.View style={[styles.menuWrapper, animatedStyle]}>
        <BlurView
          intensity={Platform.OS === "ios" ? 95 : 100}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark
                  ? "rgba(9,9,11,0.75)"
                  : "rgba(250,250,251,0.75)",
              },
            ]}
          />

          <View
            style={[
              styles.menuContent,
              {
                paddingTop: insets.top + 10,
                paddingBottom: insets.bottom + 20,
              },
            ]}
          >
            {/* 🔼 TOP CONTENT */}
            <View style={{ flex: 1 }}>
              <View style={styles.menuHeader}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  Menu
                </Text>
                <TouchableOpacity
                  onPress={() => toggleMenu(false)}
                  style={[styles.closeBtn, { backgroundColor: colors.surface }]}
                >
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* ACCOUNT */}
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Account
              </Text>

              {!isAuthenticated ? (
                <>
                  <NavItem
                    icon="log-in"
                    label="Sign In"
                    href="/(auth)/signin"
                  />
                  <NavItem
                    icon="user-plus"
                    label="Join Free"
                    href="/(auth)/register"
                  />
                </>
              ) : (
                <>
                  <NavItem
                    icon="user"
                    label="My Profile"
                    href="/(tabs)/profile"
                  />
                  <NavItem
                    icon="heart"
                    label="Favorites"
                    href="/(tabs)/favorites"
                  />
                  <NavItem
                    icon="log-out"
                    label="Log Out"
                    destructive
                    onPress={() => router.push("/(auth)/logout")}
                  />
                </>
              )}

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border, opacity: 0.5 },
                ]}
              />

              {/* EXPLORE */}
              <Text
                style={[styles.sectionLabel, { color: colors.textSecondary }]}
              >
                Explore
              </Text>

              <NavItem icon="map-pin" label="Our Gyms" href="/locations" />
              <NavItem icon="info" label="About Us" href="/about" />
              <NavItem icon="mail" label="Contact Us" href="/contact" />
            </View>

            {/* 🔽 BOTTOM FIXED */}
            <View
              style={[
                styles.bottomBar,
                {
                  borderTopColor: colors.border,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.utilButton}
                onPress={() => {
                  toggleMenu(false);
                  router.push("/(tabs)/settings");
                }}
              >
                <Feather
                  name="settings"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.utilText, { color: colors.textSecondary }]}
                >
                  App Settings
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    zIndex: 10,
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#fff", fontFamily: Fonts.bold, fontSize: 18 },
  brandName: { fontFamily: Fonts.bold, fontSize: 20, letterSpacing: -0.5 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // --- Toggle Styles ---
  toggleTrack: {
    width: 58,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.1)",
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  // --- Menu Overlay Styles ---
  menuWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%", // ✅ important
    zIndex: 9999,
    elevation: 20,
  },
  menuContent: {
    paddingHorizontal: 20,
    justifyContent: "space-between", // ✅ content spread
    height: "100%", // ✅ full height
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  menuTitle: { fontFamily: Fonts.bold, fontSize: 28, letterSpacing: -1 },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 14,
    marginBottom: 10,
  },
  menuText: { fontSize: 16, fontFamily: Fonts.medium },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginLeft: "auto" },
  sectionLabel: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 10,
    letterSpacing: 1,
  },
  divider: { height: 1, marginVertical: 20, width: "100%" },
  bottomBar: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 20,
    borderTopWidth: 0.5,
    justifyContent: "center",
    marginTop: 10,
  },
  utilButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  utilText: { fontSize: 14, fontFamily: Fonts.medium },
});
