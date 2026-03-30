const PRIMARY = "#FF6B2B";
const PRIMARY_DARK = "#E55A1B";
const SUCCESS = "#22C55E";
const ERROR = "#EF4444";

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
  background: "#0D0D0F",
  backgroundSecondary: "#111118",
  surface: "#1A1A1E",
  card: "#242428",
  border: "#2E2E33",
  text: "#FFFFFF",
  textSecondary: "#9B9BA8",
  textMuted: "#5A5A65",
  success: SUCCESS,
  error: ERROR,
  white: "#FFFFFF",
  black: "#000000",
  isDark: true,
};

export const lightTheme: ThemeColors = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  background: "#F5F5F7",
  backgroundSecondary: "#EBEBEF",
  surface: "#FFFFFF",
  card: "#F0F0F5",
  border: "#E0E0E8",
  text: "#0D0D0F",
  textSecondary: "#4A4A55",
  textMuted: "#9A9AA8",
  success: SUCCESS,
  error: ERROR,
  white: "#FFFFFF",
  black: "#000000",
  isDark: false,
};

export default darkTheme;
