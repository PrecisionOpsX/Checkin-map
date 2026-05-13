import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { SkillBadge } from '@/components/SkillBadge';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { listUserCheckinHistory } from '@/services/checkinService';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import { computeAge, formatRelative } from '@/utils/dates';
import type { Checkin, ProfileStackParamList } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyProfile'>;

export function MyProfileScreen({ navigation }: Props) {
  const { profile, refreshProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<Checkin[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await refreshProfile();
    if (profile?.uid) {
      const h = await listUserCheckinHistory(profile.uid, 10);
      setHistory(h);
    }
  }, [profile?.uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!profile) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const age = computeAge(profile.birthday);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + theme.spacing.lg,
            paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Profile</Text>

        <View style={styles.identity}>
          <Avatar uri={profile.photoURL} name={profile.displayName} size={88} />
          <Text style={styles.name}>{profile.displayName}</Text>
          <View style={styles.metaRow}>
            {age != null ? <Text style={styles.meta}>{age} years old</Text> : null}
            {age != null && profile.location ? <Text style={styles.dot}>·</Text> : null}
            {profile.location ? <Text style={styles.meta}>{profile.location}</Text> : null}
          </View>
          <View style={styles.skillRow}>
            <SkillBadge value={profile.skillLevel} />
          </View>
        </View>

        <View style={styles.statsCard}>
          <Pressable
            style={styles.stat}
            onPress={() =>
              navigation.navigate('FollowList', {
                userId: profile.uid,
                mode: 'followers',
              })
            }
          >
            <Text style={styles.statNumber}>{profile.followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <Pressable
            style={styles.stat}
            onPress={() =>
              navigation.navigate('FollowList', {
                userId: profile.uid,
                mode: 'following',
              })
            }
          >
            <Text style={styles.statNumber}>{profile.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{history.length}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
        </View>

        {profile.bio ? (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Recent check-ins</Text>
        <View style={styles.card}>
          {history.length === 0 ? (
            <Text style={styles.empty}>
              No check-ins yet. Find a spot on the map and tap Check in.
            </Text>
          ) : (
            history.map((c, i) => (
              <Pressable
                key={c.id}
                onPress={() =>
                  navigation.navigate('LocationDetail', { locationId: c.locationId })
                }
                style={[
                  styles.checkinRow,
                  i !== history.length - 1 && styles.checkinRowBorder,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkinName}>{c.locationName}</Text>
                  <Text style={styles.checkinTime}>{formatRelative(c.checkedInAt)}</Text>
                </View>
                {c.checkedOutAt == null ? (
                  <View style={styles.liveDot} />
                ) : null}
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.actions}>
          <Button
            label="Edit profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <Button
            label="Choose app logo"
            variant="secondary"
            onPress={() => navigation.navigate('LogoGallery')}
            style={{ marginTop: theme.spacing.sm }}
          />
          <Button
            label="Sign out"
            variant="ghost"
            onPress={() => signOut()}
            style={{ marginTop: theme.spacing.xs }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg },
  eyebrow: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.lg,
  },
  identity: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  name: {
    fontSize: theme.font.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  meta: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
  },
  dot: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginHorizontal: 6,
  },
  skillRow: {
    marginTop: theme.spacing.sm,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: theme.colors.border, marginVertical: 8 },
  statNumber: {
    fontSize: theme.font.heading,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: theme.font.tiny,
    fontWeight: '500',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bio: {
    fontSize: theme.font.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  empty: {
    fontSize: theme.font.small,
    color: theme.colors.textSubtle,
    lineHeight: 20,
    padding: theme.spacing.sm,
  },
  checkinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.xs,
  },
  checkinRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  checkinName: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  checkinTime: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
});
