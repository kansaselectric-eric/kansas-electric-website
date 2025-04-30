# PowerShell script to fix absolute paths in website files
# This script converts all absolute paths to relative paths

# Function to determine the relative path prefix based on the file's location
function Get-RelativePrefix {
    param (
        [string]$FilePath
    )
    
    # Count the number of directory levels from the root
    $relativePath = $FilePath.Replace($PSScriptRoot, "").TrimStart("\")
    $depth = ($relativePath.Split("\") | Where-Object { $_ -ne "" }).Count - 1  # Subtract 1 because the filename itself is counted
    
    if ($depth -le 0) {
        # Root level files (like index.html in the root)
        return "./"
    }
    else {
        # For files in subdirectories, add ../ for each level
        return "../" * $depth
    }
}

# Get all HTML files in the website
$htmlFiles = Get-ChildItem -Path $PSScriptRoot -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
$processedFiles = 0
$changedFiles = 0

Write-Host "Found $totalFiles HTML files to process"
Write-Host "Starting path conversion..."
Write-Host ""

foreach ($file in $htmlFiles) {
    $processedFiles++
    Write-Host "Processing $($file.Name)..."
    
    # Get the relative path prefix for this file
    $relativePrefix = Get-RelativePrefix -FilePath $file.FullName
    Write-Host "  Relative prefix: $relativePrefix"
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Check for absolute URLs with localhost
    $localhostMatches = [regex]::Matches($content, 'http://127\.0\.0\.1:8003/')
    if ($localhostMatches.Count -gt 0) {
        Write-Host "  Found $($localhostMatches.Count) localhost URLs"
    }
    
    # Check for absolute paths starting with /
    $absolutePathMatches = [regex]::Matches($content, '(href|src)="/')
    if ($absolutePathMatches.Count -gt 0) {
        Write-Host "  Found $($absolutePathMatches.Count) absolute paths in href/src attributes"
    }
    
    # Check for absolute paths in meta content attributes
    $metaContentMatches = [regex]::Matches($content, '(content)="/')
    if ($metaContentMatches.Count -gt 0) {
        Write-Host "  Found $($metaContentMatches.Count) absolute paths in meta content attributes"
    }
    
    # Replace absolute URLs with localhost
    $content = $content -replace 'http://127\.0\.0\.1:8003/', $relativePrefix
    
    # Replace absolute paths starting with / for resources
    $content = $content -replace '(href|src)="/', "`$1=`"$relativePrefix"
    
    # Also handle content= attributes in meta tags
    $content = $content -replace '(content)="/', "`$1=`"$relativePrefix"
    
    # Save the modified content back to the file if changes were made
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $changedFiles++
        Write-Host "  ✓ Fixed paths in $($file.Name)"
    }
    else {
        Write-Host "  - No changes needed in $($file.Name)"
    }
    
    Write-Host ""
}

Write-Host ""
Write-Host "Path conversion complete!"
Write-Host "Modified $changedFiles out of $totalFiles files" 