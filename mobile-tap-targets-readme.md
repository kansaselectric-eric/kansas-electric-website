# Mobile Tap Targets Implementation

## Overview

This update improves the usability of buttons and links on mobile devices (screens under 768px) by ensuring they have appropriate tap target sizes. The desktop experience remains completely unchanged.

## Features

- **Mobile-Only Adjustments**: Only affects screens smaller than 768px
- **Proper Tap Target Sizes**: Ensures all interactive elements are at least 48px in height
- **Comfortable Spacing**: Adds appropriate spacing between tap targets
- **Preserves Desktop Styling**: No changes to button or link appearance on desktop screens
- **Comprehensive Coverage**: Improves all types of buttons, links, and interactive elements

## Implementation Details

### 1. Mobile Tap Targets CSS (`mobile-tap-targets.css`)

The CSS file contains media queries that only apply to screens smaller than 768px, ensuring:

- Buttons and button-like elements have a minimum height of 48px
- Navigation links have appropriate tap target sizes
- Links used as buttons have proper sizing and spacing
- Form controls and checkboxes have improved tap targets
- Button groups have proper spacing between elements
- Icon buttons and utility links are sized appropriately

### 2. Implementation Script

The PowerShell script (`add-mobile-tap-targets.ps1`) automatically adds the necessary CSS file to all HTML pages in the website:

- Calculates the correct relative path for each file
- Adds the CSS link after existing responsive CSS files
- Prevents duplicate additions

## Usage

1. Run `add-mobile-tap-targets.bat` to apply the mobile tap target improvements to all HTML files
2. Test the website on mobile devices to verify that buttons and links are properly sized
3. Make any desired style adjustments in the `mobile-tap-targets.css` file

## Technical Notes

- Uses CSS `min-height` and `min-width` to ensure minimum tap target sizes
- Implements `!important` to override any conflicting inline styles
- Targets both HTML elements and common CSS class names
- Maintains proper alignment and visual styling while increasing interactive areas

## Accessibility Benefits

- **Improved Touch Accessibility**: Easier for all users to tap buttons on mobile devices
- **Reduced Error Rate**: Fewer accidental taps on wrong elements
- **Better Experience for Users with Motor Impairments**: Larger targets are easier to hit
- **Complies with WCAG 2.5.5 Target Size (Enhanced)**: Helps meet accessibility standards for tap targets

## Customization

If you need to customize the tap target behavior:

1. **Target Size**: Change the `48px` values to your preferred minimum size (minimum recommended is 44px)
2. **Spacing**: Adjust the margin and padding values to change spacing between elements
3. **Breakpoint**: Change `@media (max-width: 767px)` to adjust when responsive behavior activates

## Benefits

- Improves mobile usability significantly
- Reduces user frustration on touch devices
- Follows mobile design best practices
- Makes the website more accessible
- Maintains design integrity while improving function 