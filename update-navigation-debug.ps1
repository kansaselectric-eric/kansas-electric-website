# PowerShell script to update a specific HTML file to use the debug version of the navigation script

# Specify the file to update
$filePath = "services/industrial/food-beverage/index.html"

# Read the file content
$content = Get-Content -Path $filePath -Raw

# Replace navigation-fixed.js with navigation-debug.js
$updatedContent = $content -replace 'navigation-fixed\.js', 'navigation-debug.js'

# Write the updated content back to the file
Set-Content -Path $filePath -Value $updatedContent

Write-Host "Updated $filePath to use navigation-debug.js" 