# I use this script to automate repetitive tasks; no manual edits needed.
$filesToUpdate = @(
    "index.html",
    "about\index.html",
    "services\divisions\industrial\index.html",
    "services\industrial\index.html",
    "services\industrial\food-beverage\index.html"
)

$pattern = '<li><a href="services/industrial/microgrids/index.html">Microgrids</a></li>'
$replacement = '<li><a href="services/industrial/data-centers/index.html">Data Centers & Mission Critical Facilities</a></li>'

$pattern2 = 'href="services/industrial/microgrids/index.html">Microgrids'
$replacement2 = 'href="services/industrial/data-centers/index.html">Data Centers & Mission Critical Facilities'

$pattern3 = 'href="../microgrids/index.html">Microgrids'
$replacement3 = 'href="../data-centers/index.html">Data Centers & Mission Critical Facilities'

$totalFiles = 0

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        
        # Check if file contains any of the patterns
        $hasChanges = $false
        
        if ($content -match $pattern -or $content -match $pattern2 -or $content -match $pattern3) {
            $hasChanges = $true
            
            # Apply replacements
            $content = $content -replace [regex]::Escape($pattern), $replacement
            $content = $content -replace [regex]::Escape($pattern2), $replacement2
            $content = $content -replace [regex]::Escape($pattern3), $replacement3
            
            # Save file
            Set-Content -Path $file -Value $content
            $totalFiles++
            
            Write-Host "Updated: $file"
        }
        
        if (-not $hasChanges) {
            Write-Host "No changes needed in: $file"
        }
    }
    else {
        Write-Host "File not found: $file"
    }
}

Write-Host "`nTotal files updated: $totalFiles" 