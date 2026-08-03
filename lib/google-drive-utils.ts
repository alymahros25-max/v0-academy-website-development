/**
 * Google Drive URL Conversion Utilities
 * Handles conversion of Google Drive shareable links to direct embed URLs
 */

/**
 * Extracts the File ID from various Google Drive URL formats
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;

  // Format: /d/FILE_ID/view or /d/FILE_ID
  const match1 = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match1?.[1]) return match1[1];

  // Format: ?id=FILE_ID
  const match2 = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (match2?.[1]) return match2[1];

  return null;
}

/**
 * Converts a Google Drive shareable link to an embed-friendly preview URL
 * Input: https://drive.google.com/file/d/ABC123/view?usp=sharing
 * Output: https://drive.google.com/file/d/ABC123/preview
 */
export function getGoogleDriveEmbedUrl(url: string): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Checks if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

/**
 * Gets the appropriate viewer configuration based on URL type
 */
export function getViewerUrl(url: string): { type: "google-drive" | "external"; url: string } {
  if (isGoogleDriveUrl(url)) {
    const embedUrl = getGoogleDriveEmbedUrl(url);
    return {
      type: "google-drive",
      url: embedUrl || url, // Fallback to original if conversion fails
    };
  }

  // For external URLs, use Google Docs viewer as fallback
  return {
    type: "external",
    url: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
  };
}

/**
 * Validates if a URL is accessible (basic check)
 */
export async function validateGoogleDriveUrl(url: string): Promise<boolean> {
  try {
    if (!isGoogleDriveUrl(url)) return false;

    // Check if file ID exists
    const fileId = extractGoogleDriveFileId(url);
    return !!fileId;
  } catch {
    return false;
  }
}
