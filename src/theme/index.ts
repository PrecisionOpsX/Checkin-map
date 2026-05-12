import { Platform } from 'react-native';

/**
 * Restrained, professional palette. Mostly neutrals with a single brand
 * color used for emphasis. No accent shadows, no decorative blobs.
 */
export const theme = {
  colors: {
    // Single brand color used sparingly for emphasis (active states, links).
    primary: '#0f172a', // slate-900
    primaryMuted: '#1e293b', // slate-800

    // Surfaces
    background: '#fafafa',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    surfaceDim: '#f8fafc',

    // Borders, kept thin and quiet
    border: '#e5e7eb',
    borderStrong: '#d1d5db',

    // Text hierarchy
    text: '#0f172a',
    textMuted: '#475569',
    textSubtle: '#94a3b8',
    textOnPrimary: '#ffffff',

    // Status, used only for state
    danger: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',

    // Inputs
    inputBg: '#f3f4f6',
    inputBorder: '#e5e7eb',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    pill: 999,
  },
  font: {
    display: 28,
    title: 22,
    heading: 18,
    body: 16,
    small: 14,
    tiny: 12,
  },
  shadow: {
    sm: Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      default: {},
    }) as object,
    md: Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
      default: {},
    }) as object,
    lg: Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
      default: {},
    }) as object,
  },
};

// Vertical space we reserve below scroll content so the floating tab bar
// never overlaps anything important.
export const TAB_BAR_OVERLAY_SPACE = 100;

export type Theme = typeof theme;
