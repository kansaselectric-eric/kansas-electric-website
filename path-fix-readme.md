# Path Fixing Scripts

These scripts are designed to convert all absolute paths in the website files to relative paths.

## What the Scripts Fix

1. Absolute URLs with `http://127.0.0.1:8003/` in meta tags (og:url, og:image, etc.)
2. Resource paths starting with `/` (like `/assets/css/main.css`, `/assets/img/...`, etc.)
3. Incorrect relative paths in subdirectories (like `./assets/css/main.css` in subdirectories)

## How to Use

1. Simply double-click the `fix-paths.bat` file to run the script
2. The script will automatically:
   - Find all HTML files in the website
   - Calculate the correct relative path for each file based on its location
   - Replace all absolute paths with the appropriate relative paths
   - Fix incorrect relative paths in subdirectories
   - Save the changes back to the files

## Technical Details

The script works by:
1. Determining how many directory levels deep each file is from the root
2. Calculating the appropriate relative path prefix (e.g., `./`, `../`, `../../`, etc.)
3. Replacing all absolute paths with the calculated relative path
4. For files in subdirectories, also replacing incorrect relative paths that start with `./` with the correct relative path

## Example Conversions

For a file at the root level (e.g., `index.html`):
- `/assets/css/main.css` → `./assets/css/main.css`
- `http://127.0.0.1:8003/assets/img/example.jpg` → `./assets/img/example.jpg`

For a file one level deep (e.g., `about/index.html`):
- `/assets/css/main.css` → `../assets/css/main.css`
- `http://127.0.0.1:8003/assets/img/example.jpg` → `../assets/img/example.jpg`
- `./assets/css/main.css` → `../assets/css/main.css` (fixing incorrect relative paths)

For a file two levels deep (e.g., `services/automation/index.html`):
- `/assets/css/main.css` → `../../assets/css/main.css`
- `http://127.0.0.1:8003/assets/img/example.jpg` → `../../assets/img/example.jpg`
- `./assets/css/main.css` → `../../assets/css/main.css` (fixing incorrect relative paths)

## Troubleshooting

If you encounter any issues with the website after running the script:
1. Check if all pages are loading correctly
2. Inspect any broken links or missing resources
3. Run the script again if needed 