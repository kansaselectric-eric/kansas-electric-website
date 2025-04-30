# Improved PowerShell script to fix absolute paths in website files

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
    Write-Host "Processing $($file.Name) in $($file.DirectoryName)"
    
    # Get the relative path prefix for this file
    $relativePrefix = Get-RelativePrefix -FilePath $file.FullName
    Write-Host "  Relative prefix: $relativePrefix"
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Replace absolute URLs with localhost
    $content = $content -replace 'http://127\.0\.0\.1:8003/', $relativePrefix
    
    # Replace absolute paths starting with / for resources
    $content = $content -replace '(href|src)="/', "`$1=`"$relativePrefix"
    $content = $content -replace '(content)="/', "`$1=`"$relativePrefix"
    
    # Fix incorrect relative paths in subdirectories
    # This is the key improvement - we need to fix paths that start with ./ in subdirectories
    if ($relativePrefix -ne "./") {
        # Replace ./ with the correct relative prefix
        $content = $content -replace '(href|src)="\./', "`$1=`"$relativePrefix"
        
        # Also fix paths in CSS and other resources
        $content = $content -replace '(href|src)="(\.\./)+(assets|apple-touch|favicon|site\.webmanifest)', {
            $prefix = $relativePrefix
            $resource = $matches[3]
            "href=`"$prefix$resource"
        }
    }
    
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