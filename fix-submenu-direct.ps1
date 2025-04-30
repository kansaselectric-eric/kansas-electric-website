# Fix Submenu Position in Newly Created Pages - Direct Edit
# This script directly edits the HTML files to fix the submenu positioning

# Get the current directory where the script is located
$baseDir = $PSScriptRoot

# Counter for modified files
$modifiedCount = 0

# Get all HTML files in the services, projects, about, careers, and contact directories
$directories = @("services", "projects", "about", "careers", "contact")
$htmlFiles = @()

foreach ($dir in $directories) {
    $dirPath = Join-Path -Path $baseDir -ChildPath $dir
    if (Test-Path -Path $dirPath) {
        $htmlFiles += Get-ChildItem -Path $dirPath -Filter "*.html" -Recurse
    }
}

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Create the CSS fix to add - this is a more comprehensive fix
    $cssToAdd = @"
    <style>
      /* Enhanced fix for submenu positioning - added by fix-submenu-direct.ps1 */
      @media (min-width: 1024px) {
        /* Set a fixed header height */
        :root {
          --header-height: 80px;
        }
        
        /* Fix the header to ensure consistent positioning */
        .site-header {
          position: relative;
          z-index: 101; /* Higher than submenu */
        }
        
        /* Ensure the submenu is positioned correctly */
        .submenu {
          position: fixed !important;
          top: var(--header-height) !important; /* Use the header height variable */
          left: 0 !important; /* Start at the left edge of the screen */
          right: 0 !important;
          width: 100% !important;
          max-width: none !important;
          transform: none !important;
          margin: 0 !important;
          padding-top: 3rem;
          padding-bottom: 3rem;
          border-top: none !important;
          z-index: 100;
        }
        
        /* Ensure the nav items have proper positioning */
        .nav-item {
          position: static !important;
        }
        
        /* Ensure the main navigation has proper z-index */
        .main-navigation {
          position: relative;
          z-index: 101;
        }
        
        /* Ensure the nav items have proper height */
        .nav-item .lg\\:py-6 {
          padding-top: 1.5rem !important;
          padding-bottom: 1.5rem !important;
        }
        
        /* Ensure no gap between nav and submenu */
        .nav-item:hover .submenu {
          display: block;
          opacity: 1;
          visibility: visible;
        }
        
        /* Override any inline styles that might interfere */
        .submenu[style] {
          top: var(--header-height) !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
        }
      }
    </style>
"@
    
    # Check if the enhanced fix is already applied
    if (-not ($content -match "Enhanced fix for submenu positioning - added by fix-submenu-direct.ps1")) {
        # Remove any previous fix we might have added
        $content = $content -replace "<style>\s*\/\* Fix for submenu positioning - added by fix-submenu-direct\.ps1 \*\/.*?<\/style>", ""
        
        # Insert the CSS just before the closing </head> tag
        $updatedContent = $content -replace '</head>', "$cssToAdd`n</head>"
        
        # Save the modified content back to the file
        if ($updatedContent -ne $content) {
            Set-Content -Path $file.FullName -Value $updatedContent
            $modifiedCount++
        }
    }
}

Write-Host "Submenu position fixed in $modifiedCount HTML files" 