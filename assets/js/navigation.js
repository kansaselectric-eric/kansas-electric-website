// Enhanced navigation with dropdown support
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileToggle = document.querySelector('[data-mobile-nav-toggle]');
  const mainNav = document.querySelector('[data-main-menu]');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      mainNav.classList.toggle('closed');
    });
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
  
  // For desktop: enhance hover behavior
  if (window.innerWidth >= 1024) { // lg breakpoint
    navItems.forEach(item => {
      const submenu = item.querySelector('.submenu');
      if (!submenu) return;
      
      // Add a small delay before showing/hiding to prevent accidental triggers
      let timeout;
      
      item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        
        // Hide all other submenus first
        document.querySelectorAll('.submenu').forEach(menu => {
          if (menu !== submenu) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            setTimeout(() => {
              if (menu.style.visibility === 'hidden') {
                menu.style.display = 'none';
              }
            }, 300);
          }
        });
        
        // Show this submenu - first set display to flex/block
        submenu.style.display = 'flex';
        
        // Set the submenu position
        setSubmenuPosition();
        
        // Then make it visible with a slight delay for the transition
        setTimeout(() => {
          submenu.style.opacity = '1';
          submenu.style.visibility = 'visible';
          
          // Ensure a third column is visible
          ensureThirdColumnVisible(submenu);
        }, 10);
      });
      
      item.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          submenu.style.opacity = '0';
          submenu.style.visibility = 'hidden';
          setTimeout(() => {
            if (submenu.style.visibility === 'hidden') {
              submenu.style.display = 'none';
            }
          }, 300);
        }, 200);
      });
      
      submenu.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
      });
      
      submenu.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          submenu.style.opacity = '0';
          submenu.style.visibility = 'hidden';
          setTimeout(() => {
            if (submenu.style.visibility === 'hidden') {
              submenu.style.display = 'none';
            }
          }, 300);
        }, 200);
      });
    });
  }
  
  // For mobile: toggle submenu on click
  if (window.innerWidth < 1024) {
    navItems.forEach(item => {
      const link = item.querySelector('a');
      const submenu = item.querySelector('.submenu');
      if (!submenu || !link) return;
      
      link.addEventListener('click', (e) => {
        // If the link has a submenu and we're on mobile, prevent navigation
        if (window.innerWidth < 1024 && submenu) {
          e.preventDefault();
          
          // Toggle this submenu
          if (submenu.style.display === 'block') {
            submenu.style.display = 'none';
          } else {
            // Hide all other submenus first
            document.querySelectorAll('.submenu').forEach(menu => {
              if (menu !== submenu) {
                menu.style.display = 'none';
              }
            });
            submenu.style.display = 'block';
            
            // Ensure a third column is visible
            ensureThirdColumnVisible(submenu);
          }
        }
      });
    });
  }
  
  // Function to ensure a third column is always visible
  function ensureThirdColumnVisible(submenu) {
    if (!submenu) return;
    
    const thirdColumnContents = submenu.querySelectorAll('.third-column-content');
    const activeThirdColumnContent = submenu.querySelector('.third-column-content.active');
    
    // If no third column content is active and there are third column contents available
    if (!activeThirdColumnContent && thirdColumnContents.length > 0) {
      // Find the first second column item and activate it
      const firstSecondColumnItem = submenu.querySelector('.second-column-item');
      if (firstSecondColumnItem) {
        // Remove active class from all second column items
        submenu.querySelectorAll('.second-column-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to the first item
        firstSecondColumnItem.classList.add('active');
        
        // Get the target ID and activate the corresponding third column content
        const targetId = firstSecondColumnItem.getAttribute('data-target');
        if (targetId) {
          const targetContent = document.getElementById(targetId);
          if (targetContent) {
            // Remove active class from all third column contents
            thirdColumnContents.forEach(content => {
              content.classList.remove('active');
            });
            
            // Add active class to the target content
            targetContent.classList.add('active');
          } else {
            // If target content not found, show the first third column content
            if (thirdColumnContents.length > 0) {
              thirdColumnContents.forEach(content => {
                content.classList.remove('active');
              });
              thirdColumnContents[0].classList.add('active');
            }
          }
        } else {
          // If no target ID, show the first third column content
          if (thirdColumnContents.length > 0) {
            thirdColumnContents.forEach(content => {
              content.classList.remove('active');
            });
            thirdColumnContents[0].classList.add('active');
          }
        }
      } else {
        // If no second column item, show the first third column content
        if (thirdColumnContents.length > 0) {
          thirdColumnContents.forEach(content => {
            content.classList.remove('active');
          });
          thirdColumnContents[0].classList.add('active');
        }
      }
    }
    
    // Double-check: if still no active third column content, force the first one to be active
    const recheckActiveContent = submenu.querySelector('.third-column-content.active');
    if (!recheckActiveContent && thirdColumnContents.length > 0) {
      thirdColumnContents[0].classList.add('active');
    }
  }
  
  // Three-column menu functionality
  function initThreeColumnMenu() {
    // Get all second column items
    const secondColumnItems = document.querySelectorAll('.second-column-item');
    
    // For each second column item, add event listeners
    secondColumnItems.forEach(item => {
      const targetId = item.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      
      // Handle hover on desktop
      if (window.innerWidth >= 1024) {
        item.addEventListener('mouseenter', () => {
          // Remove active class from all second column items
          secondColumnItems.forEach(i => i.classList.remove('active'));
          
          // Add active class to current item
          item.classList.add('active');
          
          // Hide all third column content
          document.querySelectorAll('.third-column-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Show target content with fade-in effect
          if (targetContent) {
            targetContent.classList.add('active');
          }
        });
      }
      
      // Handle click on mobile
      item.addEventListener('click', (e) => {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          
          // Remove active class from all second column items
          secondColumnItems.forEach(i => i.classList.remove('active'));
          
          // Add active class to current item
          item.classList.add('active');
          
          // Hide all third column content
          document.querySelectorAll('.third-column-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Show target content
          if (targetContent) {
            targetContent.classList.add('active');
          }
        }
      });
    });
    
    // Ensure third column is visible in all submenus
    document.querySelectorAll('.submenu').forEach(submenu => {
      ensureThirdColumnVisible(submenu);
    });
  }
  
  // Initialize three-column menu
  initThreeColumnMenu();
  
  // Ensure video carousel remains visible
  const ensureVideoVisibility = () => {
    const carousel = document.getElementById('video-carousel');
    const homeSlider = document.querySelector('[data-home-slider]');
    const activeVideo = document.querySelector('#video-carousel video.active');
    
    if (carousel) carousel.style.opacity = '1';
    if (homeSlider) homeSlider.style.opacity = '1';
    if (activeVideo) {
      activeVideo.style.opacity = '1';
      activeVideo.style.visibility = 'visible';
    }
  };
  
  // Run initially and after any menu interaction
  ensureVideoVisibility();
  document.addEventListener('mouseover', ensureVideoVisibility);
  document.addEventListener('click', ensureVideoVisibility);
  
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
        
        // Force browser to recalculate layout
        submenu.offsetHeight;
      });
    }
  }
  
  // Run on load and resize
  setSubmenuPosition();
  window.addEventListener('resize', () => {
    setSubmenuPosition();
    initThreeColumnMenu(); // Reinitialize three-column menu on resize
    
    // Ensure third column is visible in all submenus
    document.querySelectorAll('.submenu').forEach(submenu => {
      ensureThirdColumnVisible(submenu);
    });
    
    // Initialize all third columns
    initializeThirdColumns();
  });
  
  // Also run when the page is fully loaded to ensure correct positioning
  window.addEventListener('load', () => {
    setSubmenuPosition();
    initThreeColumnMenu(); // Ensure three-column menu is initialized
    
    // Ensure third column is visible in all submenus
    document.querySelectorAll('.submenu').forEach(submenu => {
      ensureThirdColumnVisible(submenu);
    });
    
    // Initialize all third columns
    initializeThirdColumns();
  });
  
  // Run again after a short delay to ensure all elements are fully rendered
  setTimeout(() => {
    setSubmenuPosition();
    initThreeColumnMenu();
    
    // Ensure third column is visible in all submenus
    document.querySelectorAll('.submenu').forEach(submenu => {
      ensureThirdColumnVisible(submenu);
    });
    
    // Initialize all third columns
    initializeThirdColumns();
  }, 100);
  
  // Add event listener for when the user hovers over a nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Recalculate submenu position when hovering
      setSubmenuPosition();
      
      // Ensure third column is visible
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        ensureThirdColumnVisible(submenu);
      }
    });
  });
  
  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Only handle keyboard navigation when a submenu is visible
    const activeSubmenu = document.querySelector('.submenu[style*="display: block"]');
    if (!activeSubmenu) return;
    
    const activeNavItem = document.querySelector('.nav-item:hover');
    if (!activeNavItem) return;
    
    // Handle arrow keys for second column navigation
    const secondColumnItems = activeSubmenu.querySelectorAll('.second-column-item');
    const activeSecondItem = activeSubmenu.querySelector('.second-column-item.active');
    
    if (secondColumnItems.length && activeSecondItem) {
      const currentIndex = Array.from(secondColumnItems).indexOf(activeSecondItem);
      
      // Arrow down: move to next item
      if (e.key === 'ArrowDown' && currentIndex < secondColumnItems.length - 1) {
        e.preventDefault();
        secondColumnItems[currentIndex + 1].dispatchEvent(new MouseEvent('mouseenter'));
        secondColumnItems[currentIndex + 1].focus();
      }
      
      // Arrow up: move to previous item
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        secondColumnItems[currentIndex - 1].dispatchEvent(new MouseEvent('mouseenter'));
        secondColumnItems[currentIndex - 1].focus();
      }
      
      // Arrow right: focus on third column
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const targetId = activeSecondItem.getAttribute('data-target');
        const thirdColumnLinks = document.querySelectorAll(`#${targetId} a`);
        if (thirdColumnLinks.length) {
          thirdColumnLinks[0].focus();
        }
      }
    }
    
    // Handle Escape key to close submenu
    if (e.key === 'Escape') {
      activeNavItem.dispatchEvent(new MouseEvent('mouseleave'));
    }
  });
  
  // Function to initialize all third columns
  function initializeThirdColumns() {
    document.querySelectorAll('.submenu-container').forEach(container => {
      const thirdColumn = container.querySelector('.third-column');
      if (!thirdColumn) return;
      
      const thirdColumnContents = thirdColumn.querySelectorAll('.third-column-content');
      const activeThirdColumnContent = thirdColumn.querySelector('.third-column-content.active');
      
      // If no third column content is active, activate the first one
      if (!activeThirdColumnContent && thirdColumnContents.length > 0) {
        // Also activate the corresponding second column item
        const firstContent = thirdColumnContents[0];
        const contentId = firstContent.id;
        
        // Find and activate the second column item that targets this content
        const secondColumnItem = container.querySelector(`.second-column-item[data-target="${contentId}"]`);
        if (secondColumnItem) {
          // Remove active class from all second column items
          container.querySelectorAll('.second-column-item').forEach(item => {
            item.classList.remove('active');
          });
          
          // Add active class to this item
          secondColumnItem.classList.add('active');
        }
        
        // Activate the first content
        thirdColumnContents.forEach(content => {
          content.classList.remove('active');
        });
        firstContent.classList.add('active');
      }
    });
  }
}); 