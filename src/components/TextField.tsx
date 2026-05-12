import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '@/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextField({ label, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          !!error && styles.inputWrapError,
        ]}
      >
        <TextInput
          placeholderTextColor={theme.colors.textSubtle}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputWrap: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputWrapFocused: {
    borderColor: theme.colors.primary,
  },
  inputWrapError: {
    borderColor: theme.colors.danger,
  },
  input: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: theme.font.body,
    color: theme.colors.text,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.font.tiny,
    marginTop: 6,
  },
});
