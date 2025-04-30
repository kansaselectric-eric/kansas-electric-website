# Mobile Hamburger Menu Implementation

## Overview

This update adds a modern, responsive hamburger menu to the Kansas Electric website for mobile devices (screens under 768px). The desktop navigation experience remains completely unchanged.

## Features

- **Responsive Design**: Only affects mobile views (under 768px), preserving desktop experience
- **Smooth Animation**: CSS transitions for professional sliding and fading effects
- **Hierarchical Navigation**: Properly displays multi-level menu structure
- **Touch-Friendly**: Optimized for mobile interaction with appropriate touch targets
- **Accessibility**: Proper ARIA attributes and keyboard navigation support

## Implementation Details

### 1. Mobile Hamburger CSS (`mobile-hamburger.css`)

The CSS file contains all styles for the mobile hamburger menu, including:

- Hamburger button styling and animation
- Sliding drawer menu layout and transitions
- Submenu toggle animations
- Background overlay styling
- Mobile-specific layout adjustments

All styles are wrapped in a media query (`@media (max-width: 767px)`) to ensure they only apply to mobile devices.

### 2. Mobile Hamburger JavaScript (`mobile-hamburger.js`)

The JavaScript file provides the interactive functionality:

- Dynamically creates the hamburger button and overlay
- Handles menu open/close toggling
- Manages submenu expansion/collapse
- Provides keyboard accessibility (Escape key to close)
- Handles window resize events to reset menu state

### 3. Implementation Script

The PowerShell script (`add-mobile-hamburger.ps1`) automatically adds the necessary CSS and JavaScript files to all HTML pages in the website:

- Calculates the correct relative path for each file
- Adds the CSS link after the last stylesheet
- Adds the JavaScript before the closing body tag
- Prevents duplicate additions

## How It Works

1. **On Mobile Devices**:
   - The default navigation is hidden
   - A hamburger icon appears in the header
   - Clicking the hamburger opens a sliding drawer menu
   - Top-level menu items toggle their submenus
   - A semi-transparent overlay appears behind the menu

2. **On Desktop**:
   - The hamburger menu is completely inactive
   - The original desktop navigation works as before
   - No JavaScript or CSS conflicts occur

## Usage

1. Run `add-mobile-hamburger.bat` to apply the mobile hamburger menu to all HTML files
2. Test the website on mobile devices to verify the hamburger menu functionality
3. Make any desired style adjustments in the `mobile-hamburger.css` file

## Mobile Menu Structure

The mobile menu preserves the existing menu structure but displays it in a more mobile-friendly way:

```
├── Top-level item (e.g., "Services") 
│   ├── Second-level item (e.g., "Industrial Electrical")
│   │   └── Third-level items (specific services)
│   ├── Second-level item (e.g., "Commercial Electrical")
│   │   └── Third-level items (specific services)
│   └── ...
├── Top-level item (e.g., "Projects")
│   └── ...
└── ...
```

## Browser Compatibility

This implementation is compatible with all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- iOS Safari and Android Chrome
- Internet Explorer 11 with minor visual differences

## Technical Notes

- Uses CSS transitions for smooth animations rather than JavaScript
- Dynamically creates necessary elements to avoid HTML modifications
- Preserves all existing navigation classes and IDs
- Uses feature detection for maximum compatibility
- Resets menu state on window resize to prevent display issues

## Customization

If you need to customize the appearance or behavior:

1. **Colors & Styling**: Edit the relevant CSS in `mobile-hamburger.css`
2. **Animation Speed**: Adjust the `transition` property values (e.g., `0.3s`)
3. **Drawer Width**: Modify the `width` and `max-width` properties of `.main-navigation` 