# Navigation Menu and Ticker Update Script

This script updates the navigation menu and ticker on all HTML pages in your website to match the one from `index.html`. This ensures a consistent navigation experience across your entire site.

## What This Script Does

1. Extracts the navigation menu and ticker from `index.html`
2. Applies them to all other HTML pages in your website
3. Automatically adjusts relative paths based on directory depth
4. Adds necessary JavaScript and CSS for proper functionality

## How to Use

1. Make sure your navigation menu and ticker in `index.html` are exactly how you want them
2. Double-click the `update-navigation.bat` file
3. Wait for the script to complete
4. Check your website to ensure all pages have the updated navigation and ticker

## Technical Details

- **Path Adjustment**: Automatically adjusts paths in the navigation menu and ticker based on the directory depth of each page
- **JavaScript Inclusion**: Adds the necessary JavaScript for the navigation menu and ticker functionality
- **CSS Styles**: Ensures all required CSS styles are included in each page
- **Submenu Support**: Preserves the submenu functionality across all pages

## Troubleshooting

1. If the navigation menu is not appearing correctly, check that the navigation HTML in `index.html` follows the expected structure
2. If the submenu is not spanning the full width, ensure the CSS styles are properly included
3. If the ticker is not appearing correctly, check that the ticker HTML in `index.html` follows the expected structure
4. If JavaScript errors occur, check the browser console for specific error messages

## How It Works

1. Extract the navigation menu and ticker from `index.html` using string manipulation
2. Find all HTML files in the website directory and subdirectories
3. Adjust all paths in the navigation menu and ticker to use the correct relative paths
4. Replace the existing navigation menu and ticker in each file with the updated versions
5. Add any necessary JavaScript and CSS that might be missing

## Requirements

- Windows operating system
- PowerShell 5.0 or higher

For any issues or questions, please contact your web developer. 