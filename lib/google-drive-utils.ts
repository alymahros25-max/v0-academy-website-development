/**
 * Utility functions for handling Google Drive shareable links and converting them to embed URLs
 */

/**
 * Extracts the File ID from a Google Drive shareable link
 * @param url - Google Drive shareable link (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 * @returns The extracted File ID, or null if invalid
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null

  try {
    // Handle direct file URLs: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (fileMatch?.[1]) return fileMatch[1]

    // Handle open URLs: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)
    if (openMatch?.[1]) return openMatch[1]

    // Handle folder URLs and other formats
    const folderMatch = url.match(/\/folders\/([a-zA-Z0-9-_]+)/)
    if (folderMatch?.[1]) return folderMatch[1]

    return null
  } catch {
    return null
  }
}

/**
 * Converts a Google Drive shareable link to an embed/preview URL
 * @param url - Google Drive shareable link
 * @returns The embed URL for use in iframes, or the original URL if not a valid Google Drive link
 */
export function getGoogleDriveEmbedUrl(url: string): string {
  if (!url) return ""

  // Check if it's already a Google Drive embed URL
  if (url.includes("drive.google.com/file/d/") && url.includes("/preview")) {
    return url
  }

  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    // If not a Google Drive URL, return as-is (for backward compatibility with other PDF sources)
    return url
  }

  // Return the Google Drive preview embed URL
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Checks if a URL is a Google Drive link
 * @param url - URL to check
 * @returns True if it's a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false
  return (
    url.includes("drive.google.com/file/") ||
    url.includes("drive.google.com/open") ||
    url.includes("drive.google.com/folders")
  )
}

/**
 * Gets the appropriate viewer URL for a given PDF/document URL
 * For Google Drive: uses direct embed
 * For other URLs: uses Google Docs viewer (fallback)
 * @param url - Document URL
 * @returns The viewer URL to use in iframe
 */
export function getViewerUrl(url: string): { type: "google-drive" | "google-docs"; url: string } {
  if (!url) return { type: "google-docs", url: "" }

  if (isGoogleDriveUrl(url)) {
    return {
      type: "google-drive",
      url: getGoogleDriveEmbedUrl(url),
    }
  }

  // Fallback to Google Docs viewer for other PDFs
  return {
    type: "google-docs",
    url: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
  }
}
