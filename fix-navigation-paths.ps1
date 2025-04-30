# Fix navigation-fixed.js paths in all HTML files in subdirectories
# This script corrects the incorrect $1assets/js/navigation-fixed.js paths to proper relative paths

# Get all HTML files in subdirectories (not in the root)
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse | Where-Object { $_.DirectoryName -ne (Get-Location).Path }

$totalFiles = $htmlFiles.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Found $totalFiles HTML files in subdirectories to process..."

foreach ($file in $htmlFiles) {
    $processedFiles++
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    Write-Host "Processing ($processedFiles/$totalFiles): $relativePath" -NoNewline
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Calculate the relative path depth
    $depth = ($file.DirectoryName.Substring((Get-Location).Path.Length + 1).Split('\').Count)
    $relativePath = "../" * $depth
    
    # Check if the file contains the incorrect path
    if ($content -match '\$1assets/js/navigation-fixed\.js') {
        # Replace the incorrect path with the correct relative path
        $newContent = $content -replace '\$1assets/js/navigation-fixed\.js', "$($relativePath)assets/js/navigation-fixed.js"
        
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        
        $modifiedFiles++
        Write-Host " - FIXED" -ForegroundColor Green
    } else {
        Write-Host " - OK (No issues found)" -ForegroundColor Cyan
    }
}

Write-Host "`nSummary:"
Write-Host "--------"
Write-Host "Total files processed: $processedFiles"
Write-Host "Files modified: $modifiedFiles"
Write-Host "Files already correct: $($processedFiles - $modifiedFiles)"

if ($modifiedFiles -gt 0) {
    Write-Host "`nFixed $modifiedFiles files with incorrect navigation-fixed.js paths." -ForegroundColor Green
    Write-Host "The submenu positioning should now work correctly on all pages." -ForegroundColor Green
} else {
    Write-Host "`nNo files needed fixing. If you're still experiencing issues, there might be another problem." -ForegroundColor Yellow
} 