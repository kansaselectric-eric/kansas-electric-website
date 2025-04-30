# Add CSS conflict fix to all HTML files
# This script adds the CSS conflict fix file to all HTML files

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
    
    # Calculate the relative path depth for proper file reference
    $pathPrefix = ""
    
    # Check if we're in a subdirectory (not root)
    if ($file.DirectoryName -ne (Get-Location).Path) {
        $subPath = $file.DirectoryName.Substring((Get-Location).Path.Length + 1)
        $depth = ($subPath.Split('\').Count)
        $pathPrefix = "../" * $depth
    }
    
    # Define the CSS link to add
    $cssLink = "<link rel=`"stylesheet`" href=`"$($pathPrefix)projects/stanley-black-decker/css-conflict-fix.css`">"
    
    # Check for existing CSS link
    $cssExists = $content -match "css-conflict-fix\.css"
    
    # Only proceed if the CSS link needs to be added
    if (!$cssExists) {
        # Try to add after the mobile form enhancements CSS if it exists
        if ($content -match "mobile-form-enhancements\.css") {
            $formLink = [regex]::Match($content, "<link[^>]+mobile-form-enhancements\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($formLink), "$formLink`n  $cssLink"
            $modified = $true
        }
        # Or try to add after mobile tap targets CSS
        elseif ($content -match "mobile-tap-targets\.css") {
            $tapTargetsLink = [regex]::Match($content, "<link[^>]+mobile-tap-targets\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($tapTargetsLink), "$tapTargetsLink`n  $cssLink"
            $modified = $true
        }
        # Or try to add after responsive typography CSS
        elseif ($content -match "responsive-typography\.css") {
            $typographyLink = [regex]::Match($content, "<link[^>]+responsive-typography\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($typographyLink), "$typographyLink`n  $cssLink"
            $modified = $true
        }
        # Or try to add after responsive media CSS
        elseif ($content -match "responsive-media\.css") {
            $mediaLink = [regex]::Match($content, "<link[^>]+responsive-media\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($mediaLink), "$mediaLink`n  $cssLink"
            $modified = $true
        }
        # Or try to add after mobile hamburger CSS
        elseif ($content -match "mobile-hamburger\.css") {
            $hamburgerLink = [regex]::Match($content, "<link[^>]+mobile-hamburger\.css[^>]+>").Value
            $content = $content -replace [regex]::Escape($hamburgerLink), "$hamburgerLink`n  $cssLink"
            $modified = $true
        }
        # Or find any stylesheet
        elseif ($content -match "(?s).*(<link[^>]+stylesheet[^>]+>)(?!.*<link[^>]+stylesheet[^>]+>).*") {
            $lastStylesheet = $Matches[1]
            $content = $content -replace [regex]::Escape($lastStylesheet), "$lastStylesheet`n  $cssLink"
            $modified = $true
        }
        # If no stylesheet found, try to add after the last link tag
        elseif ($content -match "(?s).*(<link[^>]+>)(?!.*<link[^>]+>).*") {
            $lastLinkTag = $Matches[1]
            $content = $content -replace [regex]::Escape($lastLinkTag), "$lastLinkTag`n  $cssLink"
            $modified = $true
        }
        # If still not found, add after the title tag
        elseif ($content -match "(?s).*(<title>.*?</title>).*") {
            $titleTag = $Matches[1]
            $content = $content -replace [regex]::Escape($titleTag), "$titleTag`n  $cssLink"
            $modified = $true
        }
        
        # If any changes were made, write back to the file
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content
            $modifiedFiles++
            Write-Host " - UPDATED" -ForegroundColor Green
        } else {
            Write-Host " - SKIPPED (Could not find insertion point)" -ForegroundColor Yellow
        }
    } else {
        Write-Host " - SKIPPED (Already has CSS conflict fix)" -ForegroundColor Cyan
    }
}

Write-Host "`nSummary:"
Write-Host "--------"
Write-Host "Total files processed: $processedFiles"
Write-Host "Files modified: $modifiedFiles"
Write-Host "Files skipped: $($processedFiles - $modifiedFiles)"

if ($modifiedFiles -gt 0) {
    Write-Host "`nAdded CSS conflict fix to $modifiedFiles files." -ForegroundColor Green
    Write-Host "Resolved potential conflicts between responsive CSS files!" -ForegroundColor Green
} else {
    Write-Host "`nNo files were modified. Please check the script output for details." -ForegroundColor Yellow
} 