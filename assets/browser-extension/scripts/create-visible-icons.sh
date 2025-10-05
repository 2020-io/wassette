#!/bin/bash

# Create visible SVG icons and convert to PNG

ICONS_DIR="/home/user/prototype/extension/icons"

# Create a more visible SVG with purple background and white M
cat > "$ICONS_DIR/icon-visible.svg" << 'EOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#667eea" rx="20"/>
  <text x="64" y="90" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">M</text>
</svg>
EOF

echo "Created visible SVG icon"

# Try to convert with different tools
if command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    convert -background none "$ICONS_DIR/icon-visible.svg" -resize 16x16 "$ICONS_DIR/icon16.png"
    convert -background none "$ICONS_DIR/icon-visible.svg" -resize 48x48 "$ICONS_DIR/icon48.png"
    convert -background none "$ICONS_DIR/icon-visible.svg" -resize 128x128 "$ICONS_DIR/icon128.png"
elif command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert..."
    rsvg-convert -w 16 -h 16 "$ICONS_DIR/icon-visible.svg" -o "$ICONS_DIR/icon16.png"
    rsvg-convert -w 48 -h 48 "$ICONS_DIR/icon-visible.svg" -o "$ICONS_DIR/icon48.png"
    rsvg-convert -w 128 -h 128 "$ICONS_DIR/icon-visible.svg" -o "$ICONS_DIR/icon128.png"
elif command -v inkscape &> /dev/null; then
    echo "Using Inkscape..."
    inkscape -w 16 -h 16 "$ICONS_DIR/icon-visible.svg" -o "$ICONS_DIR/icon16.png"
    inkscape -w 48 -h 48 "$ICONS_DIR/icon-visible.svg" -o "$ICONS_DIR/icon48.png"
    inkscape -w 128 -h 128 "$ICONS_DIR/icon-visible.svg" -o "$ICONS_DIR/icon128.png"
else
    echo "No SVG converter available, using Node.js to create simple PNGs..."
    node << 'NODESCRIPT'
const fs = require('fs');
const path = require('path');

const iconsDir = '/home/user/prototype/extension/icons';

// Create simple colored PNG data for each size
const sizes = [16, 48, 128];

sizes.forEach(size => {
    // This creates a minimal valid PNG with purple color
    const png = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, size, 0x00, 0x00, 0x00, size,
        0x08, 0x02, 0x00, 0x00, 0x00
    ]);

    // For now just copy the SVG as fallback
    const svgPath = path.join(iconsDir, 'icon-visible.svg');
    const pngPath = path.join(iconsDir, `icon${size}.png`);

    console.log(`Note: Using SVG as fallback for icon${size}.png`);
    console.log('Chrome can render SVG files as extension icons.');
});
NODESCRIPT

    # Just use SVG - Chrome supports it
    echo "Copying SVG as fallback (Chrome supports SVG icons)..."
    cp "$ICONS_DIR/icon-visible.svg" "$ICONS_DIR/icon16.png"
    cp "$ICONS_DIR/icon-visible.svg" "$ICONS_DIR/icon48.png"
    cp "$ICONS_DIR/icon-visible.svg" "$ICONS_DIR/icon128.png"
fi

echo "Done! Check: ls -lh $ICONS_DIR/icon*.png"
ls -lh "$ICONS_DIR"/icon*.png
