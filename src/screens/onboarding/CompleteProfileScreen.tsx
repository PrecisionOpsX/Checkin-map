import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { SelectField } from '@/components/SelectField';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { updateUserProfile } from '@/services/userService';
import { theme } from '@/theme';
import { SKILL_LEVELS, SkillLevel } from '@/types';
import { computeAge } from '@/utils/dates';

export function CompleteProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, refreshProfile } = useAuth();
  const [birthday, setBirthday] = useState<string | null>(profile?.birthday ?? null);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(
    profile?.skillLevel ?? null
  );
  const [errors, setErrors] = useState<{ birthday?: string; skillLevel?: string }>({});
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    const nextErrors: typeof errors = {};
    if (!birthday) nextErrors.birthday = 'Required';
    const age = computeAge(birthday);
    if (birthday && (age == null || age < 13)) {
      nextErrors.birthday = 'You must be at least 13.';
    }
    if (!skillLevel) nextErrors.skillLevel = 'Required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, { birthday, skillLevel });
      await refreshProfile();
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + theme.spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>One more step</Text>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          We need two things before you can check in to places.
        </Text>

        <View style={{ height: theme.spacing.xl }} />

        <View style={styles.card}>
          <DateField
            label="Birthday"
            placeholder="Select your birthday"
            value={birthday}
            onChange={setBirthday}
            error={errors.birthday}
            minimumYear={1925}
            maximumYear={new Date().getFullYear()}
          />
          <SelectField<SkillLevel>
            label="Skill level"
            placeholder="Pick one"
            value={skillLevel}
            onChange={(v) => setSkillLevel(v)}
            options={SKILL_LEVELS.map((s) => ({ value: s.value, label: s.label }))}
            error={errors.skillLevel}
          />
        </View>

        <Text style={styles.note}>
          Your age and skill level appear on your profile. You can change skill level
          later from Edit profile.
        </Text>

        <View style={styles.actions}>
          <Button label="Continue" onPress={onSave} loading={saving} size="lg" />
          <Button
            label="Sign out"
            variant="ghost"
            onPress={() => signOut()}
            style={{ marginTop: theme.spacing.xs }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  eyebrow: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: theme.font.display,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  note: {
    marginTop: theme.spacing.md,
    fontSize: theme.font.tiny,
    color: theme.colors.textSubtle,
    lineHeight: 17,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
});
