import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";


// const theme = {
//   dark: {
//     bg: "#0F172A",
//     surface: "#1E293B",
//     surfaceAlt: "#263548",
//     border: "#334155",
//     textPrimary: "#F1F5F9",
//     textSecondary: "#94A3B8",
//     textMuted: "#64748B",
//     textFilter: "#CBD5E1",
//     inputBg: "#1E293B",
//     navActive: "#1E3A2F",
//     avatarBg: "#1E3A2F",
//     accent: "#38A169",
//     accentHover: "#2F9259",
//     btnVerBorder: "#38A169",
//   },
//   light: {
//     bg: "#F8FAFC",
//     surface: "#FFFFFF",
//     surfaceAlt: "#F1F5F9",
//     border: "#E2E8F0",
//     textPrimary: "#1E293B",
//     textSecondary: "#475569",
//     textMuted: "#94A3B8",
//     textFilter: "#475569",
//     inputBg: "#FFFFFF",
//     navActive: "#E8F5E9",
//     avatarBg: "#E8F5E9",
//     accent: "#38A169",
//     accentHover: "#2F9259",
//     btnVerBorder: "#38A169",
//   },
// } as const;

const darkTheme = {
  bg: "#0F172A",
  surface: "#1E293B",
  surfaceAlt: "#263548",
  border: "#334155",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textFilter: "#CBD5E1",
  inputBg: "#1E293B",
  navActive: "#1E3A2F",
  avatarBg: "#1E3A2F",
  accent: "#38A169",
  accentHover: "#2F9259",
  btnVerBorder: "#38A169",
} as const;

const lightTheme = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  border: "#E2E8F0",
  textPrimary: "#1E293B",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textFilter: "#475569",
  inputBg: "#FFFFFF",
  navActive: "#E8F5E9",
  avatarBg: "#E8F5E9",
  accent: "#38A169",
  accentHover: "#2F9259",
  btnVerBorder: "#38A169",
} as const;

type Theme = typeof darkTheme | typeof lightTheme;

export interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  disabledTheme: () => void;
  colors: Theme;
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("adqpal_theme");
    return saved !== null ? saved === "dark" : false;
  });

  // Aplica/remove classe "dark" no <html> — ativa dark: do Tailwind v4
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("adqpal_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const disabledTheme = () => setIsDark(false);

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, colors, disabledTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
