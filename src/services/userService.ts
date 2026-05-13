import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { SkillLevel, UserProfile } from '@/types';

function toProfile(data: any, uid: string): UserProfile {
  return {
    uid,
    email: data.email ?? '',
    displayName: data.displayName ?? '',
    bio: data.bio ?? '',
    location: data.location ?? '',
    photoURL: data.photoURL ?? null,
    birthday: data.birthday ?? null,
    skillLevel: (data.skillLevel as SkillLevel | null) ?? null,
    followersCount: data.followersCount ?? 0,
    followingCount: data.followingCount ?? 0,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return toProfile(snap.data(), uid);
}

export type UserProfilePatch = Partial<
  Pick<
    UserProfile,
    'displayName' | 'bio' | 'location' | 'photoURL' | 'birthday' | 'skillLevel'
  >
>;

export async function updateUserProfile(
  uid: string,
  data: UserProfilePatch
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function listUsers(max = 50): Promise<UserProfile[]> {
  const q = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProfile(d.data(), d.id));
}

/**
 * A profile is considered "complete" once the user has filled the
 * required onboarding fields (birthday + skill level). bio, location,
 * and photo remain optional.
 */
export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return Boolean(profile.birthday) && Boolean(profile.skillLevel);
}
