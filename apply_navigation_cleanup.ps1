# Navigation Cleanup Script for Kansas Electric Website
# This script applies comprehensive navigation cleanup to all HTML files

Write-Host "Starting Navigation Cleanup for Kansas Electric Website..." -ForegroundColor Green

# Define the navigation cleanup CSS
$cleanupCSS = @"
  
  <!-- NAVIGATION CLEANUP: Hide all old navigation elements -->
  <style>
    /* === COMPREHENSIVE NAVIGATION CLEANUP === */
    
    /* Hide all old navigation elements */
    .nav-item:not(.redesigned-nav-item),
    .submenu:not(.redesigned-dropdown),
    .mobile-nav,
    .side-menu,
    .off-canvas,
    .vertical-nav,
    .nav-mobile,
    .old-nav,
    .legacy-nav {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
      z-index: -1 !important;
    }
    
    /* Hide any ticker elements */
    .ticker-container,
    .ticker-wrapper,
    .ticker-scroll,
    .ticker,
    #ticker,
    [class*="ticker"],
    [id*="ticker"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
      z-index: -1 !important;
    }
    
    /* Ensure only redesigned navigation is visible */
    .redesigned-nav-item,
    .redesigned-dropdown,
    .redesigned-mobile-nav-item,
    .redesigned-mobile-nav-link {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      left: auto !important;
      top: auto !important;
      z-index: auto !important;
    }
    
    /* Clean layout enforcement */
    body {
      overflow-x: hidden;
    }
    
    /* Ensure no ghost elements appear */
    *[style*="position: absolute"][style*="left: -"],
    *[style*="position: fixed"][style*="left: -"],
    *[style*="transform: translateX(-"] {
      display: none !important;
    }
    
    /* === FINAL NAVIGATION CLEANUP OVERRIDE === */
    /* Override any old navigation positioning */
    .site-header .nav-item,
    .site-header .submenu,
    .main-navigation .nav-item,
    .main-navigation .submenu {
      position: static !important;
      width: auto !important;
      height: auto !important;
      left: auto !important;
      top: auto !important;
      transform: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Hide any elements that might be causing vertical navigation */
    ul.nav-item,
    nav.nav-item,
    aside.nav-item,
    div.nav-item:not(.redesigned-nav-item) {
      display: none !important;
    }
  </style>
"@

# Get all HTML files
$htmlFiles = Get-ChildItem -Recurse -Filter "index.html" | Where-Object { $_.FullName -notlike "*node_modules*" }

Write-Host "Found $($htmlFiles.Count) HTML files to process..." -ForegroundColor Yellow

$processedCount = 0
$skippedCount = 0

foreach ($file in $htmlFiles) {
    try {
        Write-Host "Processing: $($file.FullName)" -ForegroundColor Cyan
        
        # Read the file content
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Check if cleanup is already applied
        if ($content -match "COMPREHENSIVE NAVIGATION CLEANUP") {
            Write-Host "  - Already processed, skipping..." -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Find the insertion point (after navigation-fixed.js)
        $insertionPattern = '(<script src="[^"]*navigation-fixed\.js"[^>]*></script>)'
        
        if ($content -match $insertionPattern) {
            # Insert the cleanup CSS after navigation-fixed.js
            $newContent = $content -replace $insertionPattern, "`$1$cleanupCSS"
            
            # Comment out ticker references
            $newContent = $newContent -replace '(<link rel="stylesheet" href="[^"]*ticker-styles\.css">)', '<!-- $1 -->'
            $newContent = $newContent -replace '(<script src="[^"]*ticker\.js"[^>]*></script>)', '<!-- $1 -->'
            
            # Write the updated content back
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
            
            Write-Host "  - Successfully updated!" -ForegroundColor Green
            $processedCount++
        } else {
            Write-Host "  - No navigation-fixed.js found, skipping..." -ForegroundColor Red
            $skippedCount++
        }
    }
    catch {
        Write-Host "  - Error processing file: $($_.Exception.Message)" -ForegroundColor Red
        $skippedCount++
    }
}

Write-Host "`nNavigation Cleanup Complete!" -ForegroundColor Green
Write-Host "Processed: $processedCount files" -ForegroundColor Green
Write-Host "Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "`nAll pages should now have clean navigation without ghost tickers or vertical navigation issues." -ForegroundColor Cyan 