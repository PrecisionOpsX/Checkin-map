import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '@/theme';

export interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectFieldProps<T> {
  label?: string;
  value: T | null;
  placeholder?: string;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  error?: string;
}

export function SelectField<T extends string>({
  label,
  value,
  placeholder = 'Select an option',
  options,
  onChange,
  error,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          !!error && styles.fieldError,
        ]}
      >
        <Text
          style={[
            styles.value,
            !selected && styles.placeholder,
          ]}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {label ? <Text style={styles.sheetTitle}>{label}</Text> : null}
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <Pressable
                  key={String(opt.value)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
  },
  fieldError: {
    borderColor: theme.colors.danger,
  },
  value: {
    flex: 1,
    fontSize: theme.font.body,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textSubtle,
  },
  caret: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.font.tiny,
    marginTop: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sheetTitle: {
    fontSize: theme.font.tiny,
    fontWeight: '500',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
  },
  optionPressed: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  optionLabel: {
    fontSize: theme.font.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  check: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
