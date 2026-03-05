import { createContext, useContext } from "react";

export type ThemeName = "proton" | "platform" | "bright" | "stripe" | "instagram" | "zendesk";

export interface ThemeDefinition {
  label: string;
  swatch: string;
}

export const THEMES: Record<ThemeName, ThemeDefinition> = {
  proton: {
    label: "Proton",
    swatch: "#6D4BFF"
  },
  platform: {
    label: "Platform",
    swatch: "#3E63DD"
  },
  bright: {
    label: "Bright",
    swatch: "#0EA5E9"
  },
  stripe: {
    label: "Stripe",
    swatch: "#635BFF"
  },
  instagram: {
    label: "Instagram",
    swatch: "#E1306C"
  },
  zendesk: {
    label: "Zendesk",
    swatch: "#17494D"
  }
};

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "proton",
  setTheme: () => {}
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
