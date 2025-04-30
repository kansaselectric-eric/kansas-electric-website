# Add Footer Content to HTML Pages
# This script adds the footer content from index.html to all HTML pages that have a placeholder footer

# Get the current directory where the script is located
$baseDir = $PSScriptRoot

# Read the footer content from index.html
$indexHtmlPath = Join-Path -Path $baseDir -ChildPath "index.html"
$indexHtmlContent = Get-Content -Path $indexHtmlPath -Raw

# Extract the footer content from index.html
if ($indexHtmlContent -match '(?s)<footer class="bg-ke-gray-dark">(.*?)</footer>') {
    $footerContent = $matches[0]
    Write-Host "Footer content extracted from index.html"
} else {
    Write-Host "Could not extract footer content from index.html"
    exit
}

# Counter for modified files
$modifiedCount = 0

# Get all HTML files in the directory and subdirectories, excluding backup-html directory
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse | 
    Where-Object { $_.FullName -notlike "*backup-html*" }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the file has a placeholder footer
    if ($content -match '<footer class="bg-ke-gray-dark">\s*<!-- Footer will be added by the update-navigation script -->\s*</footer>') {
        Write-Host "Processing $($file.FullName)"
        
        # Calculate the relative path prefix based on the directory depth
        $relativePath = $file.DirectoryName.Replace($baseDir, "").Trim("\")
        $depth = ($relativePath -split "\\").Length
        $pathPrefix = ""
        
        if ($depth -gt 0) {
            $pathPrefix = "../" * $depth
        }
        
        # Adjust paths in the footer content based on the directory depth
        $adjustedFooterContent = $footerContent -replace '(src|href)="\./', "`$1=`"$pathPrefix"
        
        # Replace the placeholder footer with the actual footer content
        $newContent = $content -replace '<footer class="bg-ke-gray-dark">\s*<!-- Footer will be added by the update-navigation script -->\s*</footer>', $adjustedFooterContent
        
        # Save the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        
        $modifiedCount++
    }
}

Write-Host "Footer added to $modifiedCount HTML files" 