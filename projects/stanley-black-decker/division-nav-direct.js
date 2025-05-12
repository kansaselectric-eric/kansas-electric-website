/**
 * Division Navigation Direct Link Handler
 * 
 * This script ensures clicks on division links in the navigation menu
 * will directly navigate to the corresponding division pages.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Define the division paths for direct navigation
  const divisionPaths = {
    'industrial-electrical': '/services/divisions/industrial/',
    'commercial-electrical': '/services/divisions/commercial/',
    'service-maintenance': '/services/divisions/service-maintenance/',
    'automation-control': '/services/divisions/automation-control/'
  };

  // Helper function to calculate relative path
  function getRelativePath() {
    const pathParts = window.location.pathname.split('/');
    const depth = pathParts.filter(part => part.length > 0).length;
    
    if (depth === 0) {
      return '.';
    } else {
      return Array(depth).fill('..').join('/');
    }
  }
  
  const basePath = getRelativePath();
  
  // Set up direct navigation for all division links
  function setupDirectNavigation() {
    // Find all division links by class or data-target
    const divisionLinks = document.querySelectorAll('.division-nav-link, [data-target="industrial-electrical"], [data-target="commercial-electrical"], [data-target="service-maintenance"], [data-target="automation-control"]');
    
    divisionLinks.forEach(function(link) {
      // Get the target from data attribute
      const target = link.getAttribute('data-target');
      
      // Set an explicit onclick handler that will take precedence
      link.setAttribute('onclick', `window.location.href='${basePath}${divisionPaths[target] || '/services/divisions/'}'`);
      
      // Remove any preventDefault behaviors
      link.addEventListener('click', function(event) {
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // If href exists and points to a division page, navigate directly
        if (href && href.includes('/services/divisions/')) {
          window.location.href = href;
          event.stopPropagation(); // Stop the event from being handled by other listeners
        }
      }, true); // Use capturing phase to handle the event first
    });
  }
  
  // Run our setup function
  setupDirectNavigation();
  
  // If there's any delay in building the navigation, try again after a short delay
  setTimeout(setupDirectNavigation, 300);
  
  // Also add a global click handler for any element in the document
  document.addEventListener('click', function(event) {
    // Check if the clicked element has a data-target attribute for divisions
    const target = event.target.closest('[data-target]');
    if (target) {
      const targetValue = target.getAttribute('data-target');
      if (divisionPaths[targetValue]) {
        // This is a division link, navigate directly
        event.preventDefault();
        event.stopPropagation();
        window.location.href = basePath + divisionPaths[targetValue];
      }
    }
    
    // Also check for links with division texts
    if (event.target.tagName === 'A' || event.target.closest('a')) {
      const link = event.target.tagName === 'A' ? event.target : event.target.closest('a');
      const text = link.textContent.trim();
      
      // Check if this is a division link by its text content
      if (text === 'Industrial Electrical Division' || 
          text === 'Commercial Electrical Division' || 
          text === 'Service and Maintenance Division' || 
          text === 'Automation and Control Systems Division' ||
          text === 'All Service Divisions') {
        
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // If href exists and points to a division page, navigate directly
        if (href && href.includes('/services/divisions/')) {
          event.preventDefault();
          event.stopPropagation();
          window.location.href = href;
        }
      }
    }
  }, true); // Use capturing phase to handle the event first
}); 