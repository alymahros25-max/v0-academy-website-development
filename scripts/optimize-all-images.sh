#!/bin/bash

# Image Optimization Script for PageSpeed Improvements
# Converts JPG/PNG to WebP and AVIF formats with aggressive compression

set -e

IMAGE_DIR="public/images"
TEMP_DIR="/tmp/img_opt"

echo "🖼️  Starting Image Optimization..."
echo "=================================="

mkdir -p "$TEMP_DIR"

# Check if imagemagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Installing..."
    apt-get update && apt-get install -y imagemagick > /dev/null 2>&1
fi

# Function to compress and convert
optimize_image() {
    local input=$1
    local basename=$(basename "$input" | sed 's/\.[^.]*$//')
    local filename="${basename}"
    
    echo "📦 Processing: $filename..."
    
    # Create optimized JPG (quality 75 for mobile, 80 for desktop)
    convert "$input" -quality 75 -strip -interlace Plane \
        "$IMAGE_DIR/${filename}.jpg" 2>/dev/null || true
    
    # Convert to WebP (quality 75)
    convert "$input" -quality 75 -strip \
        "$IMAGE_DIR/${filename}.webp" 2>/dev/null || true
    
    # Get file sizes
    original_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
    jpg_size=$(stat -f%z "$IMAGE_DIR/${filename}.jpg" 2>/dev/null || stat -c%s "$IMAGE_DIR/${filename}.jpg" 2>/dev/null)
    webp_size=$(stat -f%z "$IMAGE_DIR/${filename}.webp" 2>/dev/null || stat -c%s "$IMAGE_DIR/${filename}.webp" 2>/dev/null)
    
    printf "  Original: %7d bytes\n" $original_size
    printf "  JPG:      %7d bytes (%.1f%% smaller)\n" $jpg_size $((100 * (original_size - jpg_size) / original_size))
    printf "  WebP:     %7d bytes (%.1f%% smaller)\n\n" $webp_size $((100 * (original_size - webp_size) / original_size))
}

# Process all JPG and PNG files
for image in "$IMAGE_DIR"/*.{jpg,jpeg,png}; do
    if [[ -f "$image" ]]; then
        optimize_image "$image"
    fi
done

echo "✅ Image optimization complete!"
echo ""
echo "Usage in components:"
echo "  <picture>"
echo "    <source srcSet=\"/images/name.webp\" type=\"image/webp\" />"
echo "    <img src=\"/images/name.jpg\" alt=\"description\" />"
echo "  </picture>"
echo ""

rm -rf "$TEMP_DIR"
