/**
 * YouTube URL Utilities
 * Extract embed IDs from various YouTube URL formats
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=xxxxx
 * - https://youtu.be/xxxxx
 * - https://www.youtube.com/embed/xxxxx
 * - xxxxx (just the ID)
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;

  // If it's already just an ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  // youtube.com/watch?v=xxxxx
  let match = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // youtu.be/xxxxx or youtube.com/embed/xxxxx
  match = urlOrId.match(/\/([a-zA-Z0-9_-]{11})(?:\?|&|$|\/)/);
  if (match && match[1]) {
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
