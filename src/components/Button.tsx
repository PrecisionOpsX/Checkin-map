import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'md' | 'lg';
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  size = 'md',
  style,
}: ButtonProps) {
  const palette = variantStyles(variant);
  const height = size === 'lg' ? 52 : 46;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        {
          height,
          backgroundColor: palette.bg,
          borderWidth: palette.borderWidth,
          borderColor: palette.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

function variantStyles(variant: ButtonProps['variant']) {
  switch (variant) {
    case 'secondary':
      return {
        bg: theme.colors.surface,
        fg: theme.colors.text,
        border: theme.colors.border,
        borderWidth: 1,
      };
    case 'danger':
      return {
        bg: theme.colors.danger,
        fg: '#ffffff',
        border: 'transparent',
        borderWidth: 0,
      };
    case 'ghost':
      return {
        bg: 'transparent',
        fg: theme.colors.textMuted,
        border: 'transparent',
        borderWidth: 0,
      };
    case 'primary':
    default:
      return {
        bg: theme.colors.primary,
        fg: '#ffffff',
        border: 'transparent',
        borderWidth: 0,
      };
  }
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  label: {
    fontSize: theme.font.body,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
