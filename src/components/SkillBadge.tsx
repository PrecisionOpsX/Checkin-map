import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';
import { SkillLevel, skillLevelLabel } from '@/types';

interface SkillBadgeProps {
  value: SkillLevel | null;
  short?: boolean;
}

export function SkillBadge({ value, short }: SkillBadgeProps) {
  const label = skillLevelLabel(value);
  if (!label) return null;
  const text = short
    ? label.length > 14
      ? label.split(' ').slice(0, 2).join(' ')
      : label
    : label;
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    fontSize: theme.font.tiny,
    color: theme.colors.text,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
