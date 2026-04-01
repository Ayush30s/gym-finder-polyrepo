// app/(tabs)/profile.tsx
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// ─── Form Field Component ─────────────────────────────────────────
function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  numberOfLines,
  keyboardType,
  icon,
  colors,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: any;
  icon?: keyof typeof Feather.glyphMap;
  colors: ReturnType<typeof useTheme>["colors"];
  editable?: boolean;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.5,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: editable ? colors.border : `${colors.border}80`,
          paddingHorizontal: 14,
          minHeight: multiline ? 80 : 50,
        }}
      >
        {icon && (
          <Feather
            name={icon}
            size={18}
            color={colors.textMuted}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 15,
            paddingVertical: multiline ? 12 : 0,
            textAlignVertical: multiline ? "top" : "center",
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );
}

// ─── Section Header ──────────────────────────────────────────────
function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <View style={{ marginTop: 24, marginBottom: 16 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          width: 40,
          height: 3,
          backgroundColor: colors.primary,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

// ─── Info Card ────────────────────────────────────────────────────
function InfoCard({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  colors: any;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${colors.primary}15`,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: 15,
            fontWeight: "500",
            marginTop: 2,
          }}
        >
          {value || "Not set"}
        </Text>
      </View>
    </View>
  );
}

// ─── Main Profile Screen ──────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme, mode } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImageUrl: "",
    // Profile fields
    gender: "",
    dob: new Date(),
    heightCm: "",
    weightKg: "",
    address: "",
    bio: "",
    contact_no: "",
    // Address fields
    state: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user || profileData) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        profileImageUrl:
          user?.profileImageUrl || profileData?.profileImageUrl || "",
        gender: profileData?.gender || "",
        dob: profileData?.dob ? new Date(profileData.dob) : new Date(),
        heightCm: profileData?.heightCm?.toString() || "",
        weightKg: profileData?.weightKg?.toString() || "",
        address: profileData?.address || "",
        bio: profileData?.bio || "",
        contact_no: profileData?.contact_no || "",
        state: profileData?.user?.address?.state || "",
        city: profileData?.user?.address?.city || "",
        pincode: profileData?.user?.address?.pincode || "",
      });
    }
  }, [user, profileData]);

  const handleUpdate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const updateData = {
      name: formData.name,
      profileImageUrl: formData.profileImageUrl,
      profile: {
        gender: formData.gender,
        dob: formData.dob,
        heightCm: parseInt(formData.heightCm) || 0,
        weightKg: parseInt(formData.weightKg) || 0,
        address: formData.address,
        bio: formData.bio,
        contact_no: formData.contact_no,
      },
      address: {
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
      },
    };

    try {
      await updateProfile.mutateAsync(updateData);
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleImagePick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadingImage(true);
      try {
        // Here you would upload the image to your server/CDN
        // For now, we'll just set the local URI
        setFormData({ ...formData, profileImageUrl: result.assets[0].uri });
      } catch (error) {
        Alert.alert("Error", "Failed to upload image.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const themeIcon = mode === "system" ? "⚙️" : isDark ? "🌙" : "☀️";

  if (profileLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textMuted, marginTop: 12 }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
        }}
      >
        {/* Header */}
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
            <Text
              style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}
            >
              My Profile
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

            {isAuthenticated && (
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/discover")}
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
                  <Feather name="search" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero Section with Avatar */}
        <LinearGradient
          colors={[`${colors.primary}18`, colors.background]}
          style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 }}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={isEditing ? handleImagePick : undefined}
              disabled={!isEditing || uploadingImage}
              style={{ position: "relative" }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.card,
                  borderWidth: 3,
                  borderColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {formData.profileImageUrl ? (
                  <Image
                    source={{ uri: formData.profileImageUrl }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text style={{ fontSize: 40, color: colors.primary }}>
                    {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </Text>
                )}
                {uploadingImage && (
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
              </View>
              {isEditing && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: colors.primary,
                    borderRadius: 20,
                    padding: 8,
                  }}
                >
                  <Feather name="camera" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <Text
              style={{
                color: colors.text,
                fontSize: 22,
                fontWeight: "800",
                marginTop: 12,
              }}
            >
              {formData.name || "Your Name"}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {formData.email}
            </Text>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            paddingHorizontal: 16,
            marginBottom: 24,
          }}
        >
          {!isEditing ? (
            <>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={logout}
                style={{
                  flex: 1,
                  backgroundColor: colors.error + "20",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.error,
                }}
              >
                <Text style={{ color: colors.error, fontWeight: "600" }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{ color: colors.textSecondary, fontWeight: "600" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                disabled={updateProfile.isPending}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                {updateProfile.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Profile Information */}
        <View style={{ paddingHorizontal: 16 }}>
          <SectionHeader title="Basic Information" colors={colors} />

          {isEditing ? (
            <>
              <FormField
                label="Full Name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="Enter your full name"
                icon="user"
                colors={colors}
              />
              <FormField
                label="Email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder="Enter your email"
                icon="mail"
                colors={colors}
                editable={false}
              />
              <FormField
                label="Phone Number"
                value={formData.contact_no}
                onChangeText={(text) =>
                  setFormData({ ...formData, contact_no: text })
                }
                placeholder="Enter your phone number"
                icon="phone"
                keyboardType="phone-pad"
                colors={colors}
              />
            </>
          ) : (
            <>
              <InfoCard
                label="Full Name"
                value={formData.name}
                icon="user"
                colors={colors}
              />
              <InfoCard
                label="Email"
                value={formData.email}
                icon="mail"
                colors={colors}
              />
              <InfoCard
                label="Phone"
                value={formData.contact_no || "Not set"}
                icon="phone"
                colors={colors}
              />
            </>
          )}

          <SectionHeader title="Personal Details" colors={colors} />

          {isEditing ? (
            <>
              <FormField
                label="Gender"
                value={formData.gender}
                onChangeText={(text) =>
                  setFormData({ ...formData, gender: text })
                }
                placeholder="Male/Female/Other"
                icon="users"
                colors={colors}
              />

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  paddingHorizontal: 14,
                  height: 50,
                  marginBottom: 18,
                }}
              >
                <Feather
                  name="calendar"
                  size={18}
                  color={colors.textMuted}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ flex: 1, color: colors.text, fontSize: 15 }}>
                  {formData.dob.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePickerAndroid
                  value={formData.dob}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event: any, selectedDate: any) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFormData({ ...formData, dob: selectedDate });
                    }
                  }}
                />
              )}

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FormField
                    label="Height (cm)"
                    value={formData.heightCm}
                    onChangeText={(text) =>
                      setFormData({ ...formData, heightCm: text })
                    }
                    placeholder="cm"
                    keyboardType="numeric"
                    colors={colors}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormField
                    label="Weight (kg)"
                    value={formData.weightKg}
                    onChangeText={(text) =>
                      setFormData({ ...formData, weightKg: text })
                    }
                    placeholder="kg"
                    keyboardType="numeric"
                    colors={colors}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <InfoCard
                label="Gender"
                value={formData.gender || "Not set"}
                icon="users"
                colors={colors}
              />
              <InfoCard
                label="Date of Birth"
                value={formData.dob.toLocaleDateString()}
                icon="calendar"
                colors={colors}
              />
              <InfoCard
                label="Height"
                value={
                  formData.heightCm ? `${formData.heightCm} cm` : "Not set"
                }
                icon="activity"
                colors={colors}
              />
              <InfoCard
                label="Weight"
                value={
                  formData.weightKg ? `${formData.weightKg} kg` : "Not set"
                }
                icon="activity"
                colors={colors}
              />
            </>
          )}

          <SectionHeader title="Address Information" colors={colors} />

          {isEditing ? (
            <>
              <FormField
                label="Street Address"
                value={formData.address}
                onChangeText={(text) =>
                  setFormData({ ...formData, address: text })
                }
                placeholder="Enter your street address"
                icon="map-pin"
                colors={colors}
              />
              <FormField
                label="City"
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                placeholder="Enter your city"
                colors={colors}
              />
              <FormField
                label="State"
                value={formData.state}
                onChangeText={(text) =>
                  setFormData({ ...formData, state: text })
                }
                placeholder="Enter your state"
                colors={colors}
              />
              <FormField
                label="Pincode"
                value={formData.pincode}
                onChangeText={(text) =>
                  setFormData({ ...formData, pincode: text })
                }
                placeholder="Enter pincode"
                keyboardType="numeric"
                colors={colors}
              />
            </>
          ) : (
            <>
              <InfoCard
                label="Address"
                value={formData.address || "Not set"}
                icon="home"
                colors={colors}
              />
              <InfoCard
                label="City"
                value={formData.city || "Not set"}
                icon="map"
                colors={colors}
              />
              <InfoCard
                label="State"
                value={formData.state || "Not set"}
                icon="map"
                colors={colors}
              />
              <InfoCard
                label="Pincode"
                value={formData.pincode || "Not set"}
                icon="mail"
                colors={colors}
              />
            </>
          )}

          <SectionHeader title="Bio" colors={colors} />

          {isEditing ? (
            <FormField
              label="About Me"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              placeholder="Tell us about yourself..."
              icon="file-text"
              multiline
              numberOfLines={4}
              colors={colors}
            />
          ) : (
            <InfoCard
              label="Bio"
              value={formData.bio || "No bio added yet"}
              icon="file-text"
              colors={colors}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
