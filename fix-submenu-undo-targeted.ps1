# Undo the targeted submenu fix
# This script removes the targeted submenu fix that broke the navigation menu

$baseDir = $PSScriptRoot
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse | 
    Where-Object { $_.FullName -notlike "*\backup*" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Remove the targeted submenu fix
    $content = $content -replace "(?s)<style>\s*?/\*\s*?Targeted submenu vertical position fix.*?</style>", ""
    
    # Save the file if modified
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $modifiedCount++
        Write-Host "  - Removed targeted fix"
    }
}

Write-Host "Removed targeted submenu fix from $modifiedCount HTML files" 