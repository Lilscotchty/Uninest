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

function validateFile(file: File): void {
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
  file:     File
): Promise<UploadResult> {
  validateFile(file);

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
  files:    File[]
): Promise<UploadResult[]> {
  const CONCURRENCY = 5;
  const results: UploadResult[] = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      files.slice(i, i + CONCURRENCY).map(f => uploadHostelMedia(userId, hostelId, f))
    );
    results.push(...batch);
  }
  return results;
}

// ─── Update (overwrite) ───────────────────────────────────────────────────────

export async function replaceHostelMedia(
  path: string,
  file: File
): Promise<UploadResult> {
  validateFile(file);
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
