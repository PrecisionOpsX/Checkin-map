import React, { useCallback } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import type { ProfileStackParamList } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyProfile'>;

export function MyProfileScreen({ navigation }: Props) {
  const { profile, refreshProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  if (!profile) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

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
          <Text style={styles.email}>{profile.email}</Text>
          {profile.location ? (
            <Text style={styles.location}>{profile.location}</Text>
          ) : null}
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
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
        </View>

        {profile.bio ? (
          <View style={styles.aboutCard}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        ) : (
          <View style={styles.aboutCard}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.bioMuted}>
              No bio yet. Tap edit to add one.
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            label="Edit profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <Button
            label="Sign out"
            variant="secondary"
            onPress={() => signOut()}
            style={{ marginTop: theme.spacing.sm }}
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
  content: {
    paddingHorizontal: theme.spacing.lg,
  },
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
  email: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  location: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
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
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
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
    marginBottom: theme.spacing.sm,
  },
  aboutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  bio: {
    fontSize: theme.font.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bioMuted: {
    fontSize: theme.font.small,
    color: theme.colors.textSubtle,
    lineHeight: 20,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
});
