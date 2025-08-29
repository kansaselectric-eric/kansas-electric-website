/**
 * Navigation Menu Fix
 * This script provides consistent navigation behavior across all pages
 * Updated to fix submenu display, stacking issues, and ensure horizontal layout
 */

(function() {
  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also run after window load to ensure all assets are loaded
  window.addEventListener('load', init);
  
  function init() {
    console.log('Navigation fix initializing...');
    
    // Set header height variable and critical z-index values
    updateHeaderHeight();
    
    // Fix ticker and logo positioning
    fixTickerAndLogo();
    
    // Force z-index on critical elements
    const siteHeader = document.querySelector('.site-header');
    const mainContent = document.querySelector('main#content');
    
    if (siteHeader) {
      siteHeader.style.position = 'relative';
      siteHeader.style.zIndex = '9999';
      // Create a stacking context
      siteHeader.style.isolation = 'isolate';
    }
    
    if (mainContent) {
      mainContent.style.position = 'relative';
      mainContent.style.zIndex = '1';
    }
    
    // Apply hover logic for nav items and ensure proper stacking
    const navItems = document.querySelectorAll('.nav-item');
    
    // Apply specific fixes for desktop navigation
    if (window.innerWidth >= 1024) {
      fixDesktopNavigation();
    }
    
    // Clear any existing event listeners by cloning all nav items
    navItems.forEach(function(item) {
      // Skip if this item has already been processed
      if (item.hasAttribute('data-nav-fixed')) return;
      
      const submenu = item.querySelector('.submenu');
      if (!submenu) return;
      
      // Mark this item as processed
      item.setAttribute('data-nav-fixed', 'true');
      
      // Force critical z-index and positioning on submenu
      submenu.style.zIndex = '9998';
      submenu.style.isolation = 'isolate';
      
      // Force display:flex for horizontal layout on desktop
      if (window.innerWidth >= 1024) {
        ensureHorizontalMenuLayout(submenu);
      }
      
      // Add mouse enter handler
      item.addEventListener('mouseenter', function() {
        // Hide all other submenus first
        navItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            const otherSubmenu = otherItem.querySelector('.submenu');
            if (otherSubmenu) {
              otherSubmenu.style.display = 'none';
              otherSubmenu.style.opacity = '0';
              otherSubmenu.style.visibility = 'hidden';
              otherSubmenu.style.pointerEvents = 'none';
            }
          }
        });
        
        // Show this submenu
        if (window.innerWidth >= 1024) {
          submenu.style.display = 'flex';
        } else {
          submenu.style.display = 'block';
        }
        
        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
        submenu.style.pointerEvents = 'auto';
        
        // Ensure proper positioning for desktop
        if (window.innerWidth >= 1024) {
          const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;
          submenu.style.position = 'absolute';
          submenu.style.top = '100%';
          submenu.style.left = '0';
          submenu.style.width = '100vw';
        }
      });
      
      // Add mouse leave handler
      item.addEventListener('mouseleave', function() {
        setTimeout(function() {
          const isHovered = submenu.matches(':hover');
          if (!isHovered) {
            submenu.style.opacity = '0';
            submenu.style.visibility = 'hidden';
            submenu.style.pointerEvents = 'none';
            
            setTimeout(function() {
              if (submenu.style.visibility === 'hidden') {
                submenu.style.display = 'none';
              }
            }, 300);
          }
        }, 50);
      });
      
      // Handle submenu hover directly
      submenu.addEventListener('mouseenter', function() {
        if (window.innerWidth >= 1024) {
          this.style.display = 'flex';
        } else {
          this.style.display = 'block';
        }
        
        this.style.opacity = '1';
        this.style.visibility = 'visible';
        this.style.pointerEvents = 'auto';
      });
      
      submenu.addEventListener('mouseleave', function() {
        this.style.opacity = '0';
        this.style.visibility = 'hidden';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
          if (this.style.visibility === 'hidden') {
            this.style.display = 'none';
          }
        }, 300);
      });
    });
    
    // Update on window resize
    window.addEventListener('resize', function() {
      updateHeaderHeight();
      if (window.innerWidth >= 1024) {
        fixDesktopNavigation();
      }
    });
    
    // Function to update header height
    function updateHeaderHeight() {
      const header = document.querySelector('.site-header');
      if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    }
    
    // Function to fix ticker and logo positioning
    function fixTickerAndLogo() {
      const headerRow = document.querySelector('.site-header .md\:w-11\/12');
      if (headerRow) {
        headerRow.style.width = '100%';
        headerRow.style.maxWidth = '100%';
        headerRow.style.margin = '0';
        headerRow.style.padding = '0';
      }
    }
    
    // Function to fix desktop navigation display
    function fixDesktopNavigation() {
      const submenus = document.querySelectorAll('.submenu');
      submenus.forEach(submenu => {
        ensureHorizontalMenuLayout(submenu);
      });
    }
    
    // Function to ensure horizontal menu layout
    function ensureHorizontalMenuLayout(submenu) {
      // Set display:flex on the submenu itself
      submenu.style.display = submenu.style.visibility === 'visible' ? 'flex' : 'none';
      
      // Find and fix submenu container
      const submenuContainer = submenu.querySelector('.submenu-container');
      if (submenuContainer) {
        submenuContainer.style.display = 'flex';
        submenuContainer.style.width = '100%';
      }
      
      // Find and fix three-column-menu
      const threeColumnMenu = submenu.querySelector('.three-column-menu');
      if (threeColumnMenu) {
        threeColumnMenu.style.display = 'flex';
        threeColumnMenu.style.width = '100%';
      }
      
      // Ensure menu columns are displayed
      const menuColumns = submenu.querySelectorAll('.menu-column');
      menuColumns.forEach(column => {
        column.style.display = 'block';
      });
      
      // VISUAL POLISH: Apply Data Centers page styling for consistent appearance
      // Apply submenu container styling
      submenu.style.backgroundColor = '#f8f9fa';
      submenu.style.borderBottom = '2px solid #1a56db';
      submenu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      
      if (submenuContainer) {
        submenuContainer.style.maxWidth = '1280px';
        submenuContainer.style.margin = '0 auto';
        submenuContainer.style.padding = '0 1rem';
      }
      
      // Apply styling to columns
      menuColumns.forEach(column => {
        column.style.padding = '1rem';
        
        // Special styling for first column
        if (column.classList.contains('first-column')) {
          column.style.paddingRight = '2rem';
        }
        
        // Border and spacing for column dividers
        if (column.classList.contains('lg:border-l')) {
          column.style.borderLeft = '1px solid rgba(203, 213, 224, 0.5)';
          column.style.paddingLeft = '2rem';
        }
      });
      
      // Apply link styling for consistent appearance
      const menuLinks = submenu.querySelectorAll('.second-column-item, .third-column-content a');
      menuLinks.forEach(link => {
        link.style.color = '#4a5568';
        link.style.transition = 'color 0.2s ease-in-out';
        link.style.fontSize = '0.875rem';
        link.style.lineHeight = '1.25rem';
        link.style.display = 'block';
        link.style.padding = '0.25rem 0';
        
        // Add hover event handlers
        link.addEventListener('mouseenter', function() {
          this.style.color = '#1a56db';
        });
        
        link.addEventListener('mouseleave', function() {
          if (!this.classList.contains('active')) {
            this.style.color = '#4a5568';
          }
        });
        
        // Active link styling
        if (link.classList.contains('active')) {
          link.style.color = '#1a56db';
          link.style.fontWeight = '600';
        }
      });
      
      // Style headings inside menu
      const headings = submenu.querySelectorAll('p.font-semibold');
      headings.forEach(heading => {
        heading.style.color = '#1a56db';
        heading.style.fontSize = '1.25rem';
        heading.style.marginBottom = '1rem';
      });
    }
    
    console.log('Navigation fix initialized');
  }
})(); 