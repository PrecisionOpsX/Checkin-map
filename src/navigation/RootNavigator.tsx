import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { isProfileComplete } from '@/services/userService';
import { theme } from '@/theme';

export function RootNavigator() {
  const { user, profile, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  let stack: React.ReactNode;
  if (!user) {
    stack = <AuthNavigator />;
  } else if (!isProfileComplete(profile)) {
    stack = <OnboardingNavigator />;
  } else {
    stack = <MainNavigator />;
  }

  return <NavigationContainer>{stack}</NavigationContainer>;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
