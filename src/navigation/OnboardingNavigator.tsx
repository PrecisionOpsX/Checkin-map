import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CompleteProfileScreen } from '@/screens/onboarding/CompleteProfileScreen';
import type { OnboardingStackParamList } from '@/types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
    </Stack.Navigator>
  );
}
