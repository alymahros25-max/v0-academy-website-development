#!/bin/bash

# Image Optimization Script
# Converts PNG/JPG images to AVIF and WebP formats for better performance
# Requirements: imagemagick or libvips installed

set -e

IMAGE_DIR="./public/images"
QUALITY=85
WEBP_QUALITY=80

echo "🖼️  Starting Image Optimization..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create backup
echo "📦 Creating backup of original images..."
mkdir -p "$IMAGE_DIR/backup"
cp -r "$IMAGE_DIR"/*.{jpg,jpeg,png} "$IMAGE_DIR/backup/" 2>/dev/null || true

# Function to convert images using ImageMagick
convert_with_imagemagick() {
    local input=$1
    local output=$2
    local format=$3
    local quality=$4
    
    if command -v convert &> /dev/null; then
        echo "   Converting $input to $format..."
        convert "$input" -quality "$quality" "$output"
        return 0
    fi
    return 1
}

# Function to convert images using cwebp
convert_to_webp() {
    local input=$1
    local output=$2
    local quality=$3
    
    if command -v cwebp &> /dev/null; then
        echo "   Converting $input to WebP..."
        cwebp "$input" -q "$quality" -o "$output"
        return 0
    else
        convert_with_imagemagick "$input" "$output" "WebP" "$quality"
    fi
}

# Function to convert images using cavif
convert_to_avif() {
    local input=$1
    local output=$2
    local quality=$3
    
    if command -v cavif &> /dev/null; then
        echo "   Converting $input to AVIF..."
        cavif --quality "$quality" "$input" -o "$output"
        return 0
    elif command -v ffmpeg &> /dev/null; then
        echo "   Converting $input to AVIF with ffmpeg..."
        ffmpeg -i "$input" -c:v libaom-av1 -crf $((100 - quality)) -b:v 0 "$output" -y 2>/dev/null
        return 0
    else
        echo "   ⚠️  cavif or ffmpeg not found, skipping AVIF for $input"
        return 1
    fi
}

# Process all images
echo ""
echo "🔄 Converting images to AVIF and WebP..."
for image in "$IMAGE_DIR"/*.{jpg,jpeg,png}; do
    [ -e "$image" ] || continue
    
    filename=$(basename "$image")
    basename_no_ext="${filename%.*}"
    
    echo ""
    echo "📄 Processing: $filename"
    
    # Convert to WebP
    webp_output="$IMAGE_DIR/${basename_no_ext}.webp"
    if [ ! -f "$webp_output" ]; then
        convert_to_webp "$image" "$webp_output" "$WEBP_QUALITY"
    else
        echo "   ⏭️  WebP already exists, skipping"
    fi
    
    # Convert to AVIF
    avif_output="$IMAGE_DIR/${basename_no_ext}.avif"
    if [ ! -f "$avif_output" ]; then
        convert_to_avif "$image" "$avif_output" "$QUALITY"
    else
        echo "   ⏭️  AVIF already exists, skipping"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Image Optimization Complete!"
echo ""
echo "📊 File sizes:"
ls -lh "$IMAGE_DIR"/*.{jpg,jpeg,png,webp,avif} 2>/dev/null | awk '{print $9, "(" $5 ")"}'
echo ""
echo "💡 Tips:"
echo "   1. Original images backed up in: $IMAGE_DIR/backup/"
echo "   2. WebP images are ~30% smaller than JPG"
echo "   3. AVIF images are ~50-60% smaller than JPG"
echo "   4. Modern browsers support both formats automatically"
echo ""
