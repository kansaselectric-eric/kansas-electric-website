/**
 * Mobile Navigation Overhaul JavaScript
 * Enhances mobile navigation with smooth interactions and animations
 * Only affects screens smaller than 768px to preserve desktop functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return;
  
  // Key elements
  const navToggle = document.querySelector('[data-mobile-nav-toggle]');
  const mainMenu = document.querySelector('[data-main-menu]');
  const navItems = document.querySelectorAll('.nav-item');
  const secondColumnItems = document.querySelectorAll('.second-column-item');
  
  // Initialize state
  mainMenu.classList.remove('closed');
  mainMenu.classList.add('mobile-nav');
  
  // Handle menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle active class for animation
      this.classList.toggle('active');
      
      // Toggle menu visibility
      if (mainMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mainMenu.classList.contains('open') && 
        !e.target.closest('[data-main-menu]') && 
        !e.target.closest('[data-mobile-nav-toggle]')) {
      closeMenu();
      if (navToggle) navToggle.classList.remove('active');
    }
  });
  
  // Handle top-level nav items (Services, Projects, etc.)
  navItems.forEach(item => {
    const link = item.querySelector('a.pages');
    const submenu = item.querySelector('.submenu');
    
    if (link && submenu) {
      // Replace existing click handlers with our enhanced one
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // If this item is already open, close it
        if (item.classList.contains('open')) {
          item.classList.remove('open');
          return;
        }
        
        // Close any open items
        navItems.forEach(navItem => {
          navItem.classList.remove('open');
        });
        
        // Open this item
        item.classList.add('open');
      });
    }
  });
  
  // Handle second-level navigation items
  secondColumnItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('data-target');
      if (!targetId) return;
      
      // Remove active class from all second column items
      secondColumnItems.forEach(secondItem => {
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
  
  // Handle back button behavior
  window.addEventListener('popstate', function() {
    if (mainMenu.classList.contains('open')) {
      closeMenu();
      if (navToggle) navToggle.classList.remove('active');
    }
  });
  
  // Helper function to open menu
  function openMenu() {
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Show menu with animation
    mainMenu.classList.add('open');
    
    // Add history state so back button closes menu
    history.pushState({ menuOpen: true }, '');
  }
  
  // Helper function to close menu
  function closeMenu() {
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Hide menu with animation
    mainMenu.classList.remove('open');
    
    // Close any open submenus
    navItems.forEach(navItem => {
      navItem.classList.remove('open');
    });
  }
  
  // Add scroll behavior improvements
  const menuContainer = document.querySelector('[data-main-menu]');
  if (menuContainer) {
    // Track touch start position for better scroll experience
    let startY = 0;
    
    menuContainer.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    menuContainer.addEventListener('touchmove', function(e) {
      const currentY = e.touches[0].clientY;
      const scrollTop = menuContainer.scrollTop;
      const scrollHeight = menuContainer.scrollHeight;
      const clientHeight = menuContainer.clientHeight;
      
      // Prevent default when trying to scroll past content bounds
      if ((scrollTop <= 0 && currentY > startY) || 
          (scrollTop + clientHeight >= scrollHeight && currentY < startY)) {
        e.preventDefault();
      }
    }, { passive: false });
  }
}); 