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

Write-Host "Found $totalFiles HTML files to process" -ForegroundColor Green
Write-Host "Starting path conversion..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $htmlFiles) {
    $processedFiles++
    $percentComplete = [math]::Round(($processedFiles / $totalFiles) * 100)
    Write-Progress -Activity "Converting Paths" -Status "Processing $($file.Name)" -PercentComplete $percentComplete
    
    # Get the relative path prefix for this file
    $relativePrefix = Get-RelativePrefix -FilePath $file.FullName
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
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
        Write-Host "  ✓ Fixed paths in $($file.Name)" -ForegroundColor Green
    }
    else {
        Write-Host "  - No changes needed in $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Path conversion complete!" -ForegroundColor Green
Write-Host "Modified $changedFiles out of $totalFiles files" -ForegroundColor Cyan
Write-Host ""

# Create a log file with summary
$logContent = "Path Conversion Summary`r`n"
$logContent += "======================`r`n"
$logContent += "Date: $(Get-Date)`r`n"
$logContent += "Total files processed: $totalFiles`r`n"
$logContent += "Files modified: $changedFiles`r`n"

$logPath = Join-Path -Path $PSScriptRoot -ChildPath "path-conversion-log.txt"
Set-Content -Path $logPath -Value $logContent

Write-Host "Log file created: path-conversion-log.txt" -ForegroundColor Yellow 