# Undo the final submenu fix
# This script removes the final comprehensive submenu fix that broke the navigation menu

$baseDir = $PSScriptRoot
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse -Include "*.html" | 
    Where-Object { $_.FullName -notlike "*\backup*" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Remove the final comprehensive submenu fix
    $content = $content -replace "(?s)<style>\s*?/\*\s*?Final comprehensive submenu fix.*?</style>", ""
    
    # Save the file if modified
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $modifiedCount++
        Write-Host "  - Removed final fix"
    }
}

Write-Host "Removed final submenu fix from $modifiedCount HTML files" 