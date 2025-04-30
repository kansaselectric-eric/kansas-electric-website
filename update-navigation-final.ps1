# PowerShell script to update navigation menu and ticker on all HTML pages
# This script extracts the navigation menu and ticker from index.html and applies it to all other HTML pages

# Function to adjust paths in navigation HTML based on directory depth
function Adjust-NavigationPaths {
    param (
        [string]$navigationHtml,
        [string]$pathPrefix
    )
    
    # Replace absolute paths with relative paths
    $adjustedHtml = $navigationHtml
    
    # Replace href="./ with href="$pathPrefix
    $adjustedHtml = $adjustedHtml -replace 'href="\.\/', "href=`"$pathPrefix"
    
    # Replace src="./ with src="$pathPrefix
    $adjustedHtml = $adjustedHtml -replace 'src="\.\/', "src=`"$pathPrefix"
    
    # Replace content="./ with content="$pathPrefix
    $adjustedHtml = $adjustedHtml -replace 'content="\.\/', "content=`"$pathPrefix"
    
    return $adjustedHtml
}

# Get all HTML files in the website directory and subdirectories
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

# Read the index.html file
$indexPath = "index.html"
$indexContent = Get-Content -Path $indexPath -Raw

# Extract the navigation menu (from <nav class="site-header"> to </nav>)
$navPattern = '(?s)<nav class="site-header relative z-10">.*?</nav>'
$navMatch = [regex]::Match($indexContent, $navPattern)
$navHtml = ""
if ($navMatch.Success) {
    $navHtml = $navMatch.Value
    Write-Host "Successfully extracted navigation HTML"
} else {
    Write-Host "Failed to extract navigation HTML"
    exit
}

# Extract the ticker section (the bg-ke-blue div containing the ticker)
$tickerPattern = '<div class="bg-ke-blue">[\s\S]*?<div class="ticker-container[\s\S]*?</div>\s*</div>\s*</div>'
$tickerMatch = [regex]::Match($indexContent, $tickerPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
$tickerHtml = ""
if ($tickerMatch.Success) {
    $tickerHtml = $tickerMatch.Value
    Write-Host "Successfully extracted ticker HTML"
} else {
    Write-Host "Failed to extract ticker HTML"
    
    # Try a simpler pattern
    $tickerPattern = '<div class="bg-ke-blue">[\s\S]*?<div class="md:w-11/12 mx-auto flex[\s\S]*?</div>\s*</div>\s*</div>'
    $tickerMatch = [regex]::Match($indexContent, $tickerPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    if ($tickerMatch.Success) {
        $tickerHtml = $tickerMatch.Value
        Write-Host "Successfully extracted ticker HTML with simpler pattern"
    } else {
        Write-Host "Failed to extract ticker HTML with simpler pattern"
        exit
    }
}

# Extract the navigation JavaScript
$navJsPattern = '(?s)<script>\s*document\.addEventListener\(''DOMContentLoaded'', function\(\) \{.*?</script>'
$navJsMatches = [regex]::Matches($indexContent, $navJsPattern)
$navJs = ""
foreach ($match in $navJsMatches) {
    if ($match.Value -match "submenu|navigation|ticker") {
        $navJs += $match.Value + "`n"
    }
}

# Extract the ticker JavaScript
$tickerJsPattern = '(?s)<script>\s*document\.addEventListener\(''DOMContentLoaded'', function\(\) \{\s*const tickerContent.*?</script>'
$tickerJsMatch = [regex]::Match($indexContent, $tickerJsPattern)
$tickerJs = ""
if ($tickerJsMatch.Success) {
    $tickerJs = $tickerJsMatch.Value
    Write-Host "Successfully extracted ticker JavaScript"
} else {
    Write-Host "Failed to extract ticker JavaScript"
}

# Extract CSS styles for navigation and ticker
$cssPattern = '(?s)<style>.*?</style>'
$cssMatch = [regex]::Match($indexContent, $cssPattern)
$cssStyles = ""
if ($cssMatch.Success) {
    $cssStyles = $cssMatch.Value
    Write-Host "Successfully extracted CSS styles"
} else {
    Write-Host "Failed to extract CSS styles"
}

# Process each HTML file
foreach ($file in $htmlFiles) {
    # Skip index.html
    if ($file.Name -eq "index.html" -and $file.Directory.FullName -eq (Get-Location).Path) {
        Write-Host "Skipping index.html"
        continue
    }
    
    Write-Host "Processing $($file.FullName)"
    
    # Calculate the relative path prefix based on directory depth
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\")
    $directoryDepth = ($relativePath.Split("\").Length - 1)
    $pathPrefix = ""
    
    if ($directoryDepth -eq 0) {
        $pathPrefix = "./"
    } else {
        for ($i = 0; $i -lt $directoryDepth; $i++) {
            $pathPrefix += "../"
        }
    }
    
    Write-Host "  Directory depth: $directoryDepth, Path prefix: $pathPrefix"
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Adjust navigation paths based on directory depth
    $adjustedNav = Adjust-NavigationPaths -navigationHtml $navHtml -pathPrefix $pathPrefix
    $adjustedTicker = Adjust-NavigationPaths -navigationHtml $tickerHtml -pathPrefix $pathPrefix
    
    # Create updated content
    $updatedContent = $content
    
    # Check if the file already has a navigation menu
    $navExists = $content -match '<nav class="site-header'
    
    if ($navExists) {
        # Replace the existing navigation menu
        $navPattern = '(?s)<nav class="site-header.*?</nav>'
        $updatedContent = [regex]::Replace($updatedContent, $navPattern, $adjustedNav, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        Write-Host "  Replaced existing navigation menu"
    } else {
        # Add the navigation menu after the body tag
        $updatedContent = [regex]::Replace($updatedContent, '(<body.*?>)', "`$1`n$adjustedNav")
        Write-Host "  Added new navigation menu"
    }
    
    # Check if the file already has a ticker
    $tickerExists = $content -match '<div class="ticker-container'
    
    if ($tickerExists) {
        # Replace the existing ticker
        $tickerPattern = '<div class="bg-ke-blue">[\s\S]*?<div class="md:w-11/12 mx-auto flex[\s\S]*?</div>\s*</div>\s*</div>'
        $updatedContent = [regex]::Replace($updatedContent, $tickerPattern, $adjustedTicker, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        Write-Host "  Replaced existing ticker"
    } else {
        # The ticker is part of the navigation, so it's already added
        Write-Host "  Ticker is included in the navigation"
    }
    
    # Check if the file already has the navigation JavaScript
    $navJsExists = $content -match 'document\.addEventListener\(''DOMContentLoaded'', function\(\) \{'
    
    if (!$navJsExists) {
        # Add the navigation JavaScript before the closing body tag
        $updatedContent = [regex]::Replace($updatedContent, '(</body>)', "$navJs`n$tickerJs`n`$1")
        Write-Host "  Added navigation and ticker JavaScript"
    } else {
        Write-Host "  Navigation JavaScript already exists"
    }
    
    # Check if the file already has the CSS styles
    $cssExists = $content -match '<style>'
    
    if (!$cssExists) {
        # Add the CSS styles in the head section
        $updatedContent = [regex]::Replace($updatedContent, '(</head>)', "$cssStyles`n`$1")
        Write-Host "  Added CSS styles"
    } else {
        Write-Host "  CSS styles already exist"
    }
    
    # Save the updated content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent
    Write-Host "  Updated file saved"
}

Write-Host "Navigation menu and ticker update complete!"

# Script to update all HTML files to use the fixed navigation.js file
$baseDir = $PSScriptRoot
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse

Write-Host "Processing $($htmlFiles.Count) HTML files..."

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Check if the file contains a reference to navigation-fixed.js
    if ($content -match '<script src="(.*?)navigation-fixed.js" defer></script>') {
        # No need to update, already using the fixed version
        Write-Host "Skipping $($file.FullName) - already using navigation-fixed.js"
        continue
    }
    
    # Replace navigation.js with navigation-fixed.js
    $patterns = @(
        '<script src="(.*?)navigation\.js" defer></script>',
        '<script src="(.*?)navigation\.js"></script>'
    )
    
    $modified = $false
    
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $content = $content -replace $pattern, '<script src="$1navigation-fixed.js" defer></script>'
            $modified = $true
        }
    }
    
    # If the file was modified, save it
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        $modifiedCount++
        Write-Host "Updated $($file.FullName)"
    }
}

Write-Host "Navigation script update complete. Updated $modifiedCount HTML files." 