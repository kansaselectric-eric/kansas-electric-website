// Enhanced navigation with dropdown support
document.addEventListener('DOMContentLoaded', function() {
  console.log('Navigation script loaded');
  
  // Mobile menu toggle
  const mobileToggle = document.querySelector('[data-mobile-nav-toggle]');
  const mainNav = document.querySelector('[data-main-menu]');
  
  if (mobileToggle && mainNav) {
    console.log('Mobile menu elements found');
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      mainNav.classList.toggle('closed');
    });
  } else {
    console.log('Mobile menu elements not found', { mobileToggle, mainNav });
  }
  
  // Fix for the third column layout issue
  document.querySelectorAll('.third-column').forEach(column => {
    if (column.classList.contains('w-1/2')) {
      column.classList.remove('w-1/2');
    }
  });
  
  // Test for :has() selector support
  let hasSupport = false;
  try {
    document.querySelector(':has(*)');
    hasSupport = true;
  } catch (e) {
    hasSupport = false;
  }
  console.log(':has() selector support:', hasSupport);
  
  // If :has() is not supported, add a fallback class for styling
  if (!hasSupport) {
    document.querySelectorAll('.third-column').forEach(column => {
      column.classList.add('no-has-support');
    });
  }
  
  // Initialize all third columns to ensure content is visible
  initializeThirdColumns();
  
  // Dropdown menu functionality
  const navItems = document.querySelectorAll('.nav-item');
  console.log('Nav items found:', navItems.length);
  
  // For desktop: enhance hover behavior
  if (window.innerWidth >= 1024) { // lg breakpoint
    console.log('Desktop mode detected');
    navItems.forEach(item => {
      const submenu = item.querySelector('.submenu');
      if (!submenu) {
        console.log('Nav item without submenu:', item);
        return;
      }
      
      console.log('Nav item with submenu:', item);
      
      // Add a small delay before showing/hiding to prevent accidental triggers
      let timeout;
      
      item.addEventListener('mouseenter', function() {
        console.log('Mouse entered nav item:', item);
        clearTimeout(timeout);
        
        // Hide all other submenus
        navItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherSubmenu = otherItem.querySelector('.submenu');
            if (otherSubmenu) {
              otherSubmenu.style.opacity = '0';
              otherSubmenu.style.visibility = 'hidden';
              setTimeout(() => {
                if (otherSubmenu.style.visibility === 'hidden') {
                  otherSubmenu.style.display = 'none';
                }
              }, 300);
            }
          }
        });
        
        // Show this submenu - first set display to flex/block
        submenu.style.display = 'flex';
        console.log('Set submenu display to flex');
        
        // Set the submenu position
        setSubmenuPosition();
        
        // Then make it visible with a slight delay for the transition
        setTimeout(() => {
          submenu.style.opacity = '1';
          submenu.style.visibility = 'visible';
          console.log('Made submenu visible');
          
          // Ensure the third column is visible
          ensureThirdColumnVisible(submenu);
        }, 10);
      });
      
      item.addEventListener('mouseleave', function() {
        console.log('Mouse left nav item:', item);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          submenu.style.opacity = '0';
          submenu.style.visibility = 'hidden';
          console.log('Made submenu invisible');
          setTimeout(() => {
            if (submenu.style.visibility === 'hidden') {
              submenu.style.display = 'none';
              console.log('Set submenu display to none');
            }
          }, 300);
        }, 200);
      });
      
      submenu.addEventListener('mouseenter', function() {
        console.log('Mouse entered submenu');
        clearTimeout(timeout);
      });
      
      submenu.addEventListener('mouseleave', function() {
        console.log('Mouse left submenu');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          submenu.style.opacity = '0';
          submenu.style.visibility = 'hidden';
          console.log('Made submenu invisible');
          setTimeout(() => {
            if (submenu.style.visibility === 'hidden') {
              submenu.style.display = 'none';
              console.log('Set submenu display to none');
            }
          }, 300);
        }, 200);
      });
    });
  } else {
    console.log('Mobile mode detected');
    // For mobile: toggle on click
    navItems.forEach(item => {
      const link = item.querySelector('a');
      const submenu = item.querySelector('.submenu');
      
      if (!submenu || !link) return;
      
      link.addEventListener('click', function(e) {
        console.log('Nav link clicked:', link);
        // If the link has a submenu, prevent navigation and toggle the submenu
        if (submenu) {
          e.preventDefault();
          
          // Toggle this submenu
          const isOpen = submenu.classList.contains('menu-open');
          
          // Close all submenus
          document.querySelectorAll('.submenu').forEach(menu => {
            menu.classList.remove('menu-open');
          });
          
          // Toggle this submenu
          if (!isOpen) {
            submenu.classList.add('menu-open');
            link.classList.add('submenu-open');
          } else {
            link.classList.remove('submenu-open');
          }
        }
      });
    });
  }
  
  // Set the submenu position to eliminate the gap
  function setSubmenuPosition() {
    console.log('Setting submenu position');
    if (window.innerWidth >= 1024) { // lg breakpoint
      // Calculate the header height
      const header = document.querySelector('.site-header');
      let headerHeight = 80; // Default fallback
      
      if (header) {
        headerHeight = header.offsetHeight;
        console.log('Header height:', headerHeight);
        // Set the CSS variable for header height
        document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
      } else {
        console.log('Header element not found');
      }
      
      const submenus = document.querySelectorAll('.submenu');
      console.log('Submenus found:', submenus.length);
      
      submenus.forEach(submenu => {
        console.log('Setting style for submenu:', submenu);
        
        // Don't reset all styles, just apply the positioning styles
        // This preserves display, opacity, and visibility set by hover handlers
        
        // Apply all styles directly as individual properties for maximum compatibility
        submenu.style.position = 'fixed';
        submenu.style.top = `${headerHeight}px`;
        submenu.style.left = '0';
        submenu.style.right = '0';
        submenu.style.width = '100vw';
        submenu.style.marginTop = '0';
        submenu.style.marginLeft = '0';
        submenu.style.marginRight = '0';
        submenu.style.borderTop = 'none';
        submenu.style.zIndex = '9';
        // Don't set display: none here as it will interfere with hover functionality
        
        console.log('Submenu styles set:', {
          position: submenu.style.position,
          top: submenu.style.top,
          left: submenu.style.left,
          width: submenu.style.width,
          zIndex: submenu.style.zIndex,
          display: submenu.style.display
        });
        
        // Force browser to recalculate layout
        submenu.offsetHeight;
      });
    }
  }
  
  // Call setSubmenuPosition on page load and window resize
  setSubmenuPosition();
  window.addEventListener('resize', setSubmenuPosition);
  
  // Ensure the third column is visible in all submenus
  ensureThirdColumnVisibleInAllSubmenus();
  
  // Reinitialize on window resize
  window.addEventListener('resize', function() {
    initThreeColumnMenu();
    ensureThirdColumnVisibleInAllSubmenus();
  });
  
  // Run after a short delay to ensure all elements are fully rendered
  setTimeout(function() {
    setSubmenuPosition();
    initializeThirdColumns();
  }, 100);
  
  // Add event listener for mouse enter on nav items to recalculate submenu position
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      setSubmenuPosition();
      ensureThirdColumnVisibleInAllSubmenus();
    });
  });
  
  // Function to toggle the visibility of submenus
  function toggleSubmenu(submenu) {
    console.log('Toggling submenu:', submenu);
    const isVisible = submenu.style.display === 'flex' && submenu.style.opacity === '1';
    
    // Hide all other submenus
    document.querySelectorAll('.submenu').forEach(menu => {
      if (menu !== submenu) {
        menu.style.display = 'none';
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
      }
    });
    
    // Toggle this submenu
    if (!isVisible) {
      submenu.style.display = 'flex';
      setTimeout(() => {
        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
      }, 10);
      
      // Ensure the third column is visible
      ensureThirdColumnVisible(submenu);
    } else {
      submenu.style.opacity = '0';
      submenu.style.visibility = 'hidden';
      setTimeout(() => {
        if (submenu.style.visibility === 'hidden') {
          submenu.style.display = 'none';
        }
      }, 300);
    }
  }
  
  // Function to ensure the third column is visible
  function ensureThirdColumnVisible(submenu) {
    console.log('Ensuring third column is visible in submenu:', submenu);
    const thirdColumn = submenu.querySelector('.third-column');
    if (!thirdColumn) {
      console.log('No third column found in submenu');
      return;
    }
    
    const thirdColumnContent = thirdColumn.querySelectorAll('.third-column-content');
    if (thirdColumnContent.length === 0) {
      console.log('No third column content found');
      return;
    }
    
    // Check if any third column content is active
    const activeContent = thirdColumn.querySelector('.third-column-content.active');
    
    // If no content is active, activate the first one
    if (!activeContent && thirdColumnContent.length > 0) {
      console.log('No active content found, activating first one');
      thirdColumnContent[0].classList.add('active');
    }
  }
  
  // Function to ensure the third column is visible in all submenus
  function ensureThirdColumnVisibleInAllSubmenus() {
    console.log('Ensuring third column is visible in all submenus');
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
      ensureThirdColumnVisible(submenu);
    });
  }
  
  // Function to initialize the three-column menu
  function initThreeColumnMenu() {
    console.log('Initializing three-column menu');
    const secondColumnItems = document.querySelectorAll('.second-column-item');
    console.log('Second column items found:', secondColumnItems.length);
    
    secondColumnItems.forEach(item => {
      const link = item.querySelector('a');
      if (!link) {
        console.log('No link found in second column item:', item);
        return;
      }
      
      const targetId = link.getAttribute('data-target');
      if (!targetId) {
        console.log('No data-target attribute found on link:', link);
        return;
      }
      
      const targetContent = document.getElementById(targetId);
      if (!targetContent) {
        console.log('Target content not found for ID:', targetId);
        return;
      }
      
      console.log('Found target content for ID:', targetId);
      
      // For desktop: show on hover
      if (window.innerWidth >= 1024) { // lg breakpoint
        item.addEventListener('mouseenter', function() {
          console.log('Mouse entered second column item:', item);
          
          // Remove active class from all second column items
          document.querySelectorAll('.second-column-item').forEach(otherItem => {
            otherItem.classList.remove('active');
          });
          
          // Add active class to this item
          item.classList.add('active');
          
          // Hide all third column content
          document.querySelectorAll('.third-column-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Show the target content
          targetContent.classList.add('active');
        });
      } else {
        // For mobile: toggle on click
        link.addEventListener('click', function(e) {
          console.log('Second column link clicked:', link);
          e.preventDefault();
          
          // Toggle active class on this item
          item.classList.toggle('active');
          
          // Toggle the target content
          targetContent.classList.toggle('active');
        });
      }
    });
  }
  
  // Initialize the three-column menu
  initThreeColumnMenu();
  
  // Keyboard navigation support
  document.addEventListener('keydown', function(e) {
    console.log('Key pressed:', e.key);
    // If Escape key is pressed, trigger mouseleave on the active nav item
    if (e.key === 'Escape') {
      const activeNavItem = document.querySelector('.nav-item:hover');
      if (activeNavItem) {
        console.log('Triggering mouseleave on active nav item');
        const event = new MouseEvent('mouseleave', {
          bubbles: true,
          cancelable: true,
        });
        activeNavItem.dispatchEvent(event);
      }
    }
    
    // Arrow key navigation within the submenu
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const activeSubmenu = document.querySelector('.submenu[style*="opacity: 1"]');
      if (!activeSubmenu) return;
      
      const secondColumnItems = activeSubmenu.querySelectorAll('.second-column-item');
      const activeSecondItem = activeSubmenu.querySelector('.second-column-item.active');
      
      const thirdColumnItems = activeSubmenu.querySelectorAll('.third-column-content.active a');
      const focusedElement = document.activeElement;
      
      // Check if focus is in the second column
      const isInSecondColumn = Array.from(secondColumnItems).some(item => 
        item.contains(focusedElement)
      );
      
      // Check if focus is in the third column
      const isInThirdColumn = Array.from(thirdColumnItems).some(item => 
        item === focusedElement
      );
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        
        if (isInSecondColumn) {
          // Move to the next item in the second column
          const currentIndex = Array.from(secondColumnItems).findIndex(item => 
            item.contains(focusedElement)
          );
          
          if (currentIndex < secondColumnItems.length - 1) {
            const nextItem = secondColumnItems[currentIndex + 1].querySelector('a');
            if (nextItem) nextItem.focus();
          }
        } else if (isInThirdColumn) {
          // Move to the next item in the third column
          const currentIndex = Array.from(thirdColumnItems).findIndex(item => 
            item === focusedElement
          );
          
          if (currentIndex < thirdColumnItems.length - 1) {
            thirdColumnItems[currentIndex + 1].focus();
          }
        } else {
          // If no focus in either column, focus the first item in the second column
          const firstItem = secondColumnItems[0]?.querySelector('a');
          if (firstItem) firstItem.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        
        if (isInSecondColumn) {
          // Move to the previous item in the second column
          const currentIndex = Array.from(secondColumnItems).findIndex(item => 
            item.contains(focusedElement)
          );
          
          if (currentIndex > 0) {
            const prevItem = secondColumnItems[currentIndex - 1].querySelector('a');
            if (prevItem) prevItem.focus();
          }
        } else if (isInThirdColumn) {
          // Move to the previous item in the third column
          const currentIndex = Array.from(thirdColumnItems).findIndex(item => 
            item === focusedElement
          );
          
          if (currentIndex > 0) {
            thirdColumnItems[currentIndex - 1].focus();
          }
        }
      } else if (e.key === 'ArrowRight' && isInSecondColumn) {
        e.preventDefault();
        
        // Move from second column to third column
        const activeThirdContent = activeSubmenu.querySelector('.third-column-content.active');
        if (activeThirdContent) {
          const firstLink = activeThirdContent.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      } else if (e.key === 'ArrowLeft' && isInThirdColumn) {
        e.preventDefault();
        
        // Move from third column to second column
        if (activeSecondItem) {
          const link = activeSecondItem.querySelector('a');
          if (link) link.focus();
        }
      }
    }
  });
  
  // Function to initialize third columns
  function initializeThirdColumns() {
    console.log('Initializing third columns');
    document.querySelectorAll('.submenu').forEach(submenu => {
      const thirdColumn = submenu.querySelector('.third-column');
      if (!thirdColumn) {
        console.log('No third column found in submenu');
        return;
      }
      
      const thirdColumnContent = thirdColumn.querySelectorAll('.third-column-content');
      if (thirdColumnContent.length === 0) {
        console.log('No third column content found');
        return;
      }
      
      // Check if any third column content is active
      const activeContent = thirdColumn.querySelector('.third-column-content.active');
      
      // If no content is active, activate the first one
      if (!activeContent && thirdColumnContent.length > 0) {
        console.log('No active content found, activating first one');
        thirdColumnContent[0].classList.add('active');
      }
    });
  }
}); 