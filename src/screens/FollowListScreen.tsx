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
import { getUserProfile } from '@/services/userService';
import { listFollowers, listFollowing } from '@/services/followService';
import { theme } from '@/theme';
import type { ProfileStackParamList, UserProfile } from '@/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'FollowList'>;

export function FollowListScreen({ route, navigation }: Props) {
  const { userId, mode } = route.params;
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const ids =
      mode === 'followers'
        ? await listFollowers(userId)
        : await listFollowing(userId);
    const results = await Promise.all(ids.map((id) => getUserProfile(id)));
    setProfiles(results.filter((p): p is UserProfile => p !== null));
    setLoading(false);
  }, [userId, mode]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={profiles}
      keyExtractor={(item) => item.uid}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyBody}>
            {mode === 'followers'
              ? 'No followers yet.'
              : 'Not following anyone yet.'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={() =>
            navigation.push('UserProfile', { userId: item.uid })
          }
        >
          <Avatar uri={item.photoURL} name={item.displayName} size={44} />
          <View style={styles.rowText}>
            <Text style={styles.name}>{item.displayName}</Text>
            {item.location ? (
              <Text style={styles.sub}>{item.location}</Text>
            ) : null}
          </View>
        </Pressable>
      )}
    />
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
  content: { padding: theme.spacing.md, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.sm,
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
  sep: { height: 1, backgroundColor: theme.colors.border, marginLeft: 60 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyBody: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
