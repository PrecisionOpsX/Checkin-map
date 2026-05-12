export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  bio: string;
  location: string;
  photoURL: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: number;
  updatedAt: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  UserProfile: { userId: string };
  FollowList: { userId: string; mode: 'followers' | 'following' };
};

export type DiscoverStackParamList = {
  Users: undefined;
  UserProfile: { userId: string };
};
