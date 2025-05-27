/* ===================================================================
   KANSAS ELECTRIC HOVER FIX - NUCLEAR HOVER ELIMINATION
   ===================================================================
   
   This script completely eliminates all hover behaviors and ensures
   click-only navigation functionality.
   
   ================================================================= */

(function() {
    'use strict';
    
    console.log('🚫 Kansas Electric Hover Fix - Eliminating all hover behaviors...');
    
    // ===================================================================
    // IMMEDIATE HOVER PREVENTION
    // ===================================================================
    
    // Prevent hover events during capture phase
    function preventHoverEvent(e) {
        if (e.target.closest('.main-navigation')) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    }
    
    // Add event listeners immediately
    document.addEventListener('mouseenter', preventHoverEvent, true);
    document.addEventListener('mouseover', preventHoverEvent, true);
    document.addEventListener('mouseout', preventHoverEvent, true);
    document.addEventListener('mouseleave', preventHoverEvent, true);
    
    // ===================================================================
    // CSS INJECTION FOR MAXIMUM OVERRIDE
    // ===================================================================
    
    function injectHoverKillerCSS() {
        const css = `
            /* NUCLEAR HOVER REMOVAL - MAXIMUM SPECIFICITY */
            html body .main-navigation li:hover > .submenu,
            html body .main-navigation .submenu:hover,
            html body .main-navigation .submenu .service-link:hover + .sub-submenu,
            html body .main-menu .submenu .service-link:hover + .sub-submenu,
            html body .nav-item:hover .submenu,
            html body .nav-item:hover .submenu.show,
            html body .nav-item:hover .submenu.active,
            .nav-item:hover .submenu,
            .nav-item:hover .submenu.show,
            .nav-item:hover .submenu.active,
            .main-navigation li:hover > .submenu,
            .main-navigation .submenu:hover,
            .main-navigation .submenu .service-link:hover + .sub-submenu,
            .main-menu .submenu .service-link:hover + .sub-submenu {
                opacity: 0 !important;
                transform: translateY(-10px) !important;
                pointer-events: none !important;
                visibility: hidden !important;
                display: none !important;
            }
            
            /* Force all submenus to be hidden by default */
            .main-navigation .submenu:not(.menu-open) {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                display: none !important;
            }
            
            /* Only show when explicitly opened */
            .main-navigation .submenu.menu-open {
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
                display: block !important;
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
                right: 0 !important;
                width: 100vw !important;
                margin-left: calc(-50vw + 50%) !important;
                background-color: #f8f9fa !important;
                border-top: 1px solid #e9ecef !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                z-index: 1000 !important;
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'hover-killer-css';
        style.textContent = css;
        document.head.appendChild(style);
        console.log('✅ Hover killer CSS injected');
    }
    
    // ===================================================================
    // CLICK-ONLY NAVIGATION HANDLER
    // ===================================================================
    
    let currentOpenDropdown = null;
    
    function closeAllDropdowns() {
        const openDropdowns = document.querySelectorAll('.main-navigation .submenu.menu-open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('menu-open');
            const parentLink = dropdown.parentElement.querySelector('a');
            if (parentLink) {
                parentLink.classList.remove('submenu-open');
                parentLink.setAttribute('aria-expanded', 'false');
            }
        });
        currentOpenDropdown = null;
        console.log('🔒 All dropdowns closed');
    }
    
    function openDropdown(navItem, submenu, link) {
        if (currentOpenDropdown && currentOpenDropdown !== submenu) {
            closeAllDropdowns();
        }
        
        submenu.classList.add('menu-open');
        link.classList.add('submenu-open');
        link.setAttribute('aria-expanded', 'true');
        
        currentOpenDropdown = submenu;
        console.log('🔓 Dropdown opened:', link.textContent.trim());
    }
    
    function handleNavigationClick(e) {
        const navLink = e.target.closest('.main-navigation a');
        
        if (navLink) {
            const navItem = navLink.closest('li');
            const submenu = navItem ? navItem.querySelector('.submenu') : null;
            
            if (submenu) {
                e.preventDefault();
                e.stopPropagation();
                
                const isCurrentlyOpen = submenu.classList.contains('menu-open');
                
                if (isCurrentlyOpen) {
                    closeAllDropdowns();
                } else {
                    openDropdown(navItem, submenu, navLink);
                }
            }
        }
        
        // Close dropdowns when clicking outside
        if (!e.target.closest('.main-navigation')) {
            closeAllDropdowns();
        }
    }
    
    // ===================================================================
    // CONTINUOUS MONITORING
    // ===================================================================
    
    function monitorAndKillHovers() {
        // Force hide any visible submenus that aren't explicitly opened
        const visibleSubmenus = document.querySelectorAll('.main-navigation .submenu:not(.menu-open)');
        visibleSubmenus.forEach(submenu => {
            const computedStyle = window.getComputedStyle(submenu);
            if (computedStyle.opacity !== '0' || computedStyle.visibility !== 'hidden') {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.pointerEvents = 'none';
                submenu.style.display = 'none';
            }
        });
    }
    
    // ===================================================================
    // INITIALIZATION
    // ===================================================================
    
    function initialize() {
        console.log('🔧 Initializing hover fix...');
        
        // Inject CSS immediately
        injectHoverKillerCSS();
        
        // Add click handlers
        document.addEventListener('click', handleNavigationClick);
        
        // Close dropdowns on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllDropdowns();
            }
        });
        
        // Start continuous monitoring
        setInterval(monitorAndKillHovers, 50);
        
        // Force close any initially open dropdowns
        setTimeout(closeAllDropdowns, 100);
        
        console.log('✅ Hover fix initialized - Navigation is now click-only');
    }
    
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})(); 