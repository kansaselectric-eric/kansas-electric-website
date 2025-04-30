# PowerShell script to update navigation menu and ticker on all HTML pages
# This script extracts the navigation menu and ticker from index.html and applies it to all other HTML pages

# Function to get the relative path prefix based on directory depth
function Get-RelativePathPrefix {
    param (
        [string]$filePath
    )
    
    # Count the number of directory levels
    $depth = ($filePath.Split([IO.Path]::DirectorySeparatorChar) | Where-Object { $_ -ne "" }).Count - 1
    
    if ($depth -eq 0) {
        return "./"
    }
    else {
        $prefix = ""
        for ($i = 0; $i -lt $depth; $i++) {
            $prefix += "../"
        }
        return $prefix
    }
}

# Function to adjust paths in the navigation based on the file's depth
function Adjust-NavigationPaths {
    param (
        [string]$navigationHtml,
        [string]$pathPrefix
    )
    
    if ($pathPrefix -eq "./") {
        # For root level files, no adjustment needed
        return $navigationHtml
    }
    
    # Replace paths that start with ./ to use the correct relative path
    $adjustedHtml = $navigationHtml -replace 'href="\./', "href=`"$pathPrefix"
    
    # Replace paths that don't have a prefix but should (assets, services, etc.)
    $adjustedHtml = $adjustedHtml -replace 'href="assets/', "href=`"$pathPrefix`assets/"
    $adjustedHtml = $adjustedHtml -replace 'src="assets/', "src=`"$pathPrefix`assets/"
    
    # Replace other root-level paths
    $adjustedHtml = $adjustedHtml -replace 'href="services/', "href=`"$pathPrefix`services/"
    $adjustedHtml = $adjustedHtml -replace 'href="projects/', "href=`"$pathPrefix`projects/"
    $adjustedHtml = $adjustedHtml -replace 'href="about/', "href=`"$pathPrefix`about/"
    $adjustedHtml = $adjustedHtml -replace 'href="careers/', "href=`"$pathPrefix`careers/"
    $adjustedHtml = $adjustedHtml -replace 'href="contact/', "href=`"$pathPrefix`contact/"
    $adjustedHtml = $adjustedHtml -replace 'href="company-news/', "href=`"$pathPrefix`company-news/"
    
    # Fix the home link
    $adjustedHtml = $adjustedHtml -replace 'href="\./"', "href=`"$pathPrefix`"
    
    return $adjustedHtml
}

# Get all HTML files in the website directory and subdirectories
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

# Extract the navigation menu and ticker from index.html
$indexContent = Get-Content -Path "index.html" -Raw

# Extract the ticker section (the bg-ke-blue div containing the ticker)
$tickerPattern = [regex]::Escape('<div class="bg-ke-blue">') + '.*?' + [regex]::Escape('<div class="flex-shrink-0 whitespace-nowrap">') + '.*?' + [regex]::Escape('</div>') + '\s*' + [regex]::Escape('</div>') + '\s*' + [regex]::Escape('</div>')
$tickerPattern = $tickerPattern -replace [regex]::Escape('.*?'), '[\s\S]*?'
$tickerMatch = [regex]::Match($indexContent, $tickerPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
$tickerHtml = ""
if ($tickerMatch.Success) {
    $tickerHtml = $tickerMatch.Value
    Write-Host "Successfully extracted ticker HTML"
}
else {
    Write-Host "Failed to extract ticker HTML"
    
    # Try a simpler pattern
    $tickerPattern = '<div class="bg-ke-blue">[\s\S]*?<div class="ticker-container[\s\S]*?</div>\s*</div>\s*</div>'
    $tickerMatch = [regex]::Match($indexContent, $tickerPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    if ($tickerMatch.Success) {
        $tickerHtml = $tickerMatch.Value
        Write-Host "Successfully extracted ticker HTML with simpler pattern"
    }
    else {
        Write-Host "Failed to extract ticker HTML with simpler pattern"
    }
}

# Extract the navigation menu (from the nav tag to the end of the nav tag)
$navPattern = '<nav class="site-header relative z-10">[\s\S]*?</nav>'
$navMatch = [regex]::Match($indexContent, $navPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
$navigationHtml = ""
if ($navMatch.Success) {
    $navigationHtml = $navMatch.Value
    Write-Host "Successfully extracted navigation HTML"
}
else {
    Write-Host "Failed to extract navigation HTML"
}

# Create a backup directory if it doesn't exist
$backupDir = ".\backup-html-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Created backup directory: $backupDir"

# Process each HTML file
foreach ($file in $htmlFiles) {
    # Skip index.html as it already has the correct navigation
    if ($file.Name -eq "index.html") {
        continue
    }
    
    Write-Host "Processing $($file.FullName)"
    
    # Create a backup of the original file
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    $backupPath = Join-Path -Path $backupDir -ChildPath $relativePath
    $backupFolder = Split-Path -Path $backupPath -Parent
    
    if (-not (Test-Path -Path $backupFolder)) {
        New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
    }
    
    Copy-Item -Path $file.FullName -Destination $backupPath -Force
    
    # Get the content of the current file
    $content = Get-Content -Path $file.FullName -Raw
    
    # Get the relative path prefix for this file
    $pathPrefix = Get-RelativePathPrefix -filePath $relativePath
    Write-Host "  Path prefix: $pathPrefix"
    
    # Adjust navigation paths based on the file's depth
    $adjustedNavigation = Adjust-NavigationPaths -navigationHtml $navigationHtml -pathPrefix $pathPrefix
    $adjustedTicker = Adjust-NavigationPaths -navigationHtml $tickerHtml -pathPrefix $pathPrefix
    
    # Replace the existing navigation with the new one
    $navPattern = '<nav class="site-header relative z-10">[\s\S]*?</nav>'
    $updatedContent = [regex]::Replace($content, $navPattern, $adjustedNavigation, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    # Check if the file already has a ticker
    $tickerExists = $content -match '<div class="ticker-container'
    
    if ($tickerExists) {
        # Replace the existing ticker
        $tickerPattern = '<div class="bg-ke-blue">[\s\S]*?<div class="md:w-11/12 mx-auto flex[\s\S]*?</div>\s*</div>\s*</div>'
        $updatedContent = [regex]::Replace($updatedContent, $tickerPattern, $adjustedTicker, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        Write-Host "  Replaced existing ticker"
    }
    else {
        # Add the ticker after the opening nav tag
        $updatedContent = [regex]::Replace($updatedContent, '(<nav class="site-header relative z-10">)', "`$1`n    $adjustedTicker")
        Write-Host "  Added new ticker"
    }
    
    # Save the updated content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent -Encoding UTF8
}

Write-Host "Navigation menu and ticker update complete!"
Write-Host "Backup of original files saved to: $backupDir" 