# Simple PowerShell script to update navigation menu and ticker on all HTML pages

# Function to get the relative path prefix based on directory depth
function Get-RelativePathPrefix {
    param (
        [string]$filePath
    )
    
    # Count the number of directory levels
    $parts = $filePath.Split('\')
    $depth = 0
    foreach ($part in $parts) {
        if ($part -ne "") {
            $depth++
        }
    }
    $depth = $depth - 1  # Subtract 1 because we don't count the filename
    
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
    $adjustedHtml = $navigationHtml.Replace('href="./', "href=`"$pathPrefix")
    
    # Replace paths that don't have a prefix but should (assets, services, etc.)
    $adjustedHtml = $adjustedHtml.Replace('href="assets/', "href=`"$pathPrefix`assets/")
    $adjustedHtml = $adjustedHtml.Replace('src="assets/', "src=`"$pathPrefix`assets/")
    
    # Replace other root-level paths
    $adjustedHtml = $adjustedHtml.Replace('href="services/', "href=`"$pathPrefix`services/")
    $adjustedHtml = $adjustedHtml.Replace('href="projects/', "href=`"$pathPrefix`projects/")
    $adjustedHtml = $adjustedHtml.Replace('href="about/', "href=`"$pathPrefix`about/")
    $adjustedHtml = $adjustedHtml.Replace('href="careers/', "href=`"$pathPrefix`careers/")
    $adjustedHtml = $adjustedHtml.Replace('href="contact/', "href=`"$pathPrefix`contact/")
    $adjustedHtml = $adjustedHtml.Replace('href="company-news/', "href=`"$pathPrefix`company-news/")
    
    # Fix the home link
    $adjustedHtml = $adjustedHtml.Replace('href="./"', "href=`"$pathPrefix`"")
    
    return $adjustedHtml
}

# Get all HTML files in the website directory and subdirectories
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

# Extract the navigation menu and ticker from index.html
$indexContent = Get-Content -Path "index.html" -Raw

# Extract the ticker section manually
$tickerStartIndex = $indexContent.IndexOf('<div class="bg-ke-blue">')
$tickerEndIndex = $indexContent.IndexOf('</div>', $indexContent.IndexOf('</div>', $indexContent.IndexOf('</div>', $tickerStartIndex) + 6) + 6) + 6
$tickerHtml = $indexContent.Substring($tickerStartIndex, $tickerEndIndex - $tickerStartIndex)

# Extract the navigation menu manually
$navStartIndex = $indexContent.IndexOf('<nav class="site-header relative z-10">')
$navEndIndex = $indexContent.IndexOf('</nav>', $navStartIndex) + 6
$navigationHtml = $indexContent.Substring($navStartIndex, $navEndIndex - $navStartIndex)

# Create a backup directory
$backupDir = ".\backup-html-" + (Get-Date -Format "yyyyMMdd-HHmmss")
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
    $navStartIndex = $content.IndexOf('<nav class="site-header relative z-10">')
    $navEndIndex = $content.IndexOf('</nav>', $navStartIndex) + 6
    $beforeNav = $content.Substring(0, $navStartIndex)
    $afterNav = $content.Substring($navEndIndex)
    $updatedContent = $beforeNav + $adjustedNavigation + $afterNav
    
    # Check if the file already has a ticker
    $tickerExists = $content.Contains('<div class="ticker-container')
    
    if ($tickerExists) {
        # Replace the existing ticker
        $tickerStartIndex = $updatedContent.IndexOf('<div class="bg-ke-blue">')
        $tickerEndIndex = $updatedContent.IndexOf('</div>', $updatedContent.IndexOf('</div>', $updatedContent.IndexOf('</div>', $tickerStartIndex) + 6) + 6) + 6
        $beforeTicker = $updatedContent.Substring(0, $tickerStartIndex)
        $afterTicker = $updatedContent.Substring($tickerEndIndex)
        $updatedContent = $beforeTicker + $adjustedTicker + $afterTicker
        Write-Host "  Replaced existing ticker"
    }
    else {
        # Add the ticker after the opening nav tag
        $navTagEndIndex = $updatedContent.IndexOf('>', $updatedContent.IndexOf('<nav class="site-header relative z-10"')) + 1
        $beforeNavEnd = $updatedContent.Substring(0, $navTagEndIndex)
        $afterNavEnd = $updatedContent.Substring($navTagEndIndex)
        $updatedContent = $beforeNavEnd + "`n    " + $adjustedTicker + $afterNavEnd
        Write-Host "  Added new ticker"
    }
    
    # Save the updated content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent -Encoding UTF8
}

Write-Host "Navigation menu and ticker update complete!"
Write-Host "Backup of original files saved to: $backupDir" 