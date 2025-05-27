/**
 * Kansas Electric - Premium Click-Only Navigation System
 * 
 * Features:
 * - Click-only dropdown triggers (no hover)
 * - Single dropdown open at a time
 * - Progressive content display with proper flex-based icon alignment
 * - Full accessibility compliance (ARIA attributes, keyboard navigation)
 * - Keyboard navigation support (Tab, Enter, Escape)
 * - Mobile responsiveness (preserves existing mobile menu)
 * - Smooth icon rotation animations
 * - Full-width dropdown alignment with viewport edge
 */

console.log('🔧 Kansas Electric Navigation System - Initializing...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM loaded - Setting up navigation systems...');
  
  // Set header height for dropdown positioning
  setHeaderHeight();
  
  // Initialize both navigation systems
  setupClickBasedNavigation();
  setupMobileNavigation();
  
  console.log('✅ Navigation systems initialized successfully');
});

/**
 * Calculate and set header height for dropdown positioning
 */
function setHeaderHeight() {
  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (header) {
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    console.log(`📏 Header height set to: ${headerHeight}px`);
    
    // Update on window resize
    window.addEventListener('resize', function() {
      const newHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${newHeight}px`);
    });
  }
}

/**
 * CLICK-BASED NAVIGATION SYSTEM
 * Handles desktop/tablet navigation with intentional click interactions
 */
function setupClickBasedNavigation() {
  console.log('🖱️ Setting up click-based navigation for desktop/tablet...');
  
  // Apply CSS overrides to completely remove hover behavior
  injectClickNavigationCSS();
  
  // Initialize click navigation
  initializeClickNavigation();
  
  // Setup progressive content display
  initializeAllProgressiveContent();
  
  // Add nuclear hover prevention
  preventAllHoverBehavior();
  
  console.log('✅ Click-based navigation setup complete');
}

function injectClickNavigationCSS() {
  console.log('🎨 Injecting click-navigation CSS overrides...');
  
  // Remove any existing click navigation styles
  const existingStyle = document.getElementById('click-navigation-override');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const css = `
    /* NUCLEAR HOVER REMOVAL - Override ALL possible hover behaviors */
    .nav-item:hover .submenu,
    .nav-item:hover .submenu.show,
    .nav-item:hover .submenu.active,
    .nav-item:focus-within .submenu,
    .nav-item.hover .submenu,
    .main-navigation li:hover > .submenu,
    .main-navigation .submenu:hover,
    .main-navigation .submenu .service-link:hover + .sub-submenu,
    .main-menu .submenu .service-link:hover + .sub-submenu,
    html body .main-navigation li:hover > .submenu,
    html body .main-navigation .submenu:hover,
    html body .main-navigation .submenu .service-link:hover + .sub-submenu,
    html body .main-menu .submenu .service-link:hover + .sub-submenu {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transform: none !important;
    }
    
    /* Default submenu state - completely hidden */
    .submenu {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    
    /* Click-based dropdown behavior - ONLY way to show dropdowns */
    .nav-item.dropdown-open .submenu {
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transition: opacity 0.2s ease-out !important;
    }
    
    /* Icon rotation for dropdown state */
    .nav-item > a svg {
      transition: transform 0.2s ease-in-out;
    }
    
    .nav-item.dropdown-open > a svg {
      transform: rotate(180deg);
    }
    
    /* Focus states for accessibility */
    .nav-item > a:focus {
      outline: 2px solid #0076C5;
      outline-offset: 2px;
    }
    
    /* Ensure flex layout for navigation items */
    .nav-item > a {
      display: flex;
      align-items: center;
    }
    
    .nav-item > a > div {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      width: 100%;
    }
    
    /* Prevent any hover behavior on navigation items */
    .nav-item:hover,
    .nav-item:focus-within,
    .nav-item.hover {
      background-color: transparent !important;
    }
    
    /* Override any conflicting styles from main.css with maximum specificity */
    @media (min-width: 768px) {
      html body .main-navigation .submenu.menu-open {
        display: none !important;
      }
      
      html body .main-navigation .submenu {
        display: none !important;
      }
      
      html body .nav-item:hover .submenu,
      html body .nav-item:focus-within .submenu,
      html body .nav-item.hover .submenu {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    }
  `;
  
  const style = document.createElement('style');
  style.id = 'click-navigation-override';
  style.textContent = css;
  document.head.appendChild(style);
  console.log('✅ Click-navigation CSS overrides applied');
}

function preventAllHoverBehavior() {
  console.log('🚫 Implementing nuclear hover prevention...');
  
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach((navItem) => {
    const link = navItem.querySelector('a');
    const submenu = navItem.querySelector('.submenu');
    
    if (link && submenu) {
      // Prevent all hover events on navigation items
      ['mouseenter', 'mouseover', 'mouseleave', 'mouseout'].forEach(eventType => {
        navItem.addEventListener(eventType, function(e) {
          e.stopPropagation();
          e.preventDefault();
          
          // Ensure submenu stays hidden unless explicitly opened
          if (!navItem.classList.contains('dropdown-open')) {
            submenu.style.display = 'none';
            submenu.style.opacity = '0';
            submenu.style.visibility = 'hidden';
            submenu.style.pointerEvents = 'none';
          }
        }, true);
        
        link.addEventListener(eventType, function(e) {
          e.stopPropagation();
          e.preventDefault();
        }, true);
        
        submenu.addEventListener(eventType, function(e) {
          e.stopPropagation();
          
          // Allow hover within open submenu for progressive content
          if (navItem.classList.contains('dropdown-open')) {
            return;
          }
          
          e.preventDefault();
        }, true);
      });
    }
  });
  
  console.log('✅ Nuclear hover prevention implemented');
}

function initializeClickNavigation() {
  console.log('🔧 Initializing click navigation behavior...');
  
  const navItems = document.querySelectorAll('.nav-item');
  console.log(`📋 Found ${navItems.length} navigation items`);
  
  navItems.forEach((navItem, index) => {
    const link = navItem.querySelector('a');
    const submenu = navItem.querySelector('.submenu');
    
    if (link && submenu) {
      console.log(`🔗 Setting up nav item ${index + 1}: "${link.textContent.trim()}"`);
      
      // Add accessibility attributes
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('aria-controls', `submenu-${index}`);
      
      submenu.setAttribute('id', `submenu-${index}`);
      submenu.setAttribute('role', 'menu');
      
      // Remove any existing event listeners to prevent conflicts
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add click event listener with highest priority
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log(`🖱️ Clicked: "${newLink.textContent.trim()}"`);
        
        const isCurrentlyOpen = navItem.classList.contains('dropdown-open');
        
        // Close all other dropdowns
        closeAllDropdowns();
        
        // Toggle current dropdown
        if (!isCurrentlyOpen) {
          openDropdown(navItem, newLink, submenu);
        }
      }, true);
      
      // Add keyboard support
      newLink.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          newLink.click();
        }
        
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          closeAllDropdowns();
          newLink.focus();
        }
      }, true);
    }
  });
  
  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item')) {
      console.log('🖱️ Outside click detected - closing all dropdowns');
      closeAllDropdowns();
    }
  }, true);
  
  // Close dropdowns on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      console.log('⌨️ Escape key pressed - closing all dropdowns');
      closeAllDropdowns();
    }
  }, true);
  
  console.log('✅ Click navigation behavior initialized');
}

function openDropdown(navItem, link, submenu) {
  console.log(`📂 Opening dropdown: "${link.textContent.trim()}"`);
  
  navItem.classList.add('dropdown-open');
  link.setAttribute('aria-expanded', 'true');
  
  // Initialize progressive content for this submenu
  initializeProgressiveContent(submenu);
  
  // Focus management
  const firstFocusableElement = submenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
  if (firstFocusableElement) {
    setTimeout(() => firstFocusableElement.focus(), 100);
  }
}

function closeAllDropdowns() {
  const openDropdowns = document.querySelectorAll('.nav-item.dropdown-open');
  
  openDropdowns.forEach(navItem => {
    const link = navItem.querySelector('a');
    
    console.log(`📁 Closing dropdown: "${link.textContent.trim()}"`);
    
    navItem.classList.remove('dropdown-open');
    link.setAttribute('aria-expanded', 'false');
  });
}

function initializeAllProgressiveContent() {
  console.log('🔄 Initializing progressive content for all submenus...');
  
  const submenus = document.querySelectorAll('.submenu');
  submenus.forEach((submenu, index) => {
    console.log(`📋 Setting up progressive content for submenu ${index + 1}`);
    initializeProgressiveContent(submenu);
  });
  
  console.log('✅ Progressive content initialization complete');
}

function initializeProgressiveContent(submenu) {
  const secondColumnItems = submenu.querySelectorAll('.second-column-item');
  const thirdColumnContents = submenu.querySelectorAll('.third-column-content');
  
  console.log(`📊 Found ${secondColumnItems.length} second column items and ${thirdColumnContents.length} third column contents`);
  
  // Set up click/hover interactions for second column items
  secondColumnItems.forEach((item, index) => {
    const targetId = item.getAttribute('data-target');
    
    if (targetId) {
      console.log(`🎯 Setting up progressive content for: "${item.textContent.trim()}" -> ${targetId}`);
      
      // Add accessibility attributes
      item.setAttribute('role', 'menuitem');
      item.setAttribute('aria-controls', targetId);
      
      // Add click event for progressive content
      item.addEventListener('click', function(e) {
        handleSecondColumnInteraction(item, e);
      });
      
      // Add hover event for progressive content (desktop enhancement)
      item.addEventListener('mouseenter', function(e) {
        if (window.innerWidth >= 768) {
          handleSecondColumnInteraction(item, e);
        }
      });
      
      // Add keyboard support
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSecondColumnInteraction(item, e);
        }
      });
    }
  });
  
  // Ensure first item is active by default
  if (secondColumnItems.length > 0 && thirdColumnContents.length > 0) {
    const firstItem = secondColumnItems[0];
    const firstTargetId = firstItem.getAttribute('data-target');
    
    if (firstTargetId) {
      console.log(`🎯 Setting default active state for: ${firstTargetId}`);
      
      // Remove active class from all items and contents
      secondColumnItems.forEach(item => item.classList.remove('active'));
      thirdColumnContents.forEach(content => content.classList.remove('active'));
      
      // Set first item as active
      firstItem.classList.add('active');
      const firstContent = submenu.querySelector(`#${firstTargetId}`);
      if (firstContent) {
        firstContent.classList.add('active');
      }
    }
  }
}

function handleSecondColumnInteraction(item, event) {
  const targetId = item.getAttribute('data-target');
  const submenu = item.closest('.submenu');
  
  if (!targetId || !submenu) return;
  
  console.log(`🎯 Progressive content interaction: "${item.textContent.trim()}" -> ${targetId}`);
  
  // Remove active class from all second column items in this submenu
  const allSecondColumnItems = submenu.querySelectorAll('.second-column-item');
  allSecondColumnItems.forEach(secondItem => {
        secondItem.classList.remove('active');
      });
      
      // Add active class to clicked item
  item.classList.add('active');
  
  // Hide all third column content in this submenu
  const allThirdColumnContent = submenu.querySelectorAll('.third-column-content');
  allThirdColumnContent.forEach(content => {
        content.classList.remove('active');
      });
      
  // Show target content with smooth transition
  const targetContent = submenu.querySelector(`#${targetId}`);
      if (targetContent) {
    console.log(`✅ Showing content: ${targetId}`);
    
    // Add a small delay for smooth transition
    setTimeout(() => {
        targetContent.classList.add('active');
    }, 50);
  } else {
    console.warn(`⚠️ Target content not found: ${targetId}`);
  }
}

/**
 * MOBILE NAVIGATION SYSTEM
 * Handles mobile hamburger menu functionality
 */
function setupMobileNavigation() {
  console.log('📱 Setting up mobile navigation...');
  
  const mobileToggle = document.querySelector('[data-mobile-nav-toggle]');
  const mainMenu = document.querySelector('[data-main-menu]');
  
  if (!mobileToggle || !mainMenu) {
    console.warn('⚠️ Mobile navigation elements not found');
    return;
  }
  
  console.log('📱 Mobile navigation elements found - setting up interactions');
  
  // Mobile menu toggle functionality
  mobileToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isOpen = !mainMenu.classList.contains('closed');
    
    if (isOpen) {
      console.log('📱 Closing mobile menu');
      closeMenu();
    } else {
      console.log('📱 Opening mobile menu');
      openMenu();
    }
  });
  
  // Close mobile menu on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('[data-main-menu]') && !e.target.closest('[data-mobile-nav-toggle]')) {
      if (!mainMenu.classList.contains('closed')) {
        console.log('📱 Outside click - closing mobile menu');
        closeMenu();
      }
    }
  });
  
  // Close mobile menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !mainMenu.classList.contains('closed')) {
      console.log('📱 Escape key - closing mobile menu');
      closeMenu();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) {
      console.log('📱 Desktop size detected - closing mobile menu');
      closeMenu();
    }
  });
  
  function openMenu() {
    mainMenu.classList.remove('closed');
    mobileToggle.setAttribute('aria-expanded', 'true');
    
    // Animate hamburger lines
    const lines = mobileToggle.querySelectorAll('.line');
    if (lines.length >= 3) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    
    // Focus management
    const firstLink = mainMenu.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  function closeMenu() {
    mainMenu.classList.add('closed');
    mobileToggle.setAttribute('aria-expanded', 'false');
    
    // Reset hamburger lines
    const lines = mobileToggle.querySelectorAll('.line');
    lines.forEach(line => {
      line.style.transform = '';
      line.style.opacity = '';
    });
  }
  
  console.log('✅ Mobile navigation setup complete');
}

// Initialize on window resize to handle dynamic screen changes
window.addEventListener('resize', function() {
  // Debounce resize events
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(function() {
    console.log('🔄 Window resized - reinitializing navigation if needed');
    
    // Close all dropdowns on resize
    closeAllDropdowns();
    
    // Ensure mobile menu is closed on desktop
    if (window.innerWidth >= 1024) {
      const mainMenu = document.querySelector('[data-main-menu]');
      if (mainMenu && !mainMenu.classList.contains('closed')) {
        mainMenu.classList.add('closed');
      }
    }
  }, 250);
});

console.log('🚀 Kansas Electric Navigation System - Ready for premium user experience!'); 