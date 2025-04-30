# Add mobile-responsive CSS link to all HTML files
# This script adds a link to the mobile-responsive.css file in all HTML files

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
    
    # Calculate the relative path depth for proper CSS reference
    $pathPrefix = ""
    
    # Check if we're in a subdirectory (not root)
    if ($file.DirectoryName -ne (Get-Location).Path) {
        $subPath = $file.DirectoryName.Substring((Get-Location).Path.Length + 1)
        $depth = ($subPath.Split('\').Count)
        $pathPrefix = "../" * $depth
    }
    
    # Define the CSS link to add
    $cssLink = "<link rel=`"stylesheet`" href=`"$($pathPrefix)projects/stanley-black-decker/mobile-responsive.css`">"
    
    # Check if the file already contains the mobile-responsive.css reference
    if ($content -match "mobile-responsive\.css") {
        Write-Host " - SKIPPED (Already has mobile CSS)" -ForegroundColor Yellow
        continue
    }
    
    # Find the position to insert the CSS link (after the last <link> tag)
    if ($content -match "(?s).*(<link[^>]+>)(?!.*<link[^>]+>).*") {
        $lastLinkTag = $Matches[1]
        $newContent = $content -replace [regex]::Escape($lastLinkTag), "$lastLinkTag`n  $cssLink"
        
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        
        $modifiedFiles++
        Write-Host " - ADDED" -ForegroundColor Green
    } 
    else {
        # If no link tag found, try to add it after the title tag
        if ($content -match "(?s).*(<title>.*?</title>).*") {
            $titleTag = $Matches[1]
            $newContent = $content -replace [regex]::Escape($titleTag), "$titleTag`n  $cssLink"
            
            # Write the modified content back to the file
            Set-Content -Path $file.FullName -Value $newContent
            
            $modifiedFiles++
            Write-Host " - ADDED (after title)" -ForegroundColor Green
        }
        else {
            Write-Host " - SKIPPED (No suitable insertion point found)" -ForegroundColor Red
        }
    }
}

Write-Host "`nSummary:"
Write-Host "--------"
Write-Host "Total files processed: $processedFiles"
Write-Host "Files modified: $modifiedFiles"
Write-Host "Files skipped: $($processedFiles - $modifiedFiles)"

if ($modifiedFiles -gt 0) {
    Write-Host "`nAdded mobile-responsive CSS to $modifiedFiles files." -ForegroundColor Green
    Write-Host "Your website should now have improved mobile responsiveness!" -ForegroundColor Green
} else {
    Write-Host "`nNo files were modified. Please check the script output for details." -ForegroundColor Yellow
} 