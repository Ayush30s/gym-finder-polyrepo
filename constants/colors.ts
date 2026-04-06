const PRIMARY = "#FF6B2B"; // Main Action Color (Orange)
const PRIMARY_DARK = "#E55A1B"; // Pressed/Dark State
const SUCCESS = "#10B981"; // Emerald Green
const ERROR = "#F43F5E"; // Rose Red

export type ThemeColors = {
  primary: string;
  primaryDark: string;

  background: string;
  backgroundSecondary: string;

  surface: string;
  card: string;

  border: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  success: string;
  error: string;

  white: string;
  black: string;

  // 🔥 NEW GLOBAL COLORS (important)
  overlay: string; // navbar / blur glass
  shadow: string; // shadow color

  isDark: boolean;
};

// 🌙 DARK THEME
export const darkTheme: ThemeColors = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,

  background: "#09090B",
  backgroundSecondary: "#121217",

  surface: "#18181B",
  card: "#27272A",

  border: "#3F3F46",

  text: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textMuted: "#52525B",

  success: SUCCESS,
  error: ERROR,

  white: "#FFFFFF",
  black: "#000000",

  // 🔥 NEW
  overlay: "rgba(15,15,20,0.75)", // glass navbar
  shadow: "#000000",

  isDark: true,
};

// ☀️ LIGHT THEME
export const lightTheme: ThemeColors = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,

  background: "#F8FAFC",
  backgroundSecondary: "#F1F5F9",

  surface: "#FFFFFF",
  card: "#FFFFFF",

  border: "#E2E8F0",

  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",

  success: SUCCESS,
  error: ERROR,

  white: "#FFFFFF",
  black: "#000000",

  // 🔥 NEW
  overlay: "rgba(255,255,255,0.65)", // light glass
  shadow: "#000000",

  isDark: false,
};

export default { darkTheme, lightTheme };
