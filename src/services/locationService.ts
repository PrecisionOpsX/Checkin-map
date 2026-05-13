import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { SAMPLE_LOCATIONS } from '@/data/sampleLocations';
import type { Location } from '@/types';

/**
 * Until the admin panel (M4) ships, locations are sourced from a hard-coded
 * sample dataset. Once the client adds locations through Firestore, the
 * `locations` collection takes priority.
 */
export async function listLocations(): Promise<Location[]> {
  try {
    const snap = await getDocs(collection(db, 'locations'));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    }
  } catch {
    // Fall through to sample data if Firestore rules block the read.
  }
  return SAMPLE_LOCATIONS;
}

export async function getLocation(id: string): Promise<Location | null> {
  // Try Firestore first
  try {
    const snap = await getDoc(doc(db, 'locations', id));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as any) };
    }
  } catch {
    // ignore
  }
  return SAMPLE_LOCATIONS.find((l) => l.id === id) ?? null;
}
