# Targeted fix for submenu positioning
# This script applies a fix to all pages EXCEPT index.html (which already works correctly)

$baseDir = $PSScriptRoot
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse | 
    Where-Object { 
        $_.FullName -notlike "*\backup*" -and 
        # Only exclude the root index.html, not index.html files in subdirectories
        -not ($_.Name -eq "index.html" -and $_.DirectoryName -eq $baseDir)
    }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Check if the file already has the targeted fix
    if ($content -match "Targeted submenu vertical position fix") {
        Write-Host "  - Already has targeted fix, skipping..."
        continue
    }
    
    # Add the targeted fix before the closing </head> tag
    $targetedFix = @"
<style>
  /* Targeted submenu vertical position fix - applied by fix-submenu-targeted.ps1 */
  @media (min-width: 1024px) {
    /* Ensure the site header has consistent height */
    .site-header {
      height: 80px;
    }
    
    /* Ensure the main navigation has proper height */
    .main-navigation {
      height: 80px;
    }
    
    /* Ensure the nav items have static positioning */
    .nav-item {
      position: static !important;
    }
    
    /* Fix the submenu vertical position */
    .submenu {
      position: fixed !important;
      top: 80px !important;
      left: 0 !important;
      width: 100% !important;
      z-index: 999 !important;
    }
    
    /* Override any inline styles that might be set by JavaScript */
    .submenu[style] {
      top: 80px !important;
    }
  }
</style>
"@
    
    # Insert the fix before the closing </head> tag
    $content = $content -replace "</head>", "$targetedFix</head>"
    
    # Save the file if modified
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $modifiedCount++
        Write-Host "  - Updated with targeted fix"
    }
}

Write-Host "Applied targeted submenu fix to $modifiedCount HTML files" 