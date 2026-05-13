import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/logos/Logo';
import { theme } from '@/theme';

/**
 * Small brand lockup: Pulse mark + wordmark side by side. Used on auth
 * screens as a quiet identity anchor.
 */
export function BrandHeader() {
  return (
    <View style={styles.row}>
      <Logo variant="pulse" size={22} color={theme.colors.text} />
      <Text style={styles.wordmark}>CheckInMap</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontSize: theme.font.small,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.1,
  },
});
