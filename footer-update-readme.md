# Footer Update Tool

This tool adds the footer content from the main `index.html` file to all HTML pages that have a placeholder footer.

## What This Tool Does

- Extracts the complete footer content from `index.html`
- Identifies HTML pages with placeholder footers
- Adjusts relative paths in the footer content based on the directory depth
- Replaces placeholder footers with the actual footer content
- Preserves all links, images, and styling in the footer

## How to Use

1. Ensure that `index.html` has the complete footer content you want to use
2. Run the `add-footer.bat` file by double-clicking it
3. Wait for the script to complete
4. Check the console output to see how many files were updated

## Technical Details

The script works by:
1. Reading the footer content from `index.html`
2. Finding all HTML files with a placeholder footer (containing the comment "Footer will be added by the update-navigation script")
3. Calculating the relative path prefix based on the directory depth
4. Adjusting all paths in the footer content to use the correct relative paths
5. Replacing the placeholder footer with the adjusted footer content

## Requirements

- Windows operating system
- PowerShell 5.0 or higher

## Troubleshooting

- If no files are updated, check that your HTML files have the placeholder footer comment
- If paths in the footer are incorrect, verify that the script is correctly calculating the directory depth
- If the script fails to extract the footer, check that `index.html` has a properly formatted footer section 