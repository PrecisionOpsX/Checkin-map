import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '@/components/Icon';
import { theme } from '@/theme';

const TABS: Record<string, { icon: IconName; label: string }> = {
  Home: { icon: 'home', label: 'Home' },
  Discover: { icon: 'compass', label: 'Discover' },
  Profile: { icon: 'user', label: 'Profile' },
};

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 12) + 6;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: bottomOffset }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TABS[route.name];
          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={({ pressed }) => [
                styles.tab,
                isFocused && styles.tabActive,
                pressed && !isFocused && styles.tabPressed,
              ]}
            >
              <Icon
                name={config.icon}
                size={18}
                color={isFocused ? '#ffffff' : theme.colors.textMuted}
              />
              {isFocused ? (
                <Text style={styles.label}>{config.label}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.md,
    ...Platform.select({
      android: { elevation: 8 },
      default: {},
    }),
  },
  tab: {
    minWidth: 48,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabPressed: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  label: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.1,
  },
});
