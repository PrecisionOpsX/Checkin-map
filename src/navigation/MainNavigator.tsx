import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen } from '@/screens/MapScreen';
import { LocationDetailScreen } from '@/screens/LocationDetailScreen';
import { UsersScreen } from '@/screens/UsersScreen';
import { UserProfileScreen } from '@/screens/UserProfileScreen';
import { MyProfileScreen } from '@/screens/MyProfileScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { FollowListScreen } from '@/screens/FollowListScreen';
import { LogoGalleryScreen } from '@/screens/LogoGalleryScreen';
import { FloatingTabBar } from '@/components/FloatingTabBar';
import type {
  MainTabParamList,
  DiscoverStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
} from '@/types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Map" component={MapScreen} />
      <HomeStack.Screen name="LocationDetail" component={LocationDetailScreen} />
    </HomeStack.Navigator>
  );
}

function DiscoverNavigator() {
  return (
    <DiscoverStack.Navigator screenOptions={{ headerShown: false }}>
      <DiscoverStack.Screen name="Users" component={UsersScreen} />
      <DiscoverStack.Screen name="UserProfile" component={UserProfileScreen} />
      <DiscoverStack.Screen name="LocationDetail" component={LocationDetailScreen} />
    </DiscoverStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="MyProfile" component={MyProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="UserProfile" component={UserProfileScreen} />
      <ProfileStack.Screen name="FollowList" component={FollowListScreen} />
      <ProfileStack.Screen name="LocationDetail" component={LocationDetailScreen} />
      <ProfileStack.Screen name="LogoGallery" component={LogoGalleryScreen} />
    </ProfileStack.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Discover" component={DiscoverNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
