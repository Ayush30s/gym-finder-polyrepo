import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useGyms } from "@/hooks/useGyms";
import { useToggleFavorite } from "@/hooks/useFavorites";
import type { GymDto } from "@/services/gymApi";
import { Fonts, FontSizes, Typography } from "@/constants/fonts";

// Import the Navbar component
// import Navbar from "@/components/Navbar";

// ─── Filter types ─────────────────────────────────────────
type PriceTierFilter = "Any" | "Budget" | "Mid" | "Premium";
type RatingFilter = "Any" | "3+" | "4+" | "4.5+";
type YearsFilter = "Any" | "New" | "Established" | "Veteran";

const PRICE_FILTERS: PriceTierFilter[] = ["Any", "Budget", "Mid", "Premium"];
const RATING_FILTERS: RatingFilter[] = ["Any", "3+", "4+", "4.5+"];
const YEARS_FILTERS: YearsFilter[] = ["Any", "New", "Established", "Veteran"];

// ─── Chip ─────────────────────────────────────────────────
function Chip({ label, active, onPress, colors }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? `${colors.primary}18` : colors.card,
        marginRight: 8,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontFamily: active ? Fonts.bold : Fonts.medium,
          color: active ? colors.primary : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Star rating ──────────────────────────────────────────
function StarRating({ rating, colors }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name="star"
          size={11}
          color={i <= Math.round(rating) ? "#F59E0B" : colors.border}
        />
      ))}
    </View>
  );
}

const PRICE_COLORS: Record<string, string> = {
  Budget: "#22C55E",
  Mid: "#3B82F6",
  Premium: "#8B5CF6",
};

// ─── Gym Card ─────────────────────────────────────────────
function GymCard({ gym, colors, isDark, isAuthenticated }: any) {
  const toggleFav = useToggleFavorite();

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFav.mutate(gym.id);
  };

  return (
    <TouchableOpacity onPress={() => {}} activeOpacity={0.9}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          marginHorizontal: 16,
          marginBottom: 14,
          overflow: "hidden",
          elevation: 4,
        }}
      >
        <LinearGradient
          colors={[`${colors.primary}22`, `${colors.primary}06`]}
          style={{ padding: 16, flexDirection: "row" }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: `${colors.primary}20`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Feather name="zap" size={22} color={colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontFamily: Fonts.bold,
              }}
            >
              {gym.name}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 12,
                fontFamily: Fonts.regular,
              }}
            >
              {gym.location}, {gym.city}
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
              backgroundColor: gym.isOpen ? "#22C55E22" : "#EF444422",
              height: 22,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: Fonts.bold,
                color: gym.isOpen ? "#22C55E" : "#EF4444",
              }}
            >
              {gym.isOpen ? "OPEN" : "CLOSED"}
            </Text>
          </View>
        </LinearGradient>

        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <StarRating rating={gym.rating} colors={colors} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 13,
                  fontFamily: Fonts.bold,
                }}
              >
                {gym.rating.toFixed(1)}
              </Text>
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                fontFamily: Fonts.bold,
              }}
            >
              ${gym.pricePerMonth}/mo
            </Text>
          </View>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              fontFamily: Fonts.regular,
              lineHeight: 18,
            }}
          >
            {gym.highlight}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────
export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceTierFilter>("Any");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("Any");
  const [yearsFilter, setYearsFilter] = useState<YearsFilter>("Any");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const {
    data: gyms = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGyms({
    search: search || undefined,
    priceTier: priceFilter !== "Any" ? priceFilter : undefined,
    minRating: ratingFilter !== "Any" ? ratingFilter : undefined,
  });

  const activeFilterCount = [
    priceFilter !== "Any",
    ratingFilter !== "Any",
    yearsFilter !== "Any",
  ].filter(Boolean).length;

  const ListHeader = (
    <View>
      {/* 1. Integrated Navbar Component */}
      {/* <Navbar /> */}

      {/* 2. Hero Section */}
      <LinearGradient
        colors={[`${colors.primary}18`, colors.background]}
        style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 32,
            fontFamily: Fonts.bold,
            lineHeight: 38,
            marginBottom: 6,
          }}
        >
          Find Your{"\n"}
          <Text style={{ color: colors.primary }}>Perfect Gym</Text>
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 14,
            fontFamily: Fonts.regular,
            marginBottom: 18,
          }}
        >
          Discover top-rated gyms near you — filter by price, rating, and more.
        </Text>

        {/* Search bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: search ? colors.primary : colors.border,
            paddingHorizontal: 14,
            height: 50,
          }}
        >
          <Feather
            name="search"
            size={18}
            color={colors.textMuted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={{
              flex: 1,
              color: colors.text,
              fontSize: 15,
              fontFamily: Fonts.regular,
            }}
            placeholder="Search by name or city..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      {/* Filter toggle */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setFiltersExpanded(!filtersExpanded)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor:
              activeFilterCount > 0 ? `${colors.primary}18` : colors.card,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderWidth: 1.5,
            borderColor: activeFilterCount > 0 ? colors.primary : colors.border,
          }}
        >
          <Feather
            name="sliders"
            size={15}
            color={
              activeFilterCount > 0 ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={{
              color:
                activeFilterCount > 0 ? colors.primary : colors.textSecondary,
              fontFamily: Fonts.semiBold,
              fontSize: 13,
            }}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {filtersExpanded && (
        <View
          style={{
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: Fonts.bold,
              fontSize: 11,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Price Range
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 15 }}
          >
            {PRICE_FILTERS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={priceFilter === p}
                onPress={() => setPriceFilter(p)}
                colors={colors}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={gyms}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <GymCard
            gym={item}
            colors={colors}
            isDark={isDark}
            isAuthenticated={isAuthenticated}
          />
        )}
      />
    </View>
  );
}
