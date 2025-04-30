# Add mobile hamburger menu to all HTML files
# This script adds the hamburger menu CSS and JS files to all HTML files

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

$totalFiles = $htmlFiles.Count
$processedFiles = 0
$modifiedFiles = 0
$cssAdded = 0
$jsAdded = 0

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
    
    # Define the CSS and JS links to add
    $cssLink = "<link rel=`"stylesheet`" href=`"$($pathPrefix)projects/stanley-black-decker/mobile-hamburger.css`">"
    $jsLink = "<script src=`"$($pathPrefix)projects/stanley-black-decker/mobile-hamburger.js`" defer></script>"
    
    # Check for existing CSS link
    $cssExists = $content -match "mobile-hamburger\.css"
    $jsExists = $content -match "mobile-hamburger\.js"
    
    # Only proceed if at least one of the files needs to be added
    if (!$cssExists -or !$jsExists) {
        # First, add the CSS (if needed)
        if (!$cssExists) {
            # Find the last stylesheet link
            if ($content -match "(?s).*(<link[^>]+stylesheet[^>]+>)(?!.*<link[^>]+stylesheet[^>]+>).*") {
                $lastStylesheet = $Matches[1]
                $content = $content -replace [regex]::Escape($lastStylesheet), "$lastStylesheet`n  $cssLink"
                $cssAdded++
                $modified = $true
            }
            # If no stylesheet found, try to add after the last link tag
            elseif ($content -match "(?s).*(<link[^>]+>)(?!.*<link[^>]+>).*") {
                $lastLinkTag = $Matches[1]
                $content = $content -replace [regex]::Escape($lastLinkTag), "$lastLinkTag`n  $cssLink"
                $cssAdded++
                $modified = $true
            }
            # If still not found, add after the title tag
            elseif ($content -match "(?s).*(<title>.*?</title>).*") {
                $titleTag = $Matches[1]
                $content = $content -replace [regex]::Escape($titleTag), "$titleTag`n  $cssLink"
                $cssAdded++
                $modified = $true
            }
        }
        
        # Second, add the JS (if needed)
        if (!$jsExists) {
            # Find the last script tag
            if ($content -match "(?s).*(<script[^>]+>|<script>)(?!.*<script).*") {
                $lastScriptTag = $Matches[1]
                $content = $content -replace [regex]::Escape($lastScriptTag), "$lastScriptTag`n  $jsLink"
                $jsAdded++
                $modified = $true
            }
            # If no script tag found, try to add before the closing body tag
            elseif ($content -match "(?s).*</body>.*") {
                $content = $content -replace "</body>", "  $jsLink`n</body>"
                $jsAdded++
                $modified = $true
            }
            # If still not found, add before the closing html tag
            elseif ($content -match "(?s).*</html>.*") {
                $content = $content -replace "</html>", "  $jsLink`n</html>"
                $jsAdded++
                $modified = $true
            }
        }
        
        # If any changes were made, write back to the file
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content
            $modifiedFiles++
            Write-Host " - UPDATED" -ForegroundColor Green
        } else {
            Write-Host " - SKIPPED (Could not find insertion points)" -ForegroundColor Yellow
        }
    } else {
        Write-Host " - SKIPPED (Already has hamburger menu)" -ForegroundColor Cyan
    }
}

Write-Host "`nSummary:"
Write-Host "--------"
Write-Host "Total files processed: $processedFiles"
Write-Host "Files modified: $modifiedFiles"
Write-Host "CSS links added: $cssAdded"
Write-Host "JS links added: $jsAdded"
Write-Host "Files skipped: $($processedFiles - $modifiedFiles)"

if ($modifiedFiles -gt 0) {
    Write-Host "`nAdded mobile hamburger menu to $modifiedFiles files." -ForegroundColor Green
    Write-Host "Your website now has a responsive mobile menu for small screens!" -ForegroundColor Green
} else {
    Write-Host "`nNo files were modified. Please check the script output for details." -ForegroundColor Yellow
} 