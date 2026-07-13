/**
 * YouTube URL Utilities
 * Extract embed IDs from various YouTube URL formats
 */

/**
 * Extract YouTube video ID from various URL formats.
 * Returns exactly the 11-character video ID, stripping all tracking
 * parameters (?si=, &feature=, etc.) before matching.
 *
 * Supported formats:
 *   https://www.youtube.com/watch?v=YzChqKd6TT8
 *   https://www.youtube.com/watch?v=YzChqKd6TT8&feature=share
 *   https://youtu.be/YzChqKd6TT8
 *   https://youtu.be/YzChqKd6TT8?si=A5KHoh2pZLEJ8BGn
 *   https://www.youtube.com/embed/YzChqKd6TT8
 *   https://www.youtube.com/shorts/YzChqKd6TT8
 *   https://m.youtube.com/watch?v=YzChqKd6TT8
 *   YzChqKd6TT8  (bare 11-char ID)
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const cleaned = urlOrId.trim();

  // Fast path: already a bare 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned;
  }

  // Single consolidated regex that covers every YouTube URL pattern.
  // The ID always follows one of these tokens:
  //   v=          watch?v=ID
  //   /embed/     youtube.com/embed/ID
  //   /shorts/    youtube.com/shorts/ID
  //   youtu.be/   youtu.be/ID
  // After the 11-char ID we accept ? & # / or end-of-string.
  const match = cleaned.match(
    /(?:[?&]v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&#/]|$)/
  );

  if (match?.[1]) {
    return match[1];
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
