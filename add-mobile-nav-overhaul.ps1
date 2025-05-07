# Add mobile navigation overhaul to all HTML files
# This script adds the mobile navigation overhaul files to all HTML files

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Found $totalFiles HTML files to process..."

foreach ($file in $htmlFiles) {
    $processedFiles++
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    Write-Host "Processing ($processedFiles/$totalFiles): $relativePath" -NoNewline
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    $cssModified = $false
    $jsModified = $false
    
    # Calculate the relative path depth for proper file reference
    $pathPrefix = ""
    
    # Check if we're in a subdirectory (not root)
    if ($file.DirectoryName -ne (Get-Location).Path) {
        $subPath = $file.DirectoryName.Substring((Get-Location).Path.Length + 1)
        $depth = ($subPath.Split('\').Count)
        $pathPrefix = "../" * $depth
    }
    
    # Define the CSS link to add
    $cssLink = "<link rel=`"stylesheet`" href=`"$($pathPrefix)projects/stanley-black-decker/mobile-nav-overhaul.css`">"
    
    # Define the JavaScript script to add
    $jsScript = "<script src=`"$($pathPrefix)projects/stanley-black-decker/mobile-nav-overhaul.js`" defer></script>"
    
    # Check for existing CSS link
    $cssExists = $content -match "mobile-nav-overhaul\.css"
    
    # Check for existing JavaScript
    $jsExists = $content -match "mobile-nav-overhaul\.js"
    
    # Only proceed if the CSS link needs to be added
    if (!$cssExists) {
        # Try to add after the CSS conflict fix if it exists
        if ($content -match "css-conflict-fix\.css") {
            $conflictFixLink = [regex]::Match($content, "<link[^>]+css-conflict-fix\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($conflictFixLink), "$conflictFixLink`n  $cssLink"
            $cssModified = $true
        }
        # Or try to add after mobile form enhancements CSS
        elseif ($content -match "mobile-form-enhancements\.css") {
            $formLink = [regex]::Match($content, "<link[^>]+mobile-form-enhancements\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($formLink), "$formLink`n  $cssLink"
            $cssModified = $true
        }
        # Or try to add after mobile tap targets CSS
        elseif ($content -match "mobile-tap-targets\.css") {
            $tapTargetsLink = [regex]::Match($content, "<link[^>]+mobile-tap-targets\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($tapTargetsLink), "$tapTargetsLink`n  $cssLink"
            $cssModified = $true
        }
        # Or try to add after responsive typography CSS
        elseif ($content -match "responsive-typography\.css") {
            $typographyLink = [regex]::Match($content, "<link[^>]+responsive-typography\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($typographyLink), "$typographyLink`n  $cssLink"
            $cssModified = $true
        }
        # Or try to add after responsive media CSS
        elseif ($content -match "responsive-media\.css") {
            $mediaLink = [regex]::Match($content, "<link[^>]+responsive-media\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($mediaLink), "$mediaLink`n  $cssLink"
            $cssModified = $true
        }
        # Or try to add after mobile hamburger CSS
        elseif ($content -match "mobile-hamburger\.css") {
            $hamburgerLink = [regex]::Match($content, "<link[^>]+mobile-hamburger\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($hamburgerLink), "$hamburgerLink`n  $cssLink"
            $cssModified = $true
        }
        # Or find any stylesheet
        elseif ($content -match "(?s).*(<link[^>]+stylesheet[^>]+>)(?!.*<link[^>]+stylesheet[^>]+>).*") {
            $lastStylesheet = $Matches[1]
            $content = $content -replace [regex]::Escape($lastStylesheet), "$lastStylesheet`n  $cssLink"
            $cssModified = $true
        }
    }
    
    # Only proceed if the JavaScript needs to be added
    if (!$jsExists) {
        # Look for mobile-hamburger.js script
        if ($content -match "mobile-hamburger\.js") {
            $hamburgerScript = [regex]::Match($content, "<script src=[^>]+mobile-hamburger\.js[^>]+></script>").Value
            $content = $content -replace [regex]::Escape($hamburgerScript), "$hamburgerScript`n$jsScript"
            $jsModified = $true
        }
        # Or try to add after navigation-fixed.js
        elseif ($content -match "navigation-fixed\.js") {
            $navScript = [regex]::Match($content, "<script src=[^>]+navigation-fixed\.js[^>]+></script>").Value
            $content = $content -replace [regex]::Escape($navScript), "$navScript`n  $jsScript"
            $jsModified = $true
        }
        # Or add before the closing </body> tag
        elseif ($content -match "</body>") {
            $content = $content -replace "</body>", "$jsScript`n</body>"
            $jsModified = $true
        }
    }
    
    # If any changes were made, write back to the file
    $modified = $cssModified -or $jsModified
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        $modifiedFiles++
        Write-Host " - UPDATED" -ForegroundColor Green
    } else {
        Write-Host " - SKIPPED (Already has mobile nav overhaul)" -ForegroundColor Cyan
    }
}

Write-Host "`nSummary:"
Write-Host "--------"
Write-Host "Total files processed: $processedFiles"
Write-Host "Files modified: $modifiedFiles"
Write-Host "Files skipped: $($processedFiles - $modifiedFiles)"

if ($modifiedFiles -gt 0) {
    Write-Host "`nAdded mobile navigation overhaul to $modifiedFiles files." -ForegroundColor Green
    Write-Host "The mobile navigation and hero section now have a premium, S-tier design!" -ForegroundColor Green
} else {
    Write-Host "`nNo files were modified. Please check the script output for details." -ForegroundColor Yellow
} 