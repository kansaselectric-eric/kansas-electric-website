# Kansas Electric Website Maintenance Scripts

This repository contains a collection of PowerShell and batch scripts designed to automate common maintenance tasks for the Kansas Electric website.

## Scripts Overview

### 1. Adding CSS and JavaScript Files (`add-scripts.ps1` and `add-scripts.bat`)

**Purpose:** Automatically adds the main CSS file, jQuery, and navigation JavaScript to all HTML pages.

**Features:**
- Adds `main.css` to the head section
- Adds jQuery and navigation.js to the body
- Excludes files in the backup-html directory
- Counts and reports the number of modified files

**Usage:**
```
.\add-scripts.bat
```

### 2. Adding Footer Content (`add-footer.ps1` and `add-footer.bat`)

**Purpose:** Extracts footer content from the main index.html file and adds it to all newly created pages.

**Features:**
- Extracts the footer section from index.html
- Replaces placeholder footers in newly created pages
- Maintains consistent footer structure across the website
- Includes logo, social media links, and service details

**Usage:**
```
.\add-footer.bat
```

### 3. Fixing Submenu Positioning (`fix-submenu-direct.ps1` and `fix-submenu-direct.bat`)

**Purpose:** Adjusts the CSS for submenu positioning in newly created pages to ensure proper alignment.

**Features:**
- Ensures submenus start at the bottom of the navigation menu
- Aligns submenus to the left side of the screen
- Applies consistent styling across all pages
- Processes files in services, projects, about, careers, and contact directories

**CSS Modifications:**
- Sets submenu position to fixed with top: 80px
- Aligns submenu to the left edge of the screen
- Adjusts z-index for proper layering
- Ensures proper padding and margins

**Usage:**
```
.\fix-submenu-direct.bat
```

## Technical Details

### File Structure

- `.ps1` files: PowerShell scripts containing the main logic
- `.bat` files: Batch files for easy execution of PowerShell scripts
- `README.md` files: Documentation for each script

### Requirements

- Windows operating system
- PowerShell 5.0 or higher
- Administrative privileges may be required to execute scripts

## Troubleshooting

If you encounter issues with script execution:

1. Ensure PowerShell execution policy allows script execution:
   ```
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   ```

2. Check file paths and ensure the scripts are run from the website root directory

3. Verify that the HTML files follow the expected structure for the scripts to work properly

## Maintenance

These scripts should be run whenever:

1. New HTML pages are created
2. The website structure is modified
3. Updates to the footer or navigation are needed

## Contact

For questions or issues regarding these scripts, please contact the website administrator. 