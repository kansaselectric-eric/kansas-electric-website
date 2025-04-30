# Responsive Typography Implementation

## Overview

This update ensures all text is properly sized for mobile devices (screens under 768px), maintaining a minimum font size of 16px for better readability. The desktop text sizes remain completely unchanged.

## Features

- **Mobile-Only Adjustments**: Only affects screens smaller than 768px
- **Minimum Font Size**: Ensures all text is at least 16px on mobile for better readability
- **Preserves Desktop Typography**: No changes to font sizes on desktop screens
- **Responsive Scaling**: Headings scale proportionally for mobile screens
- **Improved Button Sizes**: Makes interactive elements easier to tap on mobile

## Implementation Details

### 1. Responsive Typography CSS (`responsive-typography.css`)

The CSS file contains media queries that only apply to screens smaller than 768px, ensuring:

- Body text has a minimum font size of 16px
- Paragraphs, list items, and other text elements maintain readable sizes
- Small text classes (like `.small`, `.text-sm`) are increased to 16px minimum
- Headings are scaled proportionally but never below readable sizes
- Buttons and interactive elements are properly sized for touch screens

### 2. Implementation Script

The PowerShell script (`add-responsive-typography.ps1`) automatically adds the necessary CSS file to all HTML pages in the website:

- Calculates the correct relative path for each file
- Adds the CSS link after existing stylesheets
- Prevents duplicate additions

## Usage

1. Run `add-responsive-typography.bat` to apply the responsive typography styles to all HTML files
2. Test the website on mobile devices to verify that all text is properly sized
3. Make any desired style adjustments in the `responsive-typography.css` file

## Technical Notes

- Uses the CSS `min()` function to ensure text is never below 16px
- Implements `!important` to override any conflicting inline styles
- Targets both HTML elements and common CSS class names
- Provides styling for CSS variables that might control font size

## Customization

If you need to customize the responsive behavior:

1. **Minimum Font Size**: Change the `16px` values to your preferred minimum size
2. **Breakpoint**: Change `@media (max-width: 767px)` to adjust when responsive behavior activates
3. **Heading Sizes**: Modify the heading font sizes to match your design preferences

## Benefits

- Improves readability for mobile users
- Enhances accessibility for users with vision impairments
- Makes interactive elements easier to tap
- Maintains design integrity across different screen sizes
- Follows mobile design best practices for typography 