# Missing Pages Creator

This tool creates blank template pages for all submenu items in the Kansas Electric website navigation menu. The template pages include the site header with the ticker, the navigation menu with all four submenus, a blank body section, and the footer.

## What This Tool Does

1. Creates a blank template page for each submenu item that doesn't already have a page
2. Sets up the correct directory structure for all pages
3. Adjusts relative paths based on directory depth
4. Prepares pages for the navigation menu and ticker to be added by the update-navigation script

## How to Use

1. **Step 1:** Make sure the `template-page.html` file is in the same directory as the scripts
2. **Step 2:** Double-click the `create-missing-pages.bat` file to run the script
3. **Step 3:** The script will create all missing pages and display a summary of created and skipped pages
4. **Step 4:** After the pages are created, run the `update-navigation.bat` file to update the navigation menu and ticker on all pages

## Technical Details

- The script reads the `template-page.html` file as a template for all new pages
- It calculates the correct relative path prefix (`./`, `../`, `../../`, etc.) based on the directory depth
- It replaces the page title and description with appropriate values for each page
- The script skips existing files to avoid overwriting any custom content

## Pages Created

The script creates pages for all submenu items in the navigation menu, including:

- Services pages (Industrial, Commercial, Service and Maintenance, Automation)
- Project pages (All Projects, Industrial, Commercial, Service, Automation)
- About pages (Who We Are, Company News)
- Career pages (Administrative, Project Management, Electricians, Engineering, Estimating, Apprenticeships)
- Contact pages (Request a Bid)

## Requirements

- Windows operating system
- PowerShell 5.0 or higher

## Troubleshooting

- If the script fails to run, make sure PowerShell execution policy allows running scripts
- If pages are created but don't have the navigation menu, make sure to run the `update-navigation.bat` file after creating the pages
- If you need to recreate a page, delete the existing file first, then run the script again 