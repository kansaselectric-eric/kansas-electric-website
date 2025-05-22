$template = Get-Content -Path "temp/footer_template.html" -Raw

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse -File

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $content = Get-Content -Path $filePath -Raw
    
    # Skip if file doesn't have a footer
    if (-not $content.Contains('<footer class="bg-ke-gray-dark">')) {
        Write-Host "Skipping $($file.Name) - No footer found"
        continue
    }
    
    # Determine relative path to root
    $relativePath = ""
    $depth = ($file.DirectoryName -replace [regex]::Escape($PWD.Path), "").Split([IO.Path]::DirectorySeparatorChar).Length - 1
    
    if ($depth -eq 0) {
        $relativePath = "."
    } else {
        $relativePath = "../" * $depth
        $relativePath = $relativePath.TrimEnd("/")
    }
    
    Write-Host "Processing $($file.Name) - Depth: $depth - Path: $relativePath"
    
    # Create custom footer for this file
    $customFooter = $template -replace "ROOT_PATH", $relativePath
    
    # Replace the footer in the file
    $pattern = '(?s)<footer class="bg-ke-gray-dark">.*?</footer>'
    $newContent = [regex]::Replace($content, $pattern, $customFooter)
    
    # Write the updated content back
    Set-Content -Path $filePath -Value $newContent
    
    Write-Host "Updated footer in $($file.Name)"
}

Write-Host "Footer update complete!" 