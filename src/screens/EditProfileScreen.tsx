import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/userService';
import {
  STORAGE_NOT_CONFIGURED,
  isStorageConfigured,
  uploadAvatar,
} from '@/services/storageService';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import { SKILL_LEVELS, SkillLevel } from '@/types';
import { computeAge } from '@/utils/dates';
import type { ProfileStackParamList } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [photoURL, setPhotoURL] = useState<string | null>(profile?.photoURL ?? null);
  const [birthday, setBirthday] = useState<string | null>(profile?.birthday ?? null);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(
    profile?.skillLevel ?? null
  );
  const [errors, setErrors] = useState<{ birthday?: string; skillLevel?: string }>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const storageEnabled = isStorageConfigured();

  const pickImage = async () => {
    if (!storageEnabled) {
      Alert.alert(
        'Photo upload disabled',
        'Firebase Storage is not configured for this build.'
      );
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to set a profile picture.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;

    if (!user) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(user.uid, result.assets[0].uri);
      setPhotoURL(url);
    } catch (e: any) {
      if (e?.code === STORAGE_NOT_CONFIGURED) {
        Alert.alert(
          'Photo upload disabled',
          'Firebase Storage is not configured for this build.'
        );
      } else {
        Alert.alert('Upload failed', 'Could not upload the image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      Alert.alert('Required', 'Display name cannot be empty.');
      return;
    }

    const nextErrors: typeof errors = {};
    if (!birthday) nextErrors.birthday = 'Required';
    const age = computeAge(birthday);
    if (birthday && (age == null || age < 13)) {
      nextErrors.birthday = 'You must be at least 13.';
    }
    if (!skillLevel) nextErrors.skillLevel = 'Required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        photoURL,
        birthday,
        skillLevel,
      });
      await refreshProfile();
      navigation.goBack();
    } catch {
      Alert.alert('Save failed', 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScreenHeader title="Edit profile" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarBlock}>
          <Avatar uri={photoURL} name={displayName} size={96} />
          {storageEnabled ? (
            <Pressable onPress={pickImage} disabled={uploading} style={styles.avatarBtn}>
              {uploading ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text style={styles.avatarBtnText}>
                  {photoURL ? 'Change photo' : 'Add photo'}
                </Text>
              )}
            </Pressable>
          ) : (
            <Text style={styles.avatarDisabled}>Photo upload disabled</Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>Required</Text>
        <View style={styles.card}>
          <DateField
            label="Birthday"
            placeholder="Select your birthday"
            value={birthday}
            onChange={(v) => {
              setBirthday(v);
              setErrors((e) => ({ ...e, birthday: undefined }));
            }}
            error={errors.birthday}
            minimumYear={1925}
            maximumYear={new Date().getFullYear()}
          />
          <SelectField<SkillLevel>
            label="Skill level"
            placeholder="Pick one"
            value={skillLevel}
            onChange={(v) => {
              setSkillLevel(v);
              setErrors((e) => ({ ...e, skillLevel: undefined }));
            }}
            options={SKILL_LEVELS.map((s) => ({ value: s.value, label: s.label }))}
            error={errors.skillLevel}
          />
        </View>

        <Text style={styles.sectionLabel}>Profile</Text>
        <View style={styles.card}>
          <TextField
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
          />
          <TextField
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell others about yourself"
            multiline
            numberOfLines={4}
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />
          <TextField
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="City, country"
          />
        </View>

        <View style={styles.actions}>
          <Button label="Save changes" onPress={onSave} loading={saving} />
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarBtn: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  avatarBtnText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.font.small,
  },
  avatarDisabled: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSubtle,
    fontSize: theme.font.tiny,
  },
  sectionLabel: {
    fontSize: theme.font.tiny,
    fontWeight: '500',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
});
