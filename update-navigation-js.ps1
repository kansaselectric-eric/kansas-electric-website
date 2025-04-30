# PowerShell script to replace navigation-fixed.js with the updated navigation.js file

# Get the content of the updated navigation.js file
$navigationJsContent = Get-Content -Path "assets/js/navigation.js" -Raw

# Write the content to navigation-fixed.js
Set-Content -Path "assets/js/navigation-fixed.js" -Value $navigationJsContent

Write-Host "Successfully updated navigation-fixed.js with the content from navigation.js" 