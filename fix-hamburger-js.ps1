# Fix the hamburger menu JavaScript placement in HTML files
# This script corrects the JavaScript placement in HTML files

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
    
    # Calculate the relative path depth for proper file reference
    $pathPrefix = ""
    
    # Check if we're in a subdirectory (not root)
    if ($file.DirectoryName -ne (Get-Location).Path) {
        $subPath = $file.DirectoryName.Substring((Get-Location).Path.Length + 1)
        $depth = ($subPath.Split('\').Count)
        $pathPrefix = "../" * $depth
    }
    
    # Define the script tag to fix
    $jsLink = "<script src=`"$($pathPrefix)projects/stanley-black-decker/mobile-hamburger.js`" defer></script>"
    
    # Check for incorrect JavaScript placement
    if ($content -match "<script>\s*<script src=[^>]+mobile-hamburger\.js[^>]+></script>") {
        # Fix the issue by removing the incorrect tag and adding it properly before the closing body tag
        $content = $content -replace "<script>\s*<script src=[^>]+mobile-hamburger\.js[^>]+></script>", "<script>"
        
        # Check if we still need to add the proper script tag
        if (!($content -match "<script src=[^>]+mobile-hamburger\.js[^>]+></script>(?!\s*<script>)")) {
            # Add the script tag before the closing body tag
            $content = $content -replace "</body>", "$jsLink`n</body>"
            $modifiedFiles++
            Write-Host " - FIXED" -ForegroundColor Green
        } else {
            Write-Host " - ALREADY FIXED" -ForegroundColor Yellow
        }
        
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $content
    } else {
        Write-Host " - OK" -ForegroundColor Cyan
    }
}

Write-Host "`nSummary:"
Write-Host "--------"
Write-Host "Total files processed: $processedFiles"
Write-Host "Files fixed: $modifiedFiles"

if ($modifiedFiles -gt 0) {
    Write-Host "`nFixed JavaScript placement in $modifiedFiles files." -ForegroundColor Green
} else {
    Write-Host "`nNo files needed fixing." -ForegroundColor Yellow
} 