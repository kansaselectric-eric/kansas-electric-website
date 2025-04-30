# Add main.css to all HTML pages
# This script adds the main.css stylesheet to all HTML pages in the website

Write-Host "Adding main.css to all HTML pages..."

# Get the base directory
$baseDir = $PSScriptRoot

# Counter for modified files
$modifiedCount = 0

# Function to calculate the relative path prefix based on directory depth
function Get-RelativePathPrefix {
    param (
        [string]$filePath,
        [string]$baseDir
    )
    
    $relativePath = $filePath.Replace($baseDir, "").TrimStart("\")
    $depth = ($relativePath.Split("\") | Where-Object { $_ -ne "" }).Count - 1
    
    if ($depth -le 0) {
        return "./"
    }
    else {
        return "../" * $depth
    }
}

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $pathPrefix = Get-RelativePathPrefix -filePath $file.FullName -baseDir $baseDir
    
    # Check if main.css is already included
    if ($content -notmatch "main\.css") {
        Write-Host "Processing $($file.FullName)"
        
        # Add main.css after styles.css
        $newContent = $content -replace '(<link rel="stylesheet" href="[^"]*styles\.css">)', "`$1`n  <link rel=""stylesheet"" href=""$($pathPrefix)assets/css/main.css"">"
        
        # Save the modified content
        Set-Content -Path $file.FullName -Value $newContent
        $modifiedCount++
    }
}

Write-Host "Added main.css to $modifiedCount HTML files."
Write-Host "Process complete!" 