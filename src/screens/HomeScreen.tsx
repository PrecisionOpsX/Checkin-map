import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { TAB_BAR_OVERLAY_SPACE, theme } from '@/theme';

export function HomeScreen() {
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();

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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>CheckInMap</Text>
            <Text style={styles.greeting}>
              {profile?.displayName?.split(' ')[0] || 'Welcome'}
            </Text>
          </View>
          <Avatar uri={profile?.photoURL} name={profile?.displayName} size={44} />
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.followersCount ?? 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.followingCount ?? 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Roadmap</Text>

        <View style={styles.list}>
          <RoadmapRow
            step="01"
            title="Map and places"
            body="Curated locations rendered on a live map."
            current
          />
          <RoadmapRow
            step="02"
            title="GPS check-ins"
            body="Verified by your real location."
          />
          <RoadmapRow
            step="03"
            title="Real-time activity"
            body="See who is where, as it happens."
          />
          <RoadmapRow
            step="04"
            title="Notifications and badges"
            body="Opt in to alerts. Earn badges by showing up."
          />
        </View>
      </ScrollView>
    </View>
  );
}

function RoadmapRow({
  step,
  title,
  body,
  current,
}: {
  step: string;
  title: string;
  body: string;
  current?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.stepBadge, current && styles.stepBadgeCurrent]}>
        <Text
          style={[styles.stepText, current && styles.stepTextCurrent]}
        >
          {step}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.rowTitleRow}>
          <Text style={styles.rowTitle}>{title}</Text>
          {current ? (
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>Next</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.rowBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  eyebrow: {
    fontSize: theme.font.tiny,
    color: theme.colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: theme.font.display,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
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
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    fontSize: theme.font.tiny,
    fontWeight: '500',
    color: theme.colors.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  list: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeCurrent: {
    backgroundColor: theme.colors.primary,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  stepTextCurrent: {
    color: '#ffffff',
  },
  rowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  rowTitle: {
    fontSize: theme.font.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  rowBody: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 19,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  statusChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
