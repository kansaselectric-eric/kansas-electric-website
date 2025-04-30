# Fix Submenu Position in Newly Created Pages
# This script adjusts the CSS for submenu positioning in newly created pages

# Get the current directory where the script is located
$baseDir = $PSScriptRoot

# Counter for modified files
$modifiedCount = 0

# Get all HTML files in the directory and subdirectories, excluding backup-html directory and original index.html
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse | 
    Where-Object { 
        $_.FullName -notlike "*backup-html*" -and 
        $_.Name -ne "index.html" -and 
        $_.FullName -notlike "*testimonials_fixed.html" -and
        ($_.DirectoryName -ne $baseDir -or $_.Name -eq "template-page.html") # Exclude files in the root directory except template-page.html
    }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    Write-Host "Processing $($file.FullName)"
    
    # Add CSS to fix the submenu positioning
    $cssToAdd = @"
    <style>
      /* Fix for submenu positioning */
      :root {
        --header-height: 80px;
      }
      
      @media (min-width: 1024px) {
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
          padding-top: 3rem;
          padding-bottom: 3rem;
          border-top: none !important;
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
      }
    </style>
"@
    
    # Check if the CSS already exists in the file
    if (-not ($content -match [regex]::Escape("/* Fix for submenu positioning */"))) {
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