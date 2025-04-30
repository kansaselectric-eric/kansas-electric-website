# Fix the submenu positioning in navigation-fixed.js
# This script modifies the JavaScript to ensure the submenu is positioned correctly

$baseDir = $PSScriptRoot
$jsFile = Join-Path -Path $baseDir -ChildPath "assets\js\navigation-fixed.js"

Write-Host "Modifying $jsFile"

# Check if the file exists
if (-not (Test-Path $jsFile)) {
    Write-Host "Error: File not found: $jsFile"
    exit 1
}

# Read the file content
$content = Get-Content -Path $jsFile -Raw

# Create a backup of the original file
$backupFile = "$jsFile.backup"
if (-not (Test-Path $backupFile)) {
    $content | Set-Content -Path $backupFile -Encoding UTF8
    Write-Host "Created backup at $backupFile"
}

# Modify the setSubmenuPosition function to use CSS variables and !important
$originalFunction = @"
  // Set the submenu position to eliminate the gap
  function setSubmenuPosition() {
    if (window.innerWidth >= 1024) { // lg breakpoint
      // Calculate the header height
      const header = document.querySelector('.site-header');
      let headerHeight = 80; // Default fallback
      
      if (header) {
        headerHeight = header.offsetHeight;
        // Set the CSS variable for header height
        document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
      }
      
      const submenus = document.querySelectorAll('.submenu');
      
      submenus.forEach(submenu => {
        // Set a fixed position at the bottom of the header
        submenu.style.top = headerHeight + 'px';
        submenu.style.marginTop = '0';
        submenu.style.borderTop = 'none';
        
        // Ensure the submenu spans the full width of the viewport
        submenu.style.left = '0';
        submenu.style.right = '0';
        submenu.style.width = '100vw';
        
        // Ensure the submenu is positioned at the far left and right edges
        submenu.style.marginLeft = '0';
        submenu.style.marginRight = '0';
        
        // Force browser to recalculate layout
        void submenu.offsetHeight;
      });
    }
  }
"@

$newFunction = @"
  // Set the submenu position to eliminate the gap
  function setSubmenuPosition() {
    if (window.innerWidth >= 1024) { // lg breakpoint
      // Calculate the header height
      const header = document.querySelector('.site-header');
      let headerHeight = 80; // Default fallback
      
      if (header) {
        headerHeight = header.offsetHeight;
        // Set the CSS variable for header height
        document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
      }
      
      const submenus = document.querySelectorAll('.submenu');
      
      submenus.forEach(submenu => {
        // Apply styles directly to the element to override any CSS
        submenu.setAttribute('style', `
          position: fixed !important;
          top: var(--header-height, 80px) !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          max-width: none !important;
          margin: 0 !important;
          margin-top: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          border-top: none !important;
          z-index: 999 !important;
        `);
        
        // Force browser to recalculate layout
        void submenu.offsetHeight;
      });
    }
  }
"@

# Replace the function in the content
$newContent = $content -replace [regex]::Escape($originalFunction), $newFunction

# Save the modified content
$newContent | Set-Content -Path $jsFile -Encoding UTF8

Write-Host "Successfully modified navigation-fixed.js to fix submenu positioning" 