# PWA Icon Generation Instructions

## Required Icons

You need to create the following icon files with a **dark red background** (#0a0404):

### Icon Specifications

1. **icon-192x192.png** (192x192 pixels)
   - Location: `assets/icons/icon-192x192.png`
   - Purpose: Standard PWA icon
   - Background: #0a0404 (dark red)
   - Logo: Centered, scaled appropriately

2. **icon-512x512.png** (512x512 pixels)
   - Location: `assets/icons/icon-512x512.png`
   - Purpose: High-resolution PWA icon
   - Background: #0a0404 (dark red)
   - Logo: Centered, scaled appropriately

3. **apple-touch-icon.png** (180x180 pixels)
   - Location: `assets/icons/apple-touch-icon.png`
   - Purpose: iOS home screen icon
   - Background: #0a0404 (dark red)
   - Logo: Centered, scaled appropriately

4. **favicon-32x32.png** (32x32 pixels)
   - Location: `assets/icons/favicon-32x32.png`
   - Purpose: Browser tab icon
   - Background: #0a0404 (dark red)
   - Logo: Centered, scaled to fit

5. **favicon-16x16.png** (16x16 pixels)
   - Location: `assets/icons/favicon-16x16.png`
   - Purpose: Browser tab icon (small)
   - Background: #0a0404 (dark red)
   - Logo: Centered, scaled to fit

## Design Guidelines

- **Background Color**: Use #0a0404 (dark red matching the app theme)
- **Logo**: Use the existing `assets/logo.png` as the base
- **Padding**: Leave ~10-15% padding around the logo for breathing room
- **Format**: PNG with transparency support (though background should be solid)

## Quick Generation with ImageMagick

If you have ImageMagick installed, you can use these commands:

```bash
# Create icons directory
mkdir -p assets/icons

# Generate 512x512 icon
convert assets/logo.png -resize 420x420 -background "#0a0404" -gravity center -extent 512x512 assets/icons/icon-512x512.png

# Generate 192x192 icon
convert assets/logo.png -resize 160x160 -background "#0a0404" -gravity center -extent 192x192 assets/icons/icon-192x192.png

# Generate Apple touch icon (180x180)
convert assets/logo.png -resize 150x150 -background "#0a0404" -gravity center -extent 180x180 assets/icons/apple-touch-icon.png

# Generate favicon 32x32
convert assets/logo.png -resize 26x26 -background "#0a0404" -gravity center -extent 32x32 assets/icons/favicon-32x32.png

# Generate favicon 16x16
convert assets/logo.png -resize 12x12 -background "#0a0404" -gravity center -extent 16x16 assets/icons/favicon-16x16.png
```

## Alternative: Online Tools

If you don't have ImageMagick, you can use online tools:

1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload your logo
   - Set background color to #0a0404
   - Generate all required sizes

2. **PWA Asset Generator** (https://www.pwabuilder.com/imageGenerator)
   - Upload logo
   - Set background color
   - Download generated icons

## Manual Creation

Using any image editor (Photoshop, GIMP, Figma, etc.):

1. Create a new canvas with the required dimensions
2. Fill background with #0a0404
3. Place and center the logo
4. Scale logo to ~80-85% of canvas size
5. Export as PNG

## Verification

After creating the icons, verify:
- ✅ All files exist in `assets/icons/` directory
- ✅ Background color is #0a0404 (dark red)
- ✅ Logo is centered and properly scaled
- ✅ PNG format with correct dimensions
- ✅ No white backgrounds or transparency issues

## Testing

1. Clear browser cache
2. Reload the app
3. Check browser tab for favicon
4. On mobile: Add to home screen
5. Verify icon appears with red background (not white)
