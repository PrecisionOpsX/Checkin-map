import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

export const STORAGE_NOT_CONFIGURED = 'STORAGE_NOT_CONFIGURED';

/**
 * Returns true if Firebase Storage is configured for this build.
 * If the storage bucket env var is missing, all storage features are
 * disabled gracefully so the rest of the app still works.
 */
export function isStorageConfigured(): boolean {
  const bucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  return typeof bucket === 'string' && bucket.length > 0;
}

export async function uploadAvatar(uid: string, localUri: string): Promise<string> {
  if (!isStorageConfigured() || !storage) {
    const err = new Error(STORAGE_NOT_CONFIGURED);
    (err as any).code = STORAGE_NOT_CONFIGURED;
    throw err;
  }

  const response = await fetch(localUri);
  const blob = await response.blob();
  const path = `avatars/${uid}-${Date.now()}.jpg`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });
  return await getDownloadURL(fileRef);
}
