# Add CSS variable declaration to all HTML files
# This script adds the --header-height CSS variable to the head section of all HTML files

$baseDir = $PSScriptRoot
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse | 
    Where-Object { $_.FullName -notlike "*\backup*" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Check if the file already has the CSS variable declaration
    if ($content -match "--header-height:\s*80px") {
        Write-Host "  - Already has CSS variable declaration, skipping..."
        continue
    }
    
    # Find the first <style> tag in the head section
    if ($content -match "(?s)<head>.*?(<style>.*?</style>)") {
        # Add the CSS variable declaration to the beginning of the first style tag
        $styleTag = $matches[1]
        $newStyleTag = "<style>
  :root {
    --header-height: 80px;
  }
  " + $styleTag.Substring(7)
        
        $content = $content.Replace($styleTag, $newStyleTag)
    }
    else {
        if ($content -match "</head>") {
            # If no style tag exists, add one before the closing head tag
            $cssVarStyle = @"
<style>
  :root {
    --header-height: 80px;
  }
</style>
"@
            $content = $content -replace "</head>", "$cssVarStyle</head>"
        }
    }
    
    # Fix any hardcoded submenu top values
    $content = $content -replace "top:\s*80px\s*!important", "top: var(--header-height, 80px) !important"
    
    # Save the file if modified
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $modifiedCount++
        Write-Host "  - Added CSS variable declaration"
    }
}

Write-Host "Added CSS variable declaration to $modifiedCount HTML files" 