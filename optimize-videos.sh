#!/bin/bash

# Create optimized directory if it doesn't exist
mkdir -p public/optimized

# Function to optimize WebM files
optimize_webm() {
  input_file=$1
  filename=$(basename "$input_file")
  output_file="public/optimized/$filename"
  
  echo "Optimizing $input_file to $output_file"
  
  # Using FFmpeg to optimize the WebM file:
  # -c:v libvpx-vp9: Use VP9 codec (better compression than VP8)
  # -b:v: Bitrate (lower = smaller file, but potential quality loss)
  # -crf: Constant Rate Factor (higher = more compression)
  # -deadline: Encoding speed (good is a balance between speed and quality)
  # -cpu-used: CPU usage (higher = faster encoding but potentially lower quality)
  # -auto-alt-ref 1: Enable use of alternate reference frames
  # -lag-in-frames 25: Number of frames to look ahead for optimal compression
  ffmpeg -i "$input_file" -c:v libvpx-vp9 -b:v 0.5M -crf 30 -deadline good -cpu-used 2 -auto-alt-ref 1 -lag-in-frames 25 -c:a libopus -b:a 64k -f webm "$output_file" -y
  
  # Get file sizes for comparison
  original_size=$(du -h "$input_file" | cut -f1)
  new_size=$(du -h "$output_file" | cut -f1)
  
  echo "Original size: $original_size, Optimized size: $new_size"
}

# Loop through all WebM files in public directory
for file in public/*.webm; do
  if [ -f "$file" ]; then
    optimize_webm "$file"
  fi
done

echo "Optimization complete! Optimized files are in the public/optimized directory."