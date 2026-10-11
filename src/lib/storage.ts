// src/lib/storage.ts
// ─────────────────────────────────────────────────────────────────────────────
// Bucket id matches supabase.sql exactly: 'hostel-media'
// Path convention: hostel-media/{userId}/{hostelId}/{timestamp}.{ext}
// This matches the INSERT policy: (storage.foldername(name))[1] = auth.uid()
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '../lib/supabase';

// ── Must match the bucket id in supabase.sql exactly ─────────────────────────
const BUCKET = 'hostel-media' as const;

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4']);
const ALLOWED_MIME_TYPES  = new Set([
  'image/jpeg', 'image/jpg', 'image/png',
  'image/webp', 'image/gif', 'video/mp4',
]);
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB — matches policy cap

// ─── Error class ──────────────────────────────────────────────────────────────

export class StorageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageValidationError';
  }
}

// ─── Client-side validation (runs before network hit) ─────────────────────────

async function validateFile(file: File, is360: boolean = false): Promise<void> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new StorageValidationError(
      `"${file.type}" is not allowed. Accepted: JPEG, PNG, WEBP, GIF, MP4.`
    );
  }
  if (file.size > MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw new StorageValidationError(
      `File is ${mb} MB — maximum allowed size is 15 MB.`
    );
  }

  if (is360 && file.type.startsWith('image/')) {
    const isEquirectangular = await new Promise<boolean>((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        // 360 panoramas (equirectangular) generally have an exactly 2:1 aspect ratio.
        const aspect = img.width / img.height;
        const aspectTarget = 2.0;
        const aspectTolerance = 0.05; // 5% tolerance
        URL.revokeObjectURL(url);
        
        // Also ensure a minimum resolution for a decent 360 experience
        if (img.width < 1024) {
          resolve(false);
          return;
        }
        
        resolve(Math.abs(aspect - aspectTarget) < aspectTolerance);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      img.src = url;
    });

    if (!isEquirectangular) {
      throw new StorageValidationError(
        'Upload failed: The image must be a valid 360° panorama (equirectangular). It should have a 2:1 aspect ratio and at least 1024x512 resolution.'
      );
    }
  }
}

// ─── Path builder ─────────────────────────────────────────────────────────────
// Produces: {userId}/{hostelId}/{timestamp}.{ext}
// First segment = userId → satisfies the SQL INSERT policy owner check

export function buildMediaPath(
  userId: string,
  hostelId: string,
  file: File
): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new StorageValidationError(`File extension ".${ext}" is not allowed.`);
  }
  return `${userId}/${hostelId}/${Date.now()}.${ext}`;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  path:      string;   // e.g. "uid/hostelId/1717000000000.jpg"
  publicUrl: string;   // CDN URL
}

export async function uploadHostelMedia(
  userId:   string,
  hostelId: string,
  file:     File,
  is360:    boolean = false
): Promise<UploadResult> {
  await validateFile(file, is360);

  const path = buildMediaPath(userId, hostelId, file);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      upsert:       false,
      cacheControl: '3600',
      contentType:  file.type,
    });

  if (error) {
    if (error.message.includes('row-level security')) {
      throw new Error('Upload denied — you can only upload to your own folder.');
    }
    if (error.message.includes('Bucket not found')) {
      throw new Error(
        `Bucket "${BUCKET}" not found. ` +
        'Create it in Supabase Dashboard → Storage → New Bucket.'
      );
    }
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// ─── Batch upload ─────────────────────────────────────────────────────────────

export async function uploadHostelMediaBatch(
  userId:   string,
  hostelId: string,
  files:    File[],
  is360:    boolean = false
): Promise<UploadResult[]> {
  const CONCURRENCY = 5;
  const results: UploadResult[] = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      files.slice(i, i + CONCURRENCY).map(f => uploadHostelMedia(userId, hostelId, f, is360))
    );
    results.push(...batch);
  }
  return results;
}

// ─── Update (overwrite) ───────────────────────────────────────────────────────

export async function replaceHostelMedia(
  path: string,
  file: File,
  is360: boolean = false
): Promise<UploadResult> {
  await validateFile(file, is360);
  const { error } = await supabase.storage
    .from(BUCKET)
    .update(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteHostelMedia(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function deleteHostelMediaBatch(paths: string[]): Promise<void> {
  if (!paths.length) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw error;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface StorageFile {
  name:      string;
  path:      string;
  publicUrl: string;
  size:      number | null;
  createdAt: string | null;
}

export async function listHostelMedia(
  userId:   string,
  hostelId: string
): Promise<StorageFile[]> {
  const folder = `${userId}/${hostelId}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'asc' } });
  if (error) throw error;
  if (!data) return [];
  return data.map(item => {
    const path = `${folder}/${item.name}`;
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return {
      name:      item.name,
      path,
      publicUrl: urlData.publicUrl,
      size:      item.metadata?.size ?? null,
      createdAt: item.created_at ?? null,
    };
  });
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Extract the storage path from a full public URL (needed for delete) */
export function extractPathFromUrl(publicUrl: string): string {
  const marker = `/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new Error(`URL does not belong to bucket "${BUCKET}"`);
  return publicUrl.slice(idx + marker.length);
}

// ─── Profile Photos (Avatar & Cover) ──────────────────────────────────────────

/**
 * Resizes an image file to a maximum dimension and compresses it as a JPEG/WEBP Blob.
 */
export async function optimizeProfileImage(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else resolve(file);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for optimization'));
    };
    img.src = url;
  });
}

/**
 * Uploads an avatar or cover photo.
 * Tries Supabase Storage buckets ('property-media', 'profile-media', 'hostel-media').
 * Falls back to an optimized Data URL if storage is not yet provisioned.
 */
export async function uploadProfilePhoto(
  userId: string,
  type: 'avatar' | 'cover',
  file: File
): Promise<string> {
  const maxDim = type === 'avatar' ? 600 : 1400;
  let optimizedBlob: Blob;
  try {
    optimizedBlob = await optimizeProfileImage(file, maxDim, 0.85);
  } catch (e) {
    optimizedBlob = file;
  }

  const ext = 'jpg';
  const filePath = `${userId}/profile/${type}_${Date.now()}.${ext}`;
  const candidateBuckets = ['property-media', 'profile-media', 'hostel-media'];

  for (const bucketName of candidateBuckets) {
    try {
      const { error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(filePath, optimizedBlob, {
          upsert: true,
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (!uploadErr) {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (ignore) {
      // Continue to next bucket or fallback
    }
  }

  // Graceful fallback to Data URL if storage bucket fails or not yet created
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(optimizedBlob);
  });
}

/**
 * Persists updated avatar or cover URLs to both auth.users metadata and public.profiles.
 */
export async function saveProfilePhotos(
  userId: string,
  photos: { avatarUrl?: string; coverUrl?: string }
): Promise<void> {
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  const authData: Record<string, any> = {};

  if (photos.avatarUrl !== undefined) {
    updates.avatar_url = photos.avatarUrl;
    authData.avatar_url = photos.avatarUrl;
  }
  if (photos.coverUrl !== undefined) {
    updates.cover_url = photos.coverUrl;
    authData.cover_url = photos.coverUrl;
  }

  // 1. Update Supabase Auth user metadata
  try {
    await supabase.auth.updateUser({
      data: authData,
    });
  } catch (err) {
    console.warn('Could not update user metadata:', err);
  }

  // 2. Update public.profiles row
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.warn('Could not update profiles table directly:', error);
    }
  } catch (err) {
    console.warn('Profiles table update exception:', err);
  }
}

