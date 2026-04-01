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

const PRICE_COLORS: Record<string, string> = {
  Budget: "#22C55E",
  Mid: "#3B82F6",
  Premium: "#8B5CF6",
};

function StarRating({ rating, colors }: { rating: number; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name="star"
          size={14}
          color={i <= Math.round(rating) ? "#F59E0B" : colors.border}
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

  // Find the specific gym. In a real app, you might use a useQuery hook here to fetch by ID.
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Section */}
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
          {/* Top Navigation Row */}
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
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
                    ? "#EF444420"
                    : colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: gym.isFavorited ? "#EF4444" : colors.border,
                }}
              >
                <Feather
                  name="heart"
                  size={20}
                  color={gym.isFavorited ? "#EF4444" : colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Gym Title & Badges */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
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
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 26,
                  fontWeight: "800",
                  marginBottom: 4,
                }}
              >
                {gym.name}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: gym.isOpen ? "#22C55E22" : "#EF444422",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: gym.isOpen ? "#22C55E" : "#EF4444",
                    }}
                  >
                    {gym.isOpen ? "OPEN NOW" : "CLOSED"}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>•</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                  {gym.distance} away
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={{ padding: 20, gap: 24 }}>
          {/* Stats Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
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
                  color: colors.textSecondary,
                  fontSize: 12,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                RATING
              </Text>
              <StarRating rating={gym.rating} colors={colors} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "700",
                  marginTop: 4,
                }}
              >
                {gym.rating.toFixed(1)}{" "}
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    fontWeight: "400",
                  }}
                >
                  ({gym.reviewCount})
                </Text>
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
                  color: colors.textSecondary,
                  fontSize: 12,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                MONTHLY
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  backgroundColor: `${PRICE_COLORS[gym.priceTier]}18`,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color: PRICE_COLORS[gym.priceTier],
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  {gym.priceTier.toUpperCase()}
                </Text>
              </View>
              <Text
                style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}
              >
                ${gym.pricePerMonth}
              </Text>
            </View>
          </View>

          {/* Location details */}
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              Location
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.primary}15`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="map-pin" size={18} color={colors.primary} />
              </View>
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {gym.location}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {gym.city}
                </Text>
              </View>
            </View>
          </View>

          {/* Highlights & Tags */}
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              About
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 16,
              }}
            >
              {gym.highlight}. We have been active in the fitness community for{" "}
              {gym.yearsActive} years, bringing you top-tier equipment and
              dedicated trainers.
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {gym.tags.map((tag) => (
                <View
                  key={tag}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        <GradientButton
          title="Get Membership"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Navigate to checkout or contact
          }}
        />
      </View>
    </View>
  );
}
