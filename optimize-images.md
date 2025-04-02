# Image Optimization Guide

## Converting Images to WebP Format

WebP provides superior compression compared to PNG and JPEG. For optimal website performance, convert all your PNG/JPEG images to WebP.

### Using Command Line Tools

If you have ImageMagick installed:

```bash
# Convert all JPG images to WebP (in current directory)
for img in *.jpg; do
  convert "$img" -quality 85 "${img%.*}.webp"
done

# Convert all PNG images to WebP (in current directory)
for img in *.png; do
  convert "$img" -quality 85 "${img%.*}.webp"
done
```

### Using Online Tools

If you don't have command line tools, you can use these online services:
- [Squoosh](https://squoosh.app/) - Free browser-based image compression
- [TinyPNG](https://tinypng.com/) - Great for PNG compression
- [Convertio](https://convertio.co/) - Supports WebP conversion

### Implementation in React

Update your React components to use WebP with fallbacks:

```jsx
<picture>
  <source srcSet="/path/to/image.webp" type="image/webp" />
  <source srcSet="/path/to/image.jpg" type="image/jpeg" /> 
  <img src="/path/to/image.jpg" alt="Description" />
</picture>
```

## Image Size Recommendations

For optimal performance, resize your images to match their displayed size:

| Image Type | Desktop Width | Mobile Width | Format |
|------------|---------------|--------------|--------|
| Hero Banner | 1600px max | 800px max | WebP |
| Thumbnails | 400px max | 300px max | WebP |
| Icons | 100px max | 80px max | SVG or WebP |
| Background | 1920px max | 768px max | WebP |

## Performance Testing

After optimizing your images, test your site's performance using:
1. Google PageSpeed Insights
2. Chrome DevTools Lighthouse
3. WebPageTest.org

## Implementation Checklist

- [ ] Convert all PNG/JPG to WebP
- [ ] Add proper fallbacks for browsers that don't support WebP
- [ ] Use responsive images with srcset
- [ ] Lazy load images below the fold
- [ ] Set proper width and height attributes
- [ ] Add descriptive alt text
- [ ] Optimize SVG files