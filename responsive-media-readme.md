# Responsive Media Implementation

## Overview

This update adds responsive media support to ensure that all images, videos, and iframes scale properly on mobile devices (screens under 768px). The desktop experience remains completely unchanged.

## Features

- **Mobile-Only Styling**: Only affects screens smaller than 768px
- **Automatic Scaling**: All media elements scale down proportionally on small screens
- **Preserves Original Styling**: No changes to appearance on desktop-sized screens
- **Universal Coverage**: Affects all images, videos, and iframes across the site

## Implementation Details

### 1. Responsive Media CSS (`responsive-media.css`)

The CSS file contains media queries that only apply to screens smaller than 768px, ensuring:

- All images have `max-width: 100%` and `height: auto`
- All videos have `max-width: 100%` and `height: auto`
- All iframes have `max-width: 100%` and `height: auto`
- Common container classes that might hold media elements are properly sized
- WordPress block elements for media are responsive

### 2. Implementation Script

The PowerShell script (`add-responsive-media.ps1`) automatically adds the necessary CSS file to all HTML pages in the website:

- Calculates the correct relative path for each file
- Adds the CSS link after existing stylesheets
- Prevents duplicate additions

## Usage

1. Run `add-responsive-media.bat` to apply the responsive media styles to all HTML files
2. Test the website on mobile devices to verify that images, videos, and iframes scale properly
3. Make any desired style adjustments in the `responsive-media.css` file

## Technical Notes

- Uses CSS `max-width` and `height: auto` to maintain aspect ratio
- Implements `!important` to override any conflicting inline styles
- Targets common container elements that might hold media content
- Uses media queries to ensure desktop styling remains unchanged

## Customization

If you need to customize the responsive behavior:

1. **Breakpoint**: Change `@media (max-width: 767px)` to adjust when responsive behavior activates
2. **Additional Elements**: Add more selectors to target specific content on your site
3. **Container Elements**: Modify the container selectors if you use different naming conventions

## Benefits

- Prevents horizontal scrolling on mobile devices
- Improves readability of content on small screens
- Maintains proper aspect ratios of media elements
- Creates a better mobile user experience 