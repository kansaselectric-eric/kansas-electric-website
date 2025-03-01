# Kansas Electric Website

## Video Carousel Troubleshooting

The website features a video carousel on the homepage that displays three videos in sequence. If you're experiencing issues with the videos not displaying, here are some troubleshooting steps:

### Diagnostic Tools

We've created several diagnostic tools to help identify and fix video playback issues:

1. **Debug Button**: On the homepage, there's a hidden debug button in the bottom right corner of the video carousel. Press the `D` key while on the homepage to reveal this button, then click it to see detailed information about the video loading status.

2. **Direct Video Test**: Open `direct-video-test.html` (or run `open-direct-test.bat`) to test if a single video can play directly without the carousel logic.

3. **Video Fix Test**: Open `video-fix.html` (or run `open-video-fix.bat`) to test an alternative implementation of the video carousel with detailed status information and controls.

### Common Issues and Solutions

1. **Browser Autoplay Restrictions**
   - Most browsers restrict autoplay of videos with sound
   - Solution: All videos are muted by default to allow autoplay

2. **Video Format Compatibility**
   - Not all browsers support all video formats
   - Solution: Use MP4 format which has the widest browser support

3. **File Access Restrictions When Testing Locally**
   - Browsers may restrict access to local files for security reasons
   - Solution: Test using a local server or use the provided test pages

4. **Large Video Files**
   - Large video files may take time to load or fail to load completely
   - Solution: Optimize video files for web (compress to reduce file size)

5. **Z-Index Issues**
   - Videos may be loading but hidden behind other elements
   - Solution: Check CSS z-index values in browser developer tools

### How to Use the Video Fix Test Page

1. Open `video-fix.html` in your browser (or run `open-video-fix.bat`)
2. The page will attempt to load and play the videos using a different approach
3. Use the controls at the bottom to navigate between videos
4. Check the status indicator in the top right for loading information
5. If videos play correctly here but not on the main page, the issue is likely with the carousel implementation

### Checking Video Files

Ensure that the video files exist in the correct location:
- `./assets/videos/video1.mp4`
- `./assets/videos/video2.mp4`
- `./assets/videos/video3.mp4`

### Browser Developer Tools

For advanced troubleshooting:
1. Open your browser's developer tools (F12 or right-click and select "Inspect")
2. Go to the Console tab to check for JavaScript errors
3. Go to the Network tab to see if video files are being loaded correctly

If you continue to experience issues after trying these solutions, please contact the website administrator.

## Video Carousel CSS Fix

We've identified and fixed an issue with the video carousel display. The problem was related to CSS specificity and timing, causing videos to not display properly when the page loads.

### IMPORTANT: Missing Video Files

The video files referenced in the code are missing from the project. For the video carousel to work, you need to add the following video files:

- `assets/videos/video1.mp4`
- `assets/videos/video2.mp4`
- `assets/videos/video3.mp4`

These files should be placed in the `assets/videos/` directory. Without these files, the video carousel will not display any content.

### The Problem

The video carousel was not displaying properly because of CSS specificity and timing issues. When saving or refreshing from the CSS file, the carousel briefly appeared, indicating a CSS specificity or timing problem.

### The Solution

We've implemented three key fixes:

1. **CSS Specificity Fix**: Added `!important` to all video carousel CSS properties to ensure they take precedence over any conflicting styles in main.css
2. **Forced Redraw**: Added a JavaScript mechanism to force the browser to redraw the video elements
3. **Delayed Initialization**: Added code to ensure the carousel is properly set up after all CSS has loaded

### How to Test the Fix

1. Run the `open-css-fix.bat` file to open a test page that demonstrates the fix
2. The test page includes controls to navigate between videos and play/pause functionality
3. Observe that the videos display properly and transition smoothly

### Implementation Details

#### CSS Fix

The most critical part of the fix was ensuring that the video carousel styles have higher specificity than any conflicting styles in main.css:

```css
#video-carousel {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    z-index: 1 !important;
    background-color: #000 !important;
}

#video-carousel video {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    opacity: 0 !important;
    transition: opacity 1s ease-in-out !important;
    visibility: hidden !important;
    z-index: 1 !important;
}

#video-carousel video.active {
    opacity: 1 !important;
    visibility: visible !important;
    z-index: 2 !important;
}
```

#### JavaScript Fix

Added a function to force redraw of elements:

```javascript
function forceRedraw(element) {
    const display = element.style.display;
    element.style.display = 'none';
    void element.offsetHeight; // Force reflow
    element.style.display = display;
}
```

And added delayed initialization:

```javascript
// Force a redraw after a short delay
setTimeout(() => {
    forceRedraw(carousel);
    videos.forEach(video => forceRedraw(video));
}, 100);

// Additional initialization after CSS has fully loaded
setTimeout(() => {
    forceRedraw(carousel);
    const activeVideo = carousel.querySelector('video.active');
    if (activeVideo) {
        activeVideo.style.opacity = '0.99';
        setTimeout(() => {
            activeVideo.style.opacity = '1';
        }, 50);
    }
}, 500);
```

### Applying the Fix to the Main Site

To apply this fix to the main site:

1. Move the video carousel CSS to a separate style block in the index.html file, after the main.css is loaded
2. Add the `!important` declarations to ensure proper specificity
3. Add the JavaScript redraw mechanism to the homepage-carousel.js file
4. Add the delayed initialization code to ensure proper display after CSS loads 