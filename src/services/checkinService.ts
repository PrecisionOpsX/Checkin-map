import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Checkin } from '@/types';

const CHECKIN_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours: treat older active check-ins as expired

function toCheckin(id: string, data: any): Checkin {
  return {
    id,
    userId: data.userId,
    locationId: data.locationId,
    userDisplayName: data.userDisplayName ?? '',
    userPhotoURL: data.userPhotoURL ?? null,
    locationName: data.locationName ?? '',
    checkedInAt: data.checkedInAt?.toMillis?.() ?? 0,
    checkedOutAt: data.checkedOutAt?.toMillis?.() ?? null,
  };
}

export interface CheckinInput {
  userId: string;
  userDisplayName: string;
  userPhotoURL: string | null;
  locationId: string;
  locationName: string;
}

/** Create a new active check-in. Caller should ensure no existing active one. */
export async function createCheckin(input: CheckinInput): Promise<string> {
  const ref = await addDoc(collection(db, 'checkins'), {
    userId: input.userId,
    locationId: input.locationId,
    userDisplayName: input.userDisplayName,
    userPhotoURL: input.userPhotoURL,
    locationName: input.locationName,
    checkedInAt: serverTimestamp(),
    checkedOutAt: null,
  });
  return ref.id;
}

export async function checkOut(checkinId: string): Promise<void> {
  await updateDoc(doc(db, 'checkins', checkinId), {
    checkedOutAt: serverTimestamp(),
  });
}

/** Returns the user's currently active check-in (if any). */
export async function getActiveCheckinForUser(
  userId: string
): Promise<Checkin | null> {
  const q = query(
    collection(db, 'checkins'),
    where('userId', '==', userId),
    where('checkedOutAt', '==', null)
  );
  const snap = await getDocs(q);
  const cutoff = Date.now() - CHECKIN_TTL_MS;
  const active = snap.docs
    .map((d) => toCheckin(d.id, d.data()))
    .filter((c) => c.checkedInAt >= cutoff)
    .sort((a, b) => b.checkedInAt - a.checkedInAt);
  return active[0] ?? null;
}

/** List current visitors at a location (active check-ins within TTL). */
export async function listVisitors(locationId: string): Promise<Checkin[]> {
  const q = query(
    collection(db, 'checkins'),
    where('locationId', '==', locationId),
    where('checkedOutAt', '==', null)
  );
  const snap = await getDocs(q);
  const cutoff = Date.now() - CHECKIN_TTL_MS;
  return snap.docs
    .map((d) => toCheckin(d.id, d.data()))
    .filter((c) => c.checkedInAt >= cutoff)
    .sort((a, b) => b.checkedInAt - a.checkedInAt);
}

/** Visitor counts keyed by locationId. Used to badge map markers. */
export async function getActiveCountsByLocation(): Promise<Record<string, number>> {
  const q = query(collection(db, 'checkins'), where('checkedOutAt', '==', null));
  const snap = await getDocs(q);
  const cutoff = Date.now() - CHECKIN_TTL_MS;
  const counts: Record<string, number> = {};
  for (const d of snap.docs) {
    const c = toCheckin(d.id, d.data());
    if (c.checkedInAt < cutoff) continue;
    counts[c.locationId] = (counts[c.locationId] ?? 0) + 1;
  }
  return counts;
}

/** Recent check-in history for a user, newest first. */
export async function listUserCheckinHistory(
  userId: string,
  max = 20
): Promise<Checkin[]> {
  const q = query(
    collection(db, 'checkins'),
    where('userId', '==', userId),
    orderBy('checkedInAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toCheckin(d.id, d.data()));
}
