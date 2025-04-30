# Final fix for submenu positioning
# This script removes all previous fixes and applies a single, comprehensive fix

$baseDir = $PSScriptRoot
$modifiedCount = 0

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse -Include "*.html" | 
    Where-Object { $_.FullName -notlike "*\backup*" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Remove all previous submenu fixes
    $content = $content -replace "(?s)<style>\s*?/\*\s*?Fix for submenu positioning.*?</style>", ""
    $content = $content -replace "(?s)<style>\s*?/\*\s*?Enhanced fix for submenu positioning.*?</style>", ""
    
    # Check if the file already has the final fix
    if ($content -match "Final comprehensive submenu fix") {
        Write-Host "  - Already has final fix, skipping..."
        continue
    }
    
    # Add the comprehensive fix before the closing </head> tag
    $finalFix = @"
<style>
  /* Final comprehensive submenu fix - applied by fix-submenu-final.ps1 */
  @media (min-width: 1024px) {
    /* Set a fixed header height */
    :root {
      --header-height: 80px;
    }
    
    /* Fix the header to ensure consistent positioning */
    .site-header {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      height: var(--header-height) !important;
    }
    
    /* Ensure the main navigation has proper height */
    .main-navigation {
      height: var(--header-height) !important;
      z-index: 1001 !important;
    }
    
    /* Ensure the nav items have static positioning */
    .nav-item {
      position: static !important;
    }
    
    /* Ensure the submenu is positioned correctly */
    .submenu {
      position: fixed !important;
      top: var(--header-height) !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-width: none !important;
      transform: none !important;
      margin: 0 !important;
      z-index: 999 !important;
    }
    
    /* Override any inline styles that might be set by JavaScript */
    .submenu[style] {
      top: var(--header-height) !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
    }
    
    /* Add padding to the page content to account for fixed header */
    body {
      padding-top: var(--header-height) !important;
    }
    
    /* Adjust main content to account for fixed header */
    main {
      margin-top: 0 !important;
    }
  }
</style>
"@
    
    # Insert the fix before the closing </head> tag
    $content = $content -replace "</head>", "$finalFix</head>"
    
    # Save the file if modified
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $modifiedCount++
        Write-Host "  - Updated with final fix"
    }
}

Write-Host "Applied final submenu fix to $modifiedCount HTML files" 