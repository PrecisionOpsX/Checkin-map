import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getUserProfile } from '@/services/userService';
import { listFollowers, listFollowing } from '@/services/followService';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import type { ProfileStackParamList, UserProfile } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'FollowList'>;

export function FollowListScreen({ route, navigation }: Props) {
  const { userId, mode } = route.params;
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const ids =
        mode === 'followers'
          ? await listFollowers(userId)
          : await listFollowing(userId);
      const results = await Promise.all(ids.map((id) => getUserProfile(id)));
      setProfiles(results.filter((p): p is UserProfile => p !== null));
    } catch (e) {
      console.warn('Failed to load follow list', e);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [userId, mode]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === 'followers' ? 'Followers' : 'Following'}
        onBack={() => navigation.goBack()}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.content,
            { paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg },
          ]}
          data={profiles}
          keyExtractor={(item) => item.uid}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {mode === 'followers' ? 'No followers yet' : 'Not following anyone'}
              </Text>
              <Text style={styles.emptyBody}>
                {mode === 'followers'
                  ? 'Invite friends so they can follow you.'
                  : 'Head to Discover to find people to follow.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: theme.colors.surfaceAlt },
              ]}
              onPress={() =>
                navigation.push('UserProfile', { userId: item.uid })
              }
            >
              <Avatar uri={item.photoURL} name={item.displayName} size={44} />
              <View style={styles.rowText}>
                <Text style={styles.name}>{item.displayName}</Text>
                {item.location ? (
                  <Text style={styles.sub}>{item.location}</Text>
                ) : (
                  <Text style={styles.sub}>{item.followersCount} followers</Text>
                )}
              </View>
              <Icon name="chevron-right" size={18} color={theme.colors.textSubtle} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  sep: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
    marginLeft: 60,
  },
  rowText: { marginLeft: theme.spacing.md, flex: 1 },
  name: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sub: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyBody: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
