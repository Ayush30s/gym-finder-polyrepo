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
  isDark: boolean;
};

export const darkTheme: ThemeColors = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  background: "#09090B", // Deep Matte Black
  backgroundSecondary: "#121217", // Section color
  surface: "#18181B", // Input/Surface color
  card: "#27272A", // Workout Card color
  border: "#3F3F46", // Subtle border
  text: "#FAFAFA", // Pure White
  textSecondary: "#A1A1AA", // Gray text
  textMuted: "#52525B", // Darker gray
  success: SUCCESS,
  error: ERROR,
  white: "#FFFFFF",
  black: "#000000",
  isDark: true,
};

export const lightTheme: ThemeColors = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  background: "#F8FAFC", // Clean Off-white
  backgroundSecondary: "#F1F5F9", // Grayish background
  surface: "#FFFFFF", // Pure White surface
  card: "#FFFFFF", // White Cards
  border: "#E2E8F0", // Light Border
  text: "#0F172A", // Dark Navy/Slate Text
  textSecondary: "#475569", // Medium Slate
  textMuted: "#94A3B8", // Faded Blue-gray
  success: SUCCESS,
  error: ERROR,
  white: "#FFFFFF",
  black: "#000000",
  isDark: false,
};

export default { darkTheme, lightTheme };
