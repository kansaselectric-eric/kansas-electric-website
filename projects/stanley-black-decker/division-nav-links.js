/**
 * Division Navigation Links Enhancement
 * 
 * This script ensures that the division service links are correctly set up across the site.
 * It modifies the navigation menu to link directly to the division pages.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Define division page URLs (both absolute and relative versions)
  const divisionLinks = {
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
  
  // First approach: Modify href attributes directly
  document.querySelectorAll('a[data-target]').forEach(function(link) {
    const target = link.getAttribute('data-target');
    
    // If this is a division target
    if (divisionLinks[target]) {
      // Make sure the href points to the right place
      link.setAttribute('href', basePath + divisionLinks[target]);
      
      // Also add a direct click handler to ensure navigation works
      link.addEventListener('click', function(event) {
        // Still allow the data-target functionality for tabs
        // but also navigate to the division page
        setTimeout(function() {
          window.location.href = basePath + divisionLinks[target];
        }, 50);
      });
    }
  });
  
  // Second approach: Specifically target second-column menu items with division names
  const divisionNames = {
    'Industrial Electrical Division': '/services/divisions/industrial/',
    'Commercial Electrical Division': '/services/divisions/commercial/',
    'Service and Maintenance Division': '/services/divisions/service-maintenance/',
    'Automation and Control Systems Division': '/services/divisions/automation-control/'
  };
  
  document.querySelectorAll('.second-column-menu a').forEach(function(link) {
    const text = link.textContent.trim();
    
    if (divisionNames[text]) {
      // Set href directly
      link.setAttribute('href', basePath + divisionNames[text]);
      
      // Add click handler to force navigation
      link.addEventListener('click', function(event) {
        window.location.href = basePath + divisionNames[text];
        event.preventDefault(); // Prevent default to ensure our navigation takes precedence
      });
    }
  });
  
  // Also ensure the "All Service Divisions" link is correct
  document.querySelectorAll('a').forEach(function(link) {
    if (link.textContent.trim() === 'All Service Divisions') {
      link.setAttribute('href', basePath + '/services/divisions/');
      
      // Add click handler for this link too
      link.addEventListener('click', function(event) {
        window.location.href = basePath + '/services/divisions/';
        event.preventDefault();
      });
    }
  });
  
  // Direct access to division pages in the nav menu
  // This handles the links in the third column that point directly to division pages
  document.querySelectorAll('.third-column-content a').forEach(function(link) {
    const text = link.textContent.trim();
    
    if (divisionNames[text]) {
      // Make sure these links work too
      link.setAttribute('href', basePath + divisionNames[text]);
      
      // Add click handler to ensure navigation
      link.addEventListener('click', function(event) {
        window.location.href = basePath + divisionNames[text];
        event.preventDefault();
      });
    }
  });
}); 