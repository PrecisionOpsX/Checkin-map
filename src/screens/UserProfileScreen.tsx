import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkillBadge } from '@/components/SkillBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userService';
import { listUserCheckinHistory } from '@/services/checkinService';
import { follow, isFollowing, unfollow } from '@/services/followService';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import { computeAge, formatRelative } from '@/utils/dates';
import type { Checkin, ProfileStackParamList, UserProfile } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'UserProfile'>;

export function UserProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<Checkin[]>([]);
  const [following, setFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, h] = await Promise.all([
        getUserProfile(userId).catch(() => null),
        listUserCheckinHistory(userId, 10).catch(() => []),
      ]);
      setProfile(p);
      setHistory(h);
      if (user && user.uid !== userId) {
        try {
          const f = await isFollowing(user.uid, userId);
          setFollowing(f);
        } catch (e) {
          console.warn('Failed to check follow status', e);
        }
      }
    } catch (e) {
      console.warn('Failed to load user profile', e);
    } finally {
      setLoading(false);
    }
  }, [userId, user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const toggleFollow = async () => {
    if (!user || !profile) return;
    setBusy(true);
    try {
      if (following) {
        await unfollow(user.uid, profile.uid);
        setFollowing(false);
        setProfile({
          ...profile,
          followersCount: Math.max(0, profile.followersCount - 1),
        });
      } else {
        await follow(user.uid, profile.uid);
        setFollowing(true);
        setProfile({
          ...profile,
          followersCount: profile.followersCount + 1,
        });
      }
      await refreshProfile();
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />
        <View style={styles.loader}>
          <Text style={styles.muted}>User not found.</Text>
        </View>
      </View>
    );
  }

  const isSelf = user?.uid === profile.uid;
  const age = computeAge(profile.birthday);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
              (navigation as any).navigate('FollowList', {
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
              (navigation as any).navigate('FollowList', {
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

        {history.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Recent check-ins</Text>
            <View style={styles.card}>
              {history.map((c, i) => (
                <Pressable
                  key={c.id}
                  onPress={() =>
                    (navigation as any).navigate('LocationDetail', {
                      locationId: c.locationId,
                    })
                  }
                  style={[
                    styles.checkinRow,
                    i !== history.length - 1 && styles.checkinRowBorder,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.checkinName}>{c.locationName}</Text>
                    <Text style={styles.checkinTime}>
                      {formatRelative(c.checkedInAt)}
                    </Text>
                  </View>
                  {c.checkedOutAt == null ? <View style={styles.liveDot} /> : null}
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {!isSelf ? (
          <View style={styles.actions}>
            <Button
              label={following ? 'Following' : 'Follow'}
              onPress={toggleFollow}
              loading={busy}
              variant={following ? 'secondary' : 'primary'}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  identity: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
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
  skillRow: { marginTop: theme.spacing.sm },
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
  muted: { color: theme.colors.textMuted },
});
