import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

function followDocId(followerId: string, followingId: string): string {
  return `${followerId}_${followingId}`;
}

export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const snap = await getDoc(
    doc(db, 'follows', followDocId(followerId, followingId))
  );
  return snap.exists();
}

export async function follow(
  followerId: string,
  followingId: string
): Promise<void> {
  if (followerId === followingId) return;
  const id = followDocId(followerId, followingId);
  const ref = doc(db, 'follows', id);
  const exists = await getDoc(ref);
  if (exists.exists()) return;

  const batch = writeBatch(db);
  batch.set(ref, {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, 'users', followerId), {
    followingCount: increment(1),
  });
  batch.update(doc(db, 'users', followingId), {
    followersCount: increment(1),
  });
  await batch.commit();
}

export async function unfollow(
  followerId: string,
  followingId: string
): Promise<void> {
  const id = followDocId(followerId, followingId);
  const ref = doc(db, 'follows', id);
  const exists = await getDoc(ref);
  if (!exists.exists()) return;

  const batch = writeBatch(db);
  batch.delete(ref);
  batch.update(doc(db, 'users', followerId), {
    followingCount: increment(-1),
  });
  batch.update(doc(db, 'users', followingId), {
    followersCount: increment(-1),
  });
  await batch.commit();
}

export async function listFollowing(userId: string): Promise<string[]> {
  const q = query(
    collection(db, 'follows'),
    where('followerId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followingId as string);
}

export async function listFollowers(userId: string): Promise<string[]> {
  const q = query(
    collection(db, 'follows'),
    where('followingId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followerId as string);
}
