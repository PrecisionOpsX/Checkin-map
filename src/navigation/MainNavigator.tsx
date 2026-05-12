import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { HomeScreen } from '@/screens/HomeScreen';
import { UsersScreen } from '@/screens/UsersScreen';
import { UserProfileScreen } from '@/screens/UserProfileScreen';
import { MyProfileScreen } from '@/screens/MyProfileScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { FollowListScreen } from '@/screens/FollowListScreen';
import { theme } from '@/theme';
import type {
  MainTabParamList,
  DiscoverStackParamList,
  ProfileStackParamList,
} from '@/types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function DiscoverNavigator() {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen
        name="Users"
        component={UsersScreen}
        options={{ title: 'Discover' }}
      />
      <DiscoverStack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
    </DiscoverStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <ProfileStack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="FollowList"
        component={FollowListScreen}
        options={({ route }) => ({
          title: route.params.mode === 'followers' ? 'Followers' : 'Following',
        })}
      />
    </ProfileStack.Navigator>
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        color: focused ? theme.colors.primary : theme.colors.textMuted,
        fontWeight: focused ? '700' : '500',
      }}
    >
      {label}
    </Text>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Discover" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
