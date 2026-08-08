export const THEME_STORAGE_KEY = "ems-theme";
export const THEME_MODE_STORAGE_KEY = "darkMode";
export const FALLBACK_THEME_MODE = "light";
const LEGACY_THEME_ALIASES = {
  true: "dark",
  false: "light",
};

export const THEME_OPTIONS = [
  {
    value: "light",
    label: "Honeywell Blue (Default)",
    description: "Clean light mode with premium Honeywell blue surfaces",
    swatch: "linear-gradient(135deg, #1679C4 0%, #0E5EA8 100%)",
    dataTheme: "honeywell-blue",
    colorScheme: "light",
  },
  {
    value: "dark-executive",
    label: "Executive Dark Blue (Dark Mode)",
    description: "Premium navy dark mode with refined blue contrast",
    swatch: "linear-gradient(135deg, #0E5EA8 0%, #0B4F91 100%)",
    dataTheme: "executive-dark-blue",
    colorScheme: "dark",
  },
];

const THEME_BY_VALUE = THEME_OPTIONS.reduce((accumulator, option) => {
  accumulator[option.value] = option;
  return accumulator;
}, {});

export const normalizeThemeMode = (mode) =>
  Object.prototype.hasOwnProperty.call(
    THEME_BY_VALUE,
    LEGACY_THEME_ALIASES[mode] || mode
  )
    ? LEGACY_THEME_ALIASES[mode] || mode
    : FALLBACK_THEME_MODE;

export const getThemeDetails = (themeMode = FALLBACK_THEME_MODE) =>
  THEME_BY_VALUE[normalizeThemeMode(themeMode)] || THEME_BY_VALUE.light;

export const getStoredThemeMode = () => {
  if (typeof window === "undefined") {
    return FALLBACK_THEME_MODE;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme) {
    return normalizeThemeMode(storedTheme);
  }

  const legacyMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  return normalizeThemeMode(legacyMode);
};

export const applyTheme = (themeMode = FALLBACK_THEME_MODE) => {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedMode = normalizeThemeMode(themeMode);
  const themeDetails = getThemeDetails(resolvedMode);

  document.documentElement.setAttribute("data-theme", themeDetails.dataTheme);
  document.documentElement.setAttribute(
    "data-theme-mode",
    themeDetails.colorScheme
  );
  document.documentElement.style.colorScheme = themeDetails.colorScheme;
};
