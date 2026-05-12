import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';

export function HomeScreen() {
  const { profile } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>
          Hi, {profile?.displayName || 'there'}
        </Text>
        <Text style={styles.subtitle}>Welcome to CheckInMap.</Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>Map coming in Milestone 2</Text>
          <Text style={styles.placeholderBody}>
            This is where you will see curated locations near you, with
            GPS-verified check-ins.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, flex: 1 },
  greeting: {
    fontSize: theme.font.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.font.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  placeholder: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholderTitle: {
    fontSize: theme.font.heading,
    fontWeight: '700',
    color: theme.colors.text,
  },
  placeholderBody: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
});
