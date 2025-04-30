# Add main.css and necessary JavaScript files to all HTML pages
# This script adds the main.css stylesheet and required JavaScript files to all HTML pages in the website

Write-Host "Adding main.css and necessary JavaScript files to all HTML pages..."

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

# Get all HTML files, excluding backup directory
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "backup-html" }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $pathPrefix = Get-RelativePathPrefix -filePath $file.FullName -baseDir $baseDir
    $modified = $false
    
    # Check if main.css is already included
    if ($content -notmatch "main\.css") {
        Write-Host "Adding main.css to $($file.FullName)"
        
        # Add main.css after styles.css
        $content = $content -replace '(<link rel="stylesheet" href="[^"]*styles\.css">)', "`$1`n  <link rel=""stylesheet"" href=""$($pathPrefix)assets/css/main.css"">"
        $modified = $true
    }
    
    # Check if jQuery is already included
    if ($content -notmatch "jquery.*\.js") {
        Write-Host "Adding jQuery to $($file.FullName)"
        
        # Add jQuery before the closing head tag
        $content = $content -replace '(</head>)', "  <script src=""$($pathPrefix)assets/js/jquery-3.6.0.min.js""></script>`n`$1"
        $modified = $true
    }
    
    # Check if navigation.js is already included
    if ($content -notmatch "navigation\.js") {
        Write-Host "Adding navigation.js to $($file.FullName)"
        
        # Add navigation.js before the closing head tag
        $content = $content -replace '(</head>)', "  <script src=""$($pathPrefix)assets/js/navigation.js"" defer></script>`n`$1"
        $modified = $true
    }
    
    # Save the modified content if changes were made
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        $modifiedCount++
    }
}

Write-Host "Updated $modifiedCount HTML files."
Write-Host "Process complete!" 