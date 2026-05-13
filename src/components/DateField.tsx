import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { theme } from '@/theme';
import { formatBirthday, fromIsoDate, toIsoDate } from '@/utils/dates';

interface DateFieldProps {
  label?: string;
  value: string | null; // YYYY-MM-DD
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
  minimumYear?: number;
  maximumYear?: number;
}

export function DateField({
  label,
  value,
  placeholder = 'Select a date',
  onChange,
  error,
  minimumYear = 1900,
  maximumYear = new Date().getFullYear(),
}: DateFieldProps) {
  const [open, setOpen] = useState(false);

  const currentDate = value ? fromIsoDate(value) : null;
  const initial = currentDate ?? new Date(2000, 0, 1);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
      if (event.type === 'set' && selected) {
        onChange(toIsoDate(selected));
      }
    } else if (selected) {
      onChange(toIsoDate(selected));
    }
  };

  const display = formatBirthday(value);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, !!error && styles.fieldError]}
      >
        <Text style={[styles.value, !display && styles.placeholder]}>
          {display ?? placeholder}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {Platform.OS === 'android' && open ? (
        <DateTimePicker
          value={initial}
          mode="date"
          display="calendar"
          maximumDate={new Date(maximumYear, 11, 31)}
          minimumDate={new Date(minimumYear, 0, 1)}
          onChange={handleChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          transparent
          visible={open}
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{label ?? 'Pick a date'}</Text>
                <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                  <Text style={styles.done}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={initial}
                mode="date"
                display="spinner"
                maximumDate={new Date(maximumYear, 11, 31)}
                minimumDate={new Date(minimumYear, 0, 1)}
                onChange={handleChange}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
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
  fieldError: { borderColor: theme.colors.danger },
  value: {
    flex: 1,
    fontSize: theme.font.body,
    color: theme.colors.text,
  },
  placeholder: { color: theme.colors.textSubtle },
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  sheetTitle: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  done: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.font.small,
  },
});
