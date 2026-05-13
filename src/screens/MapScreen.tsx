import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getActiveCountsByLocation } from '@/services/checkinService';
import { listLocations } from '@/services/locationService';
import { DEFAULT_MAP_CENTER } from '@/data/sampleLocations';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';
import { distanceMeters, formatDistance } from '@/utils/distance';
import type { HomeStackParamList, Location as MapLocation } from '@/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Map'>;

export function MapScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userLoc, setUserLoc] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [loadingMap, setLoadingMap] = useState(true);
  const [permDenied, setPermDenied] = useState(false);

  const requestLocation = async () => {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') {
      setPermDenied(true);
      return;
    }
    setPermDenied(false);
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setUserLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
  };

  const load = useCallback(async () => {
    try {
      const [locs, c] = await Promise.all([
        listLocations().catch(() => []),
        getActiveCountsByLocation().catch(() => ({})),
      ]);
      setLocations(locs);
      setCounts(c);
    } finally {
      setLoadingMap(false);
    }
  }, []);

  useEffect(() => {
    load();
    requestLocation();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      // Refresh visitor counts when returning from a check-in.
      getActiveCountsByLocation().then(setCounts).catch(() => {});
    }, [])
  );

  const sortedNearby = useMemo(() => {
    if (!userLoc) return locations;
    return [...locations].sort(
      (a, b) => distanceMeters(userLoc, a) - distanceMeters(userLoc, b)
    );
  }, [locations, userLoc]);

  const initialRegion: Region = userLoc
    ? {
        latitude: userLoc.latitude,
        longitude: userLoc.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    : DEFAULT_MAP_CENTER;

  const centerOn = (loc: MapLocation) => {
    mapRef.current?.animateToRegion(
      {
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      400
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.lg }]}>
        <Text style={styles.eyebrow}>CheckInMap</Text>
        <Text style={styles.title}>Find a spot</Text>
      </View>

      <View style={styles.mapWrap}>
        {loadingMap ? (
          <View style={styles.mapLoader}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            // On iOS we let it default to Apple Maps (no key needed).
            // On Android we use Google Maps. In Expo Go this works out of
            // the box; on real builds it requires a Google Maps API key.
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={StyleSheet.absoluteFillObject}
            initialRegion={initialRegion}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {locations.map((loc) => {
              const count = counts[loc.id] ?? 0;
              return (
                <Marker
                  key={loc.id}
                  coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                  onPress={() => navigation.navigate('LocationDetail', { locationId: loc.id })}
                >
                  <View style={styles.marker}>
                    <Text style={styles.markerLabel}>{loc.name}</Text>
                    {count > 0 ? (
                      <View style={styles.markerCount}>
                        <Text style={styles.markerCountText}>{count}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.markerPin} />
                </Marker>
              );
            })}
          </MapView>
        )}
      </View>

      <View style={styles.sheet}>
        <Text style={styles.sheetLabel}>
          {userLoc ? 'Nearby' : 'All locations'}
        </Text>
        <FlatList
          data={sortedNearby}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sheetList}
          ItemSeparatorComponent={() => <View style={{ width: theme.spacing.sm }} />}
          renderItem={({ item }) => {
            const meters = userLoc ? distanceMeters(userLoc, item) : null;
            const count = counts[item.id] ?? 0;
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  pressed && { transform: [{ scale: 0.99 }] },
                ]}
                onPress={() => {
                  centerOn(item);
                  navigation.navigate('LocationDetail', { locationId: item.id });
                }}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {count > 0 ? (
                    <View style={styles.livePill}>
                      <View style={styles.liveDot} />
                      <Text style={styles.livePillText}>{count} here</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.cardCat} numberOfLines={1}>
                  {item.category}
                </Text>
                {meters != null ? (
                  <Text style={styles.cardDistance}>{formatDistance(meters)} away</Text>
                ) : null}
              </Pressable>
            );
          }}
        />
        {permDenied ? (
          <Text style={styles.permNote}>
            Location permission denied. Distances will not be shown.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
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
  mapWrap: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
    overflow: 'hidden',
  },
  mapLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full ?? 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.sm,
  },
  markerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    maxWidth: 110,
  },
  markerCount: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  markerPin: {
    width: 2,
    height: 8,
    backgroundColor: theme.colors.primary,
    alignSelf: 'center',
  },
  sheet: {
    paddingTop: theme.spacing.md,
    paddingBottom: TAB_BAR_OVERLAY_SPACE,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  sheetLabel: {
    fontSize: theme.font.tiny,
    fontWeight: '500',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sheetList: {
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    width: 220,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {
    flex: 1,
    fontSize: theme.font.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardCat: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  cardDistance: {
    fontSize: theme.font.tiny,
    color: theme.colors.textSubtle,
    marginTop: theme.spacing.xs,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceAlt,
    marginLeft: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  livePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text,
  },
  permNote: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
});
