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
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userService';
import { follow, isFollowing, unfollow } from '@/services/followService';
import { theme } from '@/theme';
import type { ProfileStackParamList, UserProfile } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'UserProfile'>;

export function UserProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const p = await getUserProfile(userId);
    setProfile(p);
    if (user && user.uid !== userId) {
      const f = await isFollowing(user.uid, userId);
      setFollowing(f);
    }
    setLoading(false);
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
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loader}>
        <Text style={styles.muted}>User not found.</Text>
      </View>
    );
  }

  const isSelf = user?.uid === profile.uid;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar uri={profile.photoURL} name={profile.displayName} size={96} />
        <Text style={styles.name}>{profile.displayName}</Text>
        {profile.location ? (
          <Text style={styles.location}>{profile.location}</Text>
        ) : null}
      </View>

      <View style={styles.statsRow}>
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
      </View>

      {profile.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
      ) : null}

      {!isSelf ? (
        <Button
          label={following ? 'Unfollow' : 'Follow'}
          onPress={toggleFollow}
          loading={busy}
          variant={following ? 'secondary' : 'primary'}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : null}
    </ScrollView>
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
  content: { padding: theme.spacing.lg },
  header: { alignItems: 'center' },
  name: {
    fontSize: theme.font.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  location: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: theme.colors.border },
  statNumber: {
    fontSize: theme.font.heading,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  section: { marginTop: theme.spacing.lg },
  sectionTitle: {
    fontSize: theme.font.small,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  bio: {
    fontSize: theme.font.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  muted: { color: theme.colors.textMuted },
});
