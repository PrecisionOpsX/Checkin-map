import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { getLocation } from '@/services/locationService';
import {
  checkOut,
  createCheckin,
  getActiveCheckinForUser,
  listVisitors,
} from '@/services/checkinService';
import {
  CHECKIN_RADIUS_METERS,
  distanceMeters,
  formatDistance,
} from '@/utils/distance';
import { formatRelative } from '@/utils/dates';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import type {
  Checkin,
  HomeStackParamList,
  Location as MapLocation,
} from '@/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'LocationDetail'>;

export function LocationDetailScreen({ route, navigation }: Props) {
  const { locationId } = route.params;
  const { user, profile } = useAuth();
  const [loc, setLoc] = useState<MapLocation | null>(null);
  const [visitors, setVisitors] = useState<Checkin[]>([]);
  const [activeCheckin, setActiveCheckin] = useState<Checkin | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!locationId) return;
    setLoading(true);
    const [l, v] = await Promise.all([
      getLocation(locationId),
      listVisitors(locationId),
    ]);
    setLoc(l);
    setVisitors(v);
    if (user) {
      const active = await getActiveCheckinForUser(user.uid);
      setActiveCheckin(active && active.locationId === locationId ? active : null);
    }
    setLoading(false);
  }, [locationId, user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleCheckIn = async () => {
    if (!user || !profile || !loc) return;

    // Block if already checked in elsewhere
    const existing = await getActiveCheckinForUser(user.uid);
    if (existing && existing.locationId !== loc.id) {
      Alert.alert(
        'Already checked in',
        `You are currently checked in at ${existing.locationName}. Check out first to switch.`
      );
      return;
    }

    // Verify GPS proximity
    setBusy(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert(
          'Location required',
          'GPS is required to verify you are at the location.'
        );
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const dist = distanceMeters(
        { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        { latitude: loc.latitude, longitude: loc.longitude }
      );
      if (dist > CHECKIN_RADIUS_METERS) {
        Alert.alert(
          'Too far to check in',
          `You are about ${formatDistance(dist)} from ${loc.name}. You need to be within ${CHECKIN_RADIUS_METERS} m.`
        );
        return;
      }

      await createCheckin({
        userId: user.uid,
        userDisplayName: profile.displayName,
        userPhotoURL: profile.photoURL,
        locationId: loc.id,
        locationName: loc.name,
      });
      await load();
    } catch (e) {
      Alert.alert('Check-in failed', 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeCheckin) return;
    setBusy(true);
    try {
      await checkOut(activeCheckin.id);
      await load();
    } catch {
      Alert.alert('Could not check out', 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const openInMaps = () => {
    if (!loc) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(loc.name)}@${loc.latitude},${loc.longitude}`,
      android: `geo:0,0?q=${loc.latitude},${loc.longitude}(${encodeURIComponent(loc.name)})`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Location" onBack={() => navigation.goBack()} />
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!loc) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Location" onBack={() => navigation.goBack()} />
        <View style={styles.loader}>
          <Text style={styles.muted}>Location not found.</Text>
        </View>
      </View>
    );
  }

  const isCheckedInHere = activeCheckin != null;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Location" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_OVERLAY_SPACE + theme.spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.category}>{loc.category}</Text>
        <Text style={styles.name}>{loc.name}</Text>
        <Text style={styles.address}>{loc.address}</Text>

        <View style={styles.card}>
          <Text style={styles.about}>{loc.description}</Text>
          <Pressable onPress={openInMaps}>
            <Text style={styles.linkText}>Open in Maps</Text>
          </Pressable>
        </View>

        <View style={styles.actions}>
          {isCheckedInHere ? (
            <>
              <View style={styles.activeBanner}>
                <View style={styles.liveDot} />
                <Text style={styles.activeBannerText}>
                  Checked in {formatRelative(activeCheckin!.checkedInAt)}
                </Text>
              </View>
              <Button
                label="Check out"
                onPress={handleCheckOut}
                loading={busy}
                variant="secondary"
              />
            </>
          ) : (
            <Button label="Check in" onPress={handleCheckIn} loading={busy} />
          )}
          <Text style={styles.note}>
            Check-ins are GPS-verified. You need to be within {CHECKIN_RADIUS_METERS} m of
            the location.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>
          Who is here now · {visitors.length}
        </Text>
        <View style={styles.card}>
          {visitors.length === 0 ? (
            <Text style={styles.empty}>
              No one checked in right now. Be the first.
            </Text>
          ) : (
            visitors.map((v, i) => (
              <View
                key={v.id}
                style={[
                  styles.visitorRow,
                  i !== visitors.length - 1 && styles.visitorRowBorder,
                ]}
              >
                <Avatar uri={v.userPhotoURL} name={v.userDisplayName} size={40} />
                <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                  <Text style={styles.visitorName}>{v.userDisplayName}</Text>
                  <Text style={styles.visitorTime}>
                    Checked in {formatRelative(v.checkedInAt)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  },
  category: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: theme.font.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  address: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  card: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  about: {
    fontSize: theme.font.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.font.small,
    marginTop: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
  note: {
    fontSize: theme.font.tiny,
    color: theme.colors.textSubtle,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    marginBottom: theme.spacing.sm,
  },
  activeBannerText: {
    fontSize: theme.font.small,
    color: theme.colors.text,
    fontWeight: '600',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
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
  empty: {
    fontSize: theme.font.small,
    color: theme.colors.textSubtle,
    padding: theme.spacing.sm,
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
  },
  visitorRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  visitorName: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  visitorTime: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  muted: { color: theme.colors.textMuted },
});
