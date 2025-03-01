// Simple navigation
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
}); 