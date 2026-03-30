import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
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
import { GYMS } from "@/data/gyms";

// ─── Filter types ─────────────────────────────────────────
type PriceTierFilter = "Any" | "Budget" | "Mid" | "Premium";
type RatingFilter = "Any" | "3+" | "4+" | "4.5+";
type YearsFilter = "Any" | "New" | "Established" | "Veteran";

const PRICE_FILTERS: PriceTierFilter[] = ["Any", "Budget", "Mid", "Premium"];
const RATING_FILTERS: RatingFilter[] = ["Any", "3+", "4+", "4.5+"];
const YEARS_FILTERS: YearsFilter[] = ["Any", "New", "Established", "Veteran"];

// ─── Chip ─────────────────────────────────────────────────
function Chip({
  label,
  active,
  onPress,
  colors,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
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
          fontWeight: active ? "700" : "500",
          color: active ? colors.primary : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Star rating ──────────────────────────────────────────
function StarRating({
  rating,
  colors,
}: {
  rating: number;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
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

// ─── Price badge colours ───────────────────────────────────
const PRICE_COLORS: Record<string, string> = {
  Budget: "#22C55E",
  Mid: "#3B82F6",
  Premium: "#8B5CF6",
};

// ─── Gym Card ─────────────────────────────────────────────
function GymCard({
  gym,
  colors,
  isDark,
  isAuthenticated,
}: {
  gym: GymDto;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
  isAuthenticated: boolean;
}) {
  const toggleFav = useToggleFavorite();

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFav.mutate(gym.id);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: 16,
        marginBottom: 14,
        overflow: "hidden",
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.25 : 0.07,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Card header strip */}
      <LinearGradient
        colors={[`${colors.primary}22`, `${colors.primary}06`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        {/* Gym icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: `${colors.primary}20`,
            borderWidth: 1.5,
            borderColor: `${colors.primary}40`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Feather name="zap" size={22} color={colors.primary} />
        </View>

        {/* Name + location */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 3,
            }}
            numberOfLines={1}
          >
            {gym.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="map-pin" size={11} color={colors.textMuted} />
            <Text
              style={{ color: colors.textMuted, fontSize: 12 }}
              numberOfLines={1}
            >
              {gym.location}, {gym.city}
            </Text>
          </View>
        </View>

        {/* Right: Open badge + Favorite */}
        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
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
              {gym.isOpen ? "OPEN" : "CLOSED"}
            </Text>
          </View>

          {isAuthenticated && (
            <TouchableOpacity
              onPress={handleFavorite}
              disabled={toggleFav.isPending}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: gym.isFavorited ? "#EF444420" : colors.card,
                borderWidth: 1,
                borderColor: gym.isFavorited ? "#EF4444" : colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                name="heart"
                size={15}
                color={gym.isFavorited ? "#EF4444" : colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Card body */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
        {/* Rating row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <StarRating rating={gym.rating} colors={colors} />
            <Text
              style={{ color: colors.text, fontSize: 13, fontWeight: "700" }}
            >
              {gym.rating.toFixed(1)}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              ({gym.reviewCount} reviews)
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="navigation" size={11} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {gym.distance}
            </Text>
          </View>
        </View>

        {/* Highlight */}
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            lineHeight: 18,
            marginBottom: 12,
          }}
        >
          {gym.highlight}
        </Text>

        {/* Footer: tags + price */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}
          >
            {gym.tags.slice(0, 2).map((tag) => (
              <View
                key={tag}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 11,
                    fontWeight: "500",
                  }}
                >
                  {tag}
                </Text>
              </View>
            ))}
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 11,
                  fontWeight: "500",
                }}
              >
                {gym.yearsActive}yr{gym.yearsActive !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end", marginLeft: 8 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: `${PRICE_COLORS[gym.priceTier] ?? "#888"}18`,
                borderWidth: 1,
                borderColor: `${PRICE_COLORS[gym.priceTier] ?? "#888"}40`,
              }}
            >
              <Text
                style={{
                  color: PRICE_COLORS[gym.priceTier] ?? "#888",
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {gym.priceTier}
              </Text>
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 13,
                fontWeight: "700",
                marginTop: 3,
              }}
            >
              ${gym.pricePerMonth}/mo
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────
export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme, mode } = useTheme();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceTierFilter>("Any");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("Any");
  const [yearsFilter, setYearsFilter] = useState<YearsFilter>("Any");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      priceTier: priceFilter !== "Any" ? priceFilter : undefined,
      minRating: ratingFilter !== "Any" ? ratingFilter : undefined,
      yearsCategory: yearsFilter !== "Any" ? yearsFilter : undefined,
    }),
    [search, priceFilter, ratingFilter, yearsFilter],
  );

  const {
    data: gyms = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGyms(filters);

  const themeIcon = mode === "system" ? "⚙️" : isDark ? "🌙" : "☀️";
  const activeFilterCount = [
    priceFilter !== "Any",
    ratingFilter !== "Any",
    yearsFilter !== "Any",
  ].filter(Boolean).length;

  function resetFilters() {
    setPriceFilter("Any");
    setRatingFilter("Any");
    setYearsFilter("Any");
    setSearch("");
    Haptics.selectionAsync();
  }

  // ── List header ────────────────────────────────────────
  const ListHeader = (
    <View>
      {/* Top nav */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "web" ? 20 : insets.top + 12,
          paddingBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
              G
            </Text>
          </LinearGradient>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>
            GymApp
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={toggleTheme}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 14 }}>{themeIcon}</Text>
            </View>
          </TouchableOpacity>

          {!authLoading &&
            (isAuthenticated ? (
              <TouchableOpacity
                onPress={() => router.push("/(tabs)")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}
                  >
                    {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Link href="/(auth)/signin" asChild>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: colors.primary,
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity activeOpacity={0.8}>
                    <LinearGradient
                      colors={[colors.primary, colors.primaryDark]}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: "600",
                        }}
                      >
                        Join Free
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </View>
            ))}
        </View>
      </View>

      {/* Hero */}
      <LinearGradient
        colors={[`${colors.primary}18`, colors.background]}
        style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "800",
            letterSpacing: -0.5,
            lineHeight: 36,
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
            lineHeight: 20,
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
            style={{ flex: 1, color: colors.text, fontSize: 15 }}
            placeholder="Search by name or city..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="words"
            returnKeyType="search"
          />
          {isFetching && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ marginLeft: 8 }}
            />
          )}
          {search.length > 0 && !isFetching && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Filter toggle */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setFiltersExpanded((v) => !v);
            Haptics.selectionAsync();
          }}
          activeOpacity={0.8}
        >
          <View
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
              borderColor:
                activeFilterCount > 0 ? colors.primary : colors.border,
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
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Text>
            <Feather
              name={filtersExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={activeFilterCount > 0 ? colors.primary : colors.textMuted}
            />
          </View>
        </TouchableOpacity>

        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={resetFilters} activeOpacity={0.7}>
            <Text
              style={{ color: colors.error, fontSize: 13, fontWeight: "600" }}
            >
              Reset all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter panel */}
      {filtersExpanded && (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 18,
            marginHorizontal: 16,
            marginBottom: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 0.8,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Price Range
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 18 }}
          >
            {PRICE_FILTERS.map((p) => (
              <Chip
                key={p}
                label={
                  p === "Any"
                    ? "Any Price"
                    : p === "Budget"
                      ? "💰 Budget"
                      : p === "Mid"
                        ? "💳 Mid"
                        : "💎 Premium"
                }
                active={priceFilter === p}
                onPress={() => {
                  setPriceFilter(p);
                  Haptics.selectionAsync();
                }}
                colors={colors}
              />
            ))}
          </ScrollView>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 0.8,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Minimum Rating
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 18 }}
          >
            {RATING_FILTERS.map((r) => (
              <Chip
                key={r}
                label={r === "Any" ? "Any Rating" : `⭐ ${r}`}
                active={ratingFilter === r}
                onPress={() => {
                  setRatingFilter(r);
                  Haptics.selectionAsync();
                }}
                colors={colors}
              />
            ))}
          </ScrollView>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 0.8,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            Gym Age
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {YEARS_FILTERS.map((y) => (
              <Chip
                key={y}
                label={
                  y === "Any"
                    ? "Any Age"
                    : y === "New"
                      ? "🆕 New (≤3 yrs)"
                      : y === "Established"
                        ? "🏋️ Established (4–10 yrs)"
                        : "🏆 Veteran (10+ yrs)"
                }
                active={yearsFilter === y}
                onPress={() => {
                  setYearsFilter(y);
                  Haptics.selectionAsync();
                }}
                colors={colors}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: "700" }}>
          {isLoading
            ? "Loading…"
            : `${gyms.length} gym${gyms.length !== 1 ? "s" : ""} found`}
        </Text>
        {isAuthenticated && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="heart" size={13} color={colors.primary} />
            <Text
              style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}
            >
              Tap ♥ to save
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // ── Empty / error / loading ────────────────────────────
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {ListHeader}
        <View style={{ alignItems: "center", paddingTop: 48 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{ color: colors.textMuted, marginTop: 12, fontSize: 14 }}
          >
            Fetching gyms…
          </Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {ListHeader}
        <View
          style={{
            alignItems: "center",
            paddingTop: 48,
            paddingHorizontal: 24,
          }}
        >
          <Feather name="wifi-off" size={40} color={colors.textMuted} />
          <Text
            style={{
              color: colors.text,
              fontSize: 17,
              fontWeight: "700",
              marginTop: 16,
              marginBottom: 6,
            }}
          >
            Could not load gyms
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: colors.primary,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const ListEmpty = (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 48,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Feather name="search" size={28} color={colors.textMuted} />
      </View>
      <Text
        style={{
          color: colors.text,
          fontSize: 17,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        No gyms found
      </Text>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 20,
          marginBottom: 20,
        }}
      >
        Try adjusting your filters or search for a different city.
      </Text>
      <TouchableOpacity
        onPress={resetFilters}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: colors.primary,
        }}
      >
        <Text
          style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}
        >
          Clear filters
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={gyms}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
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
