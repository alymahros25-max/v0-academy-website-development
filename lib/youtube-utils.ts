/**
 * YouTube URL Utilities
 * Extract embed IDs from various YouTube URL formats
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=YzChqKd6TT8
 * - https://youtu.be/YzChqKd6TT8?si=A5KHoh2pZLEJ8BGn (with tracking params)
 * - https://www.youtube.com/embed/YzChqKd6TT8
 * - YzChqKd6TT8 (just the ID)
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const cleaned = urlOrId.trim();

  // If it's already just an ID (11 characters alphanumeric, underscore, hyphen)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned;
  }

  // Extract 11-character video ID from various URL formats
  // This regex captures exactly 11 characters preceded by / or v= and followed by ? & # / or end of string
  const idMatch = cleaned.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&#/]|$)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  // Fallback: extract any 11-character sequence that looks like a video ID
  // This handles edge cases and malformed URLs
  const fallbackMatch = cleaned.match(/([a-zA-Z0-9_-]{11})/);
  if (fallbackMatch && fallbackMatch[1]) {
    // Verify it's likely a YouTube ID (not just any 11-char string in the URL)
    const videoId = fallbackMatch[1];
    // Make sure it's not part of a longer alphanumeric sequence
    const beforeIndex = cleaned.indexOf(videoId);
    const afterIndex = beforeIndex + 11;
    const charBefore = beforeIndex > 0 ? cleaned[beforeIndex - 1] : ' ';
    const charAfter = afterIndex < cleaned.length ? cleaned[afterIndex] : ' ';
    
    // Valid separators: /, ?, &, #, space, or string boundaries
    if (!/[a-zA-Z0-9_-]/.test(charBefore) && !/[a-zA-Z0-9_-]/.test(charAfter)) {
      return videoId;
    }
  }

  return null;
}

/**
 * Get YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

/**
 * Get YouTube thumbnail URL
 * Higher quality images: maxresdefault > sddefault > hqdefault > mqdefault > default
 */
export function getYouTubeThumbnail(videoId: string, quality: 'max' | 'high' | 'medium' | 'low' = 'high'): string {
  const qualityMap: Record<string, string> = {
    max: 'maxresdefault',
    high: 'sddefault',
    medium: 'hqdefault',
    low: 'mqdefault',
  };

  const qType = qualityMap[quality] || 'hqdefault';
  return `https://img.youtube.com/vi/${videoId}/${qType}.jpg`;
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  const id = extractYouTubeId(url);
  return !!id;
}

/**
 * Get standard YouTube watch URL from ID
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
