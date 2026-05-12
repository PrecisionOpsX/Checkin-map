export const theme = {
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    background: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    text: '#111827',
    textMuted: '#6b7280',
    danger: '#dc2626',
    success: '#16a34a',
    inputBg: '#f3f4f6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 999,
  },
  font: {
    title: 24,
    heading: 20,
    body: 16,
    small: 14,
    tiny: 12,
  },
};

export type Theme = typeof theme;
