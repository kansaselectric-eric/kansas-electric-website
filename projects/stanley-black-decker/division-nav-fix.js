/**
 * Division Navigation Menu Fix
 * 
 * This script ensures the navigation menus on division pages display correctly in a three-column layout,
 * exactly matching the behavior and appearance of the home page menu.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Only run on screens larger than mobile
  if (window.innerWidth < 768) return;
  
  // Add needed CSS to ensure consistent menu display
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Fix for three-column menu layout */
    @media (min-width: 1024px) {
      /* Main three-column menu structure */
      .three-column-menu {
        display: flex !important;
        flex-wrap: nowrap !important;
        width: 100% !important;
        flex-direction: row !important;
        align-items: flex-start !important;
      }
      
      /* Submenu container layout */
      .submenu-container {
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
        max-width: 1200px !important;
        margin: 0 auto !important;
        padding: 0 40px !important;
      }
      
      /* Column sizing */
      .menu-column {
        transition: all 0.3s ease !important;
      }
      
      .first-column {
        flex: 0 0 25% !important;
        width: auto !important;
      }
      
      .second-column {
        flex: 0 0 25% !important;
        width: auto !important;
      }
      
      .third-column {
        flex: 0 0 50% !important;
        position: relative !important;
        width: auto !important;
      }
      
      /* Override width classes that might be causing issues */
      .third-column.w-1\\/2,
      .submenu-container .w-1\\/2,
      .submenu-container .third-column.w-1\\/2 {
        width: auto !important;
        flex: 0 0 50% !important;
      }
      
      /* Fix second column items */
      .second-column-item {
        position: relative !important;
        transition: color 0.3s ease, padding-left 0.2s ease !important;
      }
      
      .second-column-item:hover, 
      .second-column-item.active {
        color: #0076C5 !important;
        padding-left: 0.5rem !important;
      }
      
      /* Fix third column content display */
      .third-column-content {
        display: none !important;
        opacity: 0 !important;
        transform: translateY(10px) !important;
        transition: opacity 0.3s ease, transform 0.3s ease !important;
      }
      
      .third-column-content.active {
        display: block !important;
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      /* Ensure the submenu displays on hover */
      .nav-item:hover .submenu {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* Position submenu correctly */
      .submenu {
        position: fixed !important;
        top: var(--header-height, 80px) !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-width: none !important;
        transform: none !important;
        margin: 0 !important;
        padding-top: 3rem !important;
        padding-bottom: 3rem !important;
        border-top: none !important;
        z-index: 100 !important;
      }
      
      /* Make nav-item position static for proper submenu positioning */
      .nav-item {
        position: static !important;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
  
  // Set up event handlers for second column items
  document.querySelectorAll('.second-column-item').forEach(item => {
    item.addEventListener('click', function(e) {
      // Get the target ID
      const targetId = this.getAttribute('data-target');
      if (!targetId) return;
      
      // Don't prevent default if this is a division link
      if (this.classList.contains('division-nav-link') || 
          this.getAttribute('href')?.includes('/services/divisions/')) {
        return;
      }
      
      // Prevent default for tab switching
      e.preventDefault();
      
      // Remove active class from all second column items
      document.querySelectorAll('.second-column-item').forEach(secondItem => {
        secondItem.classList.remove('active');
      });
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Get parent third column
      const thirdColumn = this.closest('.submenu-container').querySelector('.third-column');
      if (!thirdColumn) return;
      
      // Hide all third column content
      const thirdColumnContents = thirdColumn.querySelectorAll('.third-column-content');
      thirdColumnContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the target third column content
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
  
  // Set header height CSS variable for positioning
  const setHeaderHeight = () => {
    const header = document.querySelector('.site-header');
    if (header) {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  };
  
  // Run once on load
  setHeaderHeight();
  
  // Update on resize
  window.addEventListener('resize', setHeaderHeight);
}); 