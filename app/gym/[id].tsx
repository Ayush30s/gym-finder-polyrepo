import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useToggleFavorite } from "@/hooks/useFavorites";
import { GYMS } from "@/data/gyms";
import { GradientButton } from "@/components/ui/GradientButton";
import { Feather } from "@expo/vector-icons";

// 🔥 UPDATED (theme-based where possible)
const PRICE_COLORS = (colors: any) => ({
  Budget: colors.success,
  Mid: colors.primary,
  Premium: "#8B5CF6",
});

function StarRating({ rating, colors }: { rating: number; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name="star"
          size={14}
          color={i <= Math.round(rating) ? colors.primary : colors.border} // ✅ FIXED
        />
      ))}
    </View>
  );
}

export default function GymDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const toggleFav = useToggleFavorite();

  const gym = GYMS.find((g) => g.id === id);

  if (!gym) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather
          name="alert-circle"
          size={48}
          color={colors.textMuted}
          style={{ marginBottom: 16 }}
        />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
          Gym not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            padding: 12,
            backgroundColor: colors.surface,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFav.mutate(gym.id);
  };

  const priceColors = PRICE_COLORS(colors);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[`${colors.primary}25`, colors.background]}
          style={{
            paddingTop: Platform.OS === "web" ? 20 : insets.top + 12,
            paddingHorizontal: 16,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Feather name="arrow-left" size={20} color={colors.text} />
            </TouchableOpacity>

            {isAuthenticated && (
              <TouchableOpacity
                onPress={handleFavorite}
                disabled={toggleFav.isPending}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: gym.isFavorited
                    ? colors.error + "20"
                    : colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: gym.isFavorited ? colors.error : colors.border,
                }}
              >
                <Feather
                  name="heart"
                  size={20}
                  color={gym.isFavorited ? colors.error : colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Title */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: `${colors.primary}20`,
                borderWidth: 2,
                borderColor: `${colors.primary}40`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="zap" size={32} color={colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 26,
                  fontWeight: "800",
                }}
              >
                {gym.name}
              </Text>

              <View style={{ flexDirection: "row", gap: 6 }}>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: gym.isOpen
                      ? colors.success + "22"
                      : colors.error + "22",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: gym.isOpen ? colors.success : colors.error,
                    }}
                  >
                    {gym.isOpen ? "OPEN NOW" : "CLOSED"}
                  </Text>
                </View>

                <Text style={{ color: colors.textMuted }}>•</Text>
                <Text style={{ color: colors.textMuted }}>
                  {gym.distance} away
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ padding: 20, gap: 24 }}>
          {/* Stats */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <StarRating rating={gym.rating} colors={colors} />
              <Text style={{ color: colors.text }}>
                {gym.rating.toFixed(1)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: priceColors[gym.priceTier],
                  fontWeight: "700",
                }}
              >
                {gym.priceTier}
              </Text>
              <Text style={{ color: colors.text }}>${gym.pricePerMonth}</Text>
            </View>
          </View>

          {/* Location */}
          <Text style={{ color: colors.text }}>
            📍 {gym.location}, {gym.city}
          </Text>

          {/* About */}
          <Text style={{ color: colors.textSecondary }}>{gym.highlight}</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,

          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Platform.OS === "web" ? 20 : insets.bottom + 10,

          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,

          backgroundColor: colors.surface,

          borderTopWidth: 1,
          borderColor: colors.border,

          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <GradientButton
          title="Get Membership"
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
        />
      </View>
    </View>
  );
}
