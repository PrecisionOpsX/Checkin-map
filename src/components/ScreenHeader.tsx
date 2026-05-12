import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { theme } from '@/theme';

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
}

export function ScreenHeader({
  title,
  onBack,
  rightLabel,
  onRightPress,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: insets.top + theme.spacing.sm },
      ]}
    >
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn}>
            <Icon name="chevron-left" size={20} color={theme.colors.text} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.center}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
        {rightLabel ? (
          <Pressable onPress={onRightPress} hitSlop={12} style={styles.right}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: { width: 36 },
  center: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  right: {
    paddingHorizontal: theme.spacing.sm,
  },
  rightLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.font.small,
  },
});
