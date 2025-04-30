# Update Navigation Script
# This script updates all HTML files to use the new navigation.js file

# Get the current directory where the script is located
$baseDir = $PSScriptRoot

# Counter for modified files
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse

# Define patterns to match different ways navigation.js might be referenced
$patterns = @(
    '<script src="(.*?)assets/js/navigation.js" defer></script>',
    '<script src="(.*?)assets/js/navigation.js"></script>',
    '<script src="(.*?)js/navigation.js" defer></script>',
    '<script src="(.*?)js/navigation.js"></script>'
)

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $modified = $false
    
    # Try each pattern
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            # Extract the path prefix and use it in the replacement
            $pathPrefix = $matches[1]
            $replacement = "<script src=`"$pathPrefix" + "assets/js/navigation-fixed.js`" defer></script>"
            $content = $content -replace $pattern, $replacement
            $modified = $true
        }
    }
    
    # Fallback for any other format not caught by the patterns
    if (-not $modified -and $content -match "navigation.js") {
        $content = $content -replace "navigation.js", "navigation-fixed.js"
        $modified = $true
    }
    
    # Save the file if modified
    if ($modified) {
        $content | Set-Content -Path $file.FullName
        $modifiedCount++
    }
}

Write-Host "Updated navigation script reference in $modifiedCount HTML files" 