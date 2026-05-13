import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Logo, LogoVariant } from '@/components/logos/Logo';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import type { ProfileStackParamList } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'LogoGallery'>;

interface Option {
  variant: LogoVariant;
  name: string;
  tagline: string;
}

const OPTIONS: Option[] = [
  { variant: 'mark', name: 'Mark', tagline: 'Modern teardrop pin. Universal map-app reading.' },
  { variant: 'drop', name: 'Drop', tagline: 'Speech-bubble pin. Hints at people checking in.' },
  { variant: 'pulse', name: 'Pulse', tagline: 'Concentric rings. Live, dynamic, real-time.' },
  { variant: 'frame', name: 'Frame', tagline: 'Reticle brackets. Precise, technical, premium.' },
  { variant: 'compass', name: 'Compass', tagline: 'Diamond + needle. Navigational, outdoor.' },
];

export function LogoGalleryScreen({ navigation }: Props) {
  const [bgMode, setBgMode] = useState<'plain' | 'tile' | 'dark'>('plain');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Logo options" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Five candidates. Pick one and tell me the name. The chosen mark becomes the
          app icon and the splash screen.
        </Text>

        <View style={styles.toggleRow}>
          {(['plain', 'tile', 'dark'] as const).map((m) => (
            <Text
              key={m}
              onPress={() => setBgMode(m)}
              style={[
                styles.toggle,
                bgMode === m && styles.toggleActive,
              ]}
            >
              {m === 'plain' ? 'Flat' : m === 'tile' ? 'App icon' : 'Inverse'}
            </Text>
          ))}
        </View>

        {OPTIONS.map((opt) => (
          <View key={opt.variant} style={styles.card}>
            <View
              style={[
                styles.logoBox,
                bgMode === 'dark' && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Logo
                variant={opt.variant}
                size={96}
                color={bgMode === 'dark' ? '#ffffff' : theme.colors.primary}
                background={bgMode === 'tile' ? 'tile' : 'transparent'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{opt.name}</Text>
              <Text style={styles.tag}>{opt.tagline}</Text>
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bonus: each works as a wordmark too. Imagine the chosen mark next to
            <Text style={{ fontWeight: '700' }}> CheckInMap</Text> in a horizontal
            row on the splash screen.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  intro: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.pill,
    padding: 4,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.lg,
    gap: 4,
  },
  toggle: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    fontSize: theme.font.tiny,
    fontWeight: '600',
    color: theme.colors.textMuted,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  toggleActive: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: theme.font.heading,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  tag: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    lineHeight: 19,
  },
  footer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
  },
  footerText: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    lineHeight: 17,
  },
});
