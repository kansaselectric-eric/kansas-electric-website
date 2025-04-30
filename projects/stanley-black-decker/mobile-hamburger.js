// Mobile Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create hamburger button and overlay elements
  createMobileMenuElements();
  
  // Initialize the mobile menu functionality
  initMobileMenu();
  
  // Handle window resize to reset menu state
  window.addEventListener('resize', handleResize);
});

/**
 * Creates the necessary mobile menu elements
 */
function createMobileMenuElements() {
  // Create the hamburger toggle button
  const hamburgerToggle = document.createElement('button');
  hamburgerToggle.className = 'hamburger-toggle';
  hamburgerToggle.setAttribute('aria-label', 'Toggle mobile menu');
  hamburgerToggle.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  
  // Create the overlay element
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  
  // Get the header element
  const header = document.querySelector('.site-header');
  
  // Add the toggle button to the header
  if (header) {
    const logoContainer = header.querySelector('.md\\:w-11\\/12');
    if (logoContainer) {
      logoContainer.appendChild(hamburgerToggle);
    } else {
      header.appendChild(hamburgerToggle);
    }
    
    // Add the overlay to the body
    document.body.appendChild(overlay);
  }
}

/**
 * Initializes the mobile menu functionality
 */
function initMobileMenu() {
  const hamburgerToggle = document.querySelector('.hamburger-toggle');
  const mobileMenu = document.querySelector('.main-navigation');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const navItems = document.querySelectorAll('.nav-item');
  
  if (hamburgerToggle && mobileMenu) {
    // Toggle the menu when hamburger is clicked
    hamburgerToggle.addEventListener('click', function() {
      toggleMobileMenu();
    });
    
    // Close menu when overlay is clicked
    if (overlay) {
      overlay.addEventListener('click', function() {
        closeMobileMenu();
      });
    }
    
    // Handle submenu toggles
    navItems.forEach(function(item) {
      const link = item.querySelector('a');
      const submenu = item.querySelector('.submenu');
      
      if (link && submenu && window.innerWidth < 768) {
        link.addEventListener('click', function(e) {
          // Prevent navigation for links with submenus
          if (submenu) {
            e.preventDefault();
            toggleSubmenu(item);
          }
        });
      }
    });
    
    // Add escape key listener to close menu
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }
}

/**
 * Toggles the mobile menu open/closed
 */
function toggleMobileMenu() {
  const hamburgerToggle = document.querySelector('.hamburger-toggle');
  const mobileMenu = document.querySelector('.main-navigation');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (hamburgerToggle && mobileMenu) {
    hamburgerToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
    
    if (overlay) {
      overlay.classList.toggle('open');
    }
  }
}

/**
 * Closes the mobile menu
 */
function closeMobileMenu() {
  const hamburgerToggle = document.querySelector('.hamburger-toggle');
  const mobileMenu = document.querySelector('.main-navigation');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (hamburgerToggle && mobileMenu) {
    hamburgerToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    
    if (overlay) {
      overlay.classList.remove('open');
    }
    
    // Close any open submenus
    document.querySelectorAll('.nav-item.open').forEach(function(item) {
      item.classList.remove('open');
    });
  }
}

/**
 * Toggles a submenu open/closed
 */
function toggleSubmenu(item) {
  // Check if we're in mobile view
  if (window.innerWidth >= 768) {
    return;
  }
  
  const wasOpen = item.classList.contains('open');
  
  // Close all other open items
  document.querySelectorAll('.nav-item.open').forEach(function(openItem) {
    if (openItem !== item) {
      openItem.classList.remove('open');
    }
  });
  
  // Toggle this item
  if (wasOpen) {
    item.classList.remove('open');
  } else {
    item.classList.add('open');
  }
}

/**
 * Handles window resize events
 */
function handleResize() {
  // If we resize to desktop view, reset mobile menu
  if (window.innerWidth >= 768) {
    closeMobileMenu();
  }
} 