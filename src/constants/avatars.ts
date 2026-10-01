// Private Supabase Storage bucket holding student photos. Paths look like `{studentId}/{timestamp}.jpg`.
export const AVATAR_BUCKET = 'student-avatars';

// A signed URL works for anyone who holds it until it expires, so the expiry is kept short
export const AVATAR_SIGNED_URL_EXPIRY_SECONDS = 10 * 60;
// Re-sign before the expiry so photos on a page left open keep loading
export const AVATAR_URL_REFRESH_INTERVAL_MS = 8 * 60 * 1000;

export const ACCEPTED_AVATAR_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_AVATAR_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const AVATAR_OUTPUT_SIZE_PX = 256;
export const AVATAR_OUTPUT_JPEG_QUALITY = 0.85;
