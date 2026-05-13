export type SkillLevel = 'casual' | 'college' | 'all-week';

export const SKILL_LEVELS: { value: SkillLevel; label: string; short: string }[] = [
  { value: 'casual', label: 'Casual player', short: 'Casual' },
  { value: 'college', label: 'College ball ready', short: 'College' },
  { value: 'all-week', label: "I'll be on here all week", short: 'All week' },
];

export function skillLevelLabel(value?: SkillLevel | null): string | null {
  if (!value) return null;
  return SKILL_LEVELS.find((s) => s.value === value)?.label ?? null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  bio: string;
  location: string;
  photoURL: string | null;
  /** Stored as YYYY-MM-DD. Null until the user finishes onboarding. */
  birthday: string | null;
  skillLevel: SkillLevel | null;
  followersCount: number;
  followingCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  photoURL: string | null;
}

export interface Checkin {
  id: string;
  userId: string;
  locationId: string;
  checkedInAt: number;
  checkedOutAt: number | null;
  userDisplayName: string;
  userPhotoURL: string | null;
  /** Denormalized for fast display in user check-in history */
  locationName: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  CompleteProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Map: undefined;
  LocationDetail: { locationId: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  UserProfile: { userId: string };
  FollowList: { userId: string; mode: 'followers' | 'following' };
  LocationDetail: { locationId: string };
  LogoGallery: undefined;
};

export type DiscoverStackParamList = {
  Users: undefined;
  UserProfile: { userId: string };
  LocationDetail: { locationId: string };
};
