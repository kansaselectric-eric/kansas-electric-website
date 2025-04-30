# CSS and JavaScript Update Tool

This tool adds the main.css stylesheet and necessary JavaScript files to all HTML pages in the Kansas Electric website.

## What This Tool Does

- Adds `main.css` to all HTML pages that don't already include it
- Ensures jQuery is included on all pages
- Adds navigation.js to all pages for proper menu functionality
- Automatically adjusts relative paths based on directory depth
- Preserves existing content and only adds missing resources

## How to Use

1. Ensure you have the following files in your website directory:
   - `add-scripts.ps1` - PowerShell script that adds CSS and JavaScript files
   - `add-scripts.bat` - Batch file for easy execution of the PowerShell script

2. Double-click on `add-scripts.bat` to run the script.

3. The script will:
   - Scan all HTML files in the website directory and subdirectories
   - Add main.css after styles.css if it's not already included
   - Add jQuery if it's not already included
   - Add navigation.js if it's not already included
   - Adjust paths based on directory depth

4. When the script completes, it will display how many files were updated.

## Technical Details

The script works by:

1. Finding all HTML files in the website directory and subdirectories
2. Calculating the relative path prefix based on directory depth
3. Checking if each file already includes main.css, jQuery, and navigation.js
4. Adding any missing resources with the correct relative paths
5. Saving the modified files

## Requirements

- Windows operating system
- PowerShell 5.0 or higher

## Troubleshooting

- If the script doesn't run, make sure PowerShell execution policy allows running scripts
- If paths are incorrect, check that the directory structure matches the expected layout
- If resources are not being added, check that the regex patterns in the script match your HTML structure 