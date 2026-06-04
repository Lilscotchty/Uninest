// src/lib/storage.ts
// ─────────────────────────────────────────────────────────────────────────────
// SKYCOBE — Property media upload/download/delete helpers
// Works with the property-media bucket and its owner-scoped policies.
//
// Path convention enforced here AND in the SQL policy:
//   property-media / {userId} / {propertyId} / {timestamp}.{ext}
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "../lib/supabase";

const BUCKET = "property-media";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

// ─── Validation ───────────────────────────────────────────────────────────────

export class StorageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageValidationError";
  }
}

function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new StorageValidationError(
      `File type "${file.type}" is not allowed. ` +
      `Accepted: JPEG, PNG, WEBP, GIF, MP4.`
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new StorageValidationError(
      `File is ${sizeMB} MB — maximum allowed size is 15 MB.`
    );
  }
}

// ─── Path helpers ─────────────────────────────────────────────────────────────

/**
 * Build the canonical storage path.
 * Matches the folder-structure enforced by the SQL INSERT policy.
 *   property-media/{userId}/{propertyId}/{timestamp}.{ext}
 */
export function buildMediaPath(
  userId: string,
  propertyId: string,
  file: File
): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  return `${userId}/${propertyId}/${Date.now()}.${ext}`;
}

/**
 * Extract the storage path from a full public URL.
 * Needed when deleting — Supabase .remove() wants the path, not the URL.
 */
export function extractPathFromUrl(publicUrl: string): string {
  const marker = `/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new Error(`URL does not belong to bucket "${BUCKET}"`);
  return publicUrl.slice(idx + marker.length);
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  path: string;       // storage path  e.g. "uid/propId/1717000000000.jpg"
  publicUrl: string;  // CDN URL       e.g. "https://xxx.supabase.co/storage/v1/object/public/..."
}

/**
 * Upload a single media file and return its storage path + public URL.
 *
 * @param userId      - auth.uid() of the uploader
 * @param propertyId  - the property this media belongs to
 * @param file        - the File object from an <input type="file"> or drag-drop
 * @param onProgress  - optional callback receiving upload % (0–100)
 */
export async function uploadPropertyMedia(
  userId: string,
  propertyId: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  // Client-side validation before hitting the network
  validateFile(file);

  const path = buildMediaPath(userId, propertyId, file);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      upsert: false,          // never silently overwrite — force explicit update
      cacheControl: "3600",   // CDN caches for 1 hour
      contentType: file.type,
    });

  if (error) {
    // Surface Supabase policy violations as readable messages
    if (error.message.includes("row-level security")) {
      throw new Error(
        "Upload denied — you can only upload files to your own folder."
      );
    }
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  onProgress?.(100);

  return { path, publicUrl: data.publicUrl };
}

/**
 * Upload multiple files concurrently (max 5 at a time to avoid rate limits).
 * Returns an array of results in the same order as the input files.
 */
export async function uploadPropertyMediaBatch(
  userId: string,
  propertyId: string,
  files: File[]
): Promise<UploadResult[]> {
  const CONCURRENCY = 5;
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((file) => uploadPropertyMedia(userId, propertyId, file))
    );
    results.push(...batchResults);
  }

  return results;
}

// ─── Update (replace) ────────────────────────────────────────────────────────

/**
 * Replace an existing file at the same path.
 * Caller must own the file (enforced by the SQL UPDATE policy).
 */
export async function replacePropertyMedia(
  path: string,
  file: File
): Promise<UploadResult> {
  validateFile(file);

  const { error } = await supabase.storage
    .from(BUCKET)
    .update(path, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a single file by its storage path.
 * Caller must own the file (enforced by the SQL DELETE policy).
 */
export async function deletePropertyMedia(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

/**
 * Delete multiple files in one request.
 */
export async function deletePropertyMediaBatch(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw error;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface StorageFile {
  name: string;
  path: string;
  publicUrl: string;
  size: number | null;
  createdAt: string | null;
}

/**
 * List all media files for a given property, sorted oldest-first.
 */
export async function listPropertyMedia(
  userId: string,
  propertyId: string
): Promise<StorageFile[]> {
  const folder = `${userId}/${propertyId}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, {
      limit: 100,
      sortBy: { column: "created_at", order: "asc" },
    });

  if (error) throw error;
  if (!data) return [];

  return data.map((item) => {
    const path = `${folder}/${item.name}`;
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return {
      name: item.name,
      path,
      publicUrl: urlData.publicUrl,
      size: item.metadata?.size ?? null,
      createdAt: item.created_at ?? null,
    };
  });
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

/**
 * Get the public URL for a known path (no network request needed).
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get a short-lived signed URL for a private file.
 * Not needed for property-media (bucket is public) but useful if you
 * ever add a private bucket for sensitive docs (e.g. lease agreements).
 */
export async function getSignedUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
