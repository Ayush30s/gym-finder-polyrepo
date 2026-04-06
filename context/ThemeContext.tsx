import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, ThemeColors } from "@/constants/colors";

type ThemeMode = "system" | "dark" | "light";

interface ThemeContextType {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  isSystem: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = "@gym_app_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isReady, setIsReady] = useState(false);

  // 🔥 Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === "dark" || stored === "light" || stored === "system") {
          setModeState(stored);
        }
      } catch (e) {
        console.log("Theme load error:", e);
      } finally {
        setIsReady(true); // 👈 important (no flicker)
      }
    };

    loadTheme();
  }, []);

  // 🔥 Set mode manually
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(THEME_KEY, newMode);
  }, []);

  // 🔥 Toggle (simple clean UX)
  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  // 🔥 Derived states
  const isSystem = mode === "system";

  const isDark =
    mode === "dark" || (mode === "system" && systemScheme === "dark");

  // 🔥 Memoized colors (performance)
  const colors = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  // ❌ Avoid flicker before loading theme
  if (!isReady) return null;

  return (
    <ThemeContext.Provider
      value={{
        colors,
        mode,
        isDark,
        isSystem,
        setMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
