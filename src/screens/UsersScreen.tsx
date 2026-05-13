import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { listUsers } from '@/services/userService';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import type { DiscoverStackParamList, UserProfile } from '@/types';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Users'>;

export function UsersScreen({ navigation }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const all = await listUsers(100);
      setUsers(all.filter((u) => u.uid !== user?.uid));
    } catch (e: any) {
      console.warn('Failed to load users', e);
      setUsers([]);
      setErrorMsg(
        e?.code === 'permission-denied'
          ? 'Could not load users. Check your Firestore security rules are published.'
          : 'Could not load users. Pull down to retry.'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

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

  const Header = () => (
    <View style={[styles.header, { paddingTop: insets.top + theme.spacing.lg }]}>
      <Text style={styles.eyebrow}>Discover</Text>
      <Text style={styles.title}>People</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        ListHeaderComponent={<Header />}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg },
        ]}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {errorMsg ? 'Could not load users' : 'No other users yet'}
            </Text>
            <Text style={styles.emptyBody}>
              {errorMsg ?? 'Invite a friend to join so you can follow each other.'}
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
              navigation.navigate('UserProfile', { userId: item.uid })
            }
          >
            <Avatar uri={item.photoURL} name={item.displayName} size={48} />
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
    flexGrow: 1,
  },
  header: {
    paddingBottom: theme.spacing.lg,
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
    marginTop: 4,
    letterSpacing: -0.5,
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
    marginLeft: 64,
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
    minHeight: 300,
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
