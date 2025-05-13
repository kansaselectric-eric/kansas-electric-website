/**
 * Ticker.js - Handles the news ticker animation and functionality
 * For use on all pages of the Kansas Electric website
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Ticker script loaded');

  // Wait a short time to ensure all elements are properly loaded
  setTimeout(function() {
    initializeTicker();
  }, 500);
  
  function initializeTicker() {
    console.log('Initializing ticker...');
    
    // Find the ticker element
    const tickerContent = document.querySelector('.ticker-scroll');
    
    if (!tickerContent) {
      console.log('Ticker content not found');
      return;
    }
    
    console.log('Ticker content found, initializing...');
    
    try {
      // Get original content
      const originalItems = tickerContent.innerHTML;
      
      // Only clone if it hasn't been done already
      if (!tickerContent.dataset.initialized) {
        console.log('Duplicating ticker content for seamless scrolling');
        
        // Remove existing animation if any
        tickerContent.style.animation = 'none';
        
        // Force reflow to ensure animation gets reset
        void tickerContent.offsetWidth;
        
        // Clone items to create continuous scrolling effect
        tickerContent.innerHTML = originalItems + originalItems;
        
        // Mark as initialized to prevent double initialization
        tickerContent.dataset.initialized = 'true';
        
        // Calculate animation duration based on content width
        const contentWidth = tickerContent.scrollWidth / 2;
        const duration = Math.max(contentWidth / 50, 30); // Ensure minimum duration of 30s
        
        // Apply animation - use JavaScript to ensure it's applied
        tickerContent.style.display = 'inline-block';
        tickerContent.style.whiteSpace = 'nowrap';
        tickerContent.style.paddingRight = '100%';
        tickerContent.style.animation = `ticker ${duration}s linear infinite`;
        
        console.log('Ticker initialized with duration: ' + duration + 's');
        console.log('Content width: ' + contentWidth + 'px');
      } else {
        console.log('Ticker already initialized');
      }
    } catch (error) {
      console.error('Error initializing ticker:', error);
    }
  }
  
  // Re-initialize on window resize to adjust animation speed
  window.addEventListener('resize', function() {
    // Debounce the resize event to avoid excessive calls
    clearTimeout(window.tickerResizeTimer);
    window.tickerResizeTimer = setTimeout(function() {
      console.log('Window resized, re-initializing ticker');
      
      // Reset initialization flag to force recalculation
      const tickerContent = document.querySelector('.ticker-scroll');
      if (tickerContent) {
        tickerContent.dataset.initialized = '';
      }
      
      initializeTicker();
    }, 500);
  });
}); 