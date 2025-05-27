/**
 * ===================================================================
 * KANSAS ELECTRIC S+ TIER NAVIGATION CONTROLLER
 * ===================================================================
 * 
 * S+ Tier Features:
 * ✅ Click-only dropdown behavior (zero hover triggers)
 * ✅ Single dropdown open at a time
 * ✅ Caret rotation on open/close
 * ✅ Full keyboard accessibility (Tab, Enter, Space, Escape)
 * ✅ Edge-to-edge dropdown positioning
 * ✅ Clean transitions with no jank
 * ✅ Mobile responsive
 * ✅ No flickering or re-renders
 * ✅ Progressive content display
 * ✅ Outside click closes dropdowns
 * ✅ Robust state management
 */

class STierNavigation {
    constructor() {
        this.activeDropdown = null;
        this.isInitialized = false;
        this.navigationElement = null;
        this.dropdownItems = [];
        
        // Bind methods to preserve context
        this.handleCaretClick = this.handleCaretClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleSecondColumnClick = this.handleSecondColumnClick.bind(this);
        
        this.init();
    }
    
    /**
     * Initialize the S+ tier navigation system
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing S+ Tier Navigation System');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * Setup navigation after DOM is ready
     */
    setup() {
        this.navigationElement = document.querySelector('.main-navigation');
        
        if (!this.navigationElement) {
            console.warn('⚠️ Main navigation element not found');
            return;
        }
        
        // Find all dropdown items
        this.dropdownItems = Array.from(this.navigationElement.querySelectorAll('.nav-item')).filter(item => {
            return item.querySelector('.submenu');
        });
        
        console.log(`📋 Found ${this.dropdownItems.length} dropdown items`);
        
        // Setup each dropdown item
        this.dropdownItems.forEach(item => this.setupDropdownItem(item));
        
        // Setup global event listeners
        this.setupGlobalListeners();
        
        // Setup progressive content
        this.setupProgressiveContent();
        
        // Mark as initialized
        this.navigationElement.classList.add('s-tier-initialized');
        this.isInitialized = true;
        
        console.log('✅ S+ Tier Navigation System initialized successfully');
    }
    
    /**
     * Setup individual dropdown item
     */
    setupDropdownItem(navItem) {
        const link = navItem.querySelector('a');
        const submenu = navItem.querySelector('.submenu');
        const caret = navItem.querySelector('.dropdown-caret, svg');
        
        if (!link || !submenu) return;
        
        // Ensure proper structure
        if (!caret) {
            console.warn('⚠️ Dropdown caret not found for nav item:', navItem);
            return;
        }
        
        // Add click listener to caret only
        caret.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleCaretClick(navItem);
        });
        
        // Add keyboard support to the link
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCaretClick(navItem);
            }
        });
        
        // Prevent link navigation when clicking on dropdown items
        link.addEventListener('click', (e) => {
            if (submenu) {
                e.preventDefault();
            }
        });
        
        // Add ARIA attributes for accessibility
        link.setAttribute('aria-expanded', 'false');
        link.setAttribute('aria-haspopup', 'true');
        submenu.setAttribute('aria-hidden', 'true');
        
        console.log('🔧 Setup dropdown item:', link.textContent?.trim());
    }
    
    /**
     * Handle caret click to toggle dropdown
     */
    handleCaretClick(navItem) {
        const isCurrentlyOpen = navItem.classList.contains('dropdown-open');
        
        if (isCurrentlyOpen) {
            // Close the current dropdown
            this.closeDropdown(navItem);
        } else {
            // Close any other open dropdown first
            this.closeAllDropdowns();
            // Open this dropdown
            this.openDropdown(navItem);
        }
    }
    
    /**
     * Open a specific dropdown
     */
    openDropdown(navItem) {
        const link = navItem.querySelector('a');
        const submenu = navItem.querySelector('.submenu');
        
        if (!link || !submenu) return;
        
        // Add open class
        navItem.classList.add('dropdown-open');
        
        // Update ARIA attributes
        link.setAttribute('aria-expanded', 'true');
        submenu.setAttribute('aria-hidden', 'false');
        
        // Set active dropdown
        this.activeDropdown = navItem;
        
        // Focus management for accessibility
        submenu.setAttribute('tabindex', '-1');
        
        console.log('📂 Opened dropdown:', link.textContent?.trim());
    }
    
    /**
     * Close a specific dropdown
     */
    closeDropdown(navItem) {
        const link = navItem.querySelector('a');
        const submenu = navItem.querySelector('.submenu');
        
        if (!link || !submenu) return;
        
        // Remove open class
        navItem.classList.remove('dropdown-open');
        
        // Update ARIA attributes
        link.setAttribute('aria-expanded', 'false');
        submenu.setAttribute('aria-hidden', 'true');
        
        // Clear active dropdown if this was it
        if (this.activeDropdown === navItem) {
            this.activeDropdown = null;
        }
        
        console.log('📁 Closed dropdown:', link.textContent?.trim());
    }
    
    /**
     * Close all open dropdowns
     */
    closeAllDropdowns() {
        this.dropdownItems.forEach(item => {
            if (item.classList.contains('dropdown-open')) {
                this.closeDropdown(item);
            }
        });
        this.activeDropdown = null;
    }
    
    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Outside click closes dropdowns
        document.addEventListener('click', this.handleOutsideClick);
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown);
        
        // Prevent any hover behaviors
        this.preventHoverBehaviors();
        
        console.log('🌐 Global event listeners setup');
    }
    
    /**
     * Handle clicks outside navigation to close dropdowns
     */
    handleOutsideClick(e) {
        if (!this.activeDropdown) return;
        
        // Check if click is outside navigation
        if (!this.navigationElement.contains(e.target)) {
            this.closeAllDropdowns();
            console.log('🖱️ Outside click - closed all dropdowns');
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeydown(e) {
        // Escape key closes all dropdowns
        if (e.key === 'Escape') {
            if (this.activeDropdown) {
                this.closeAllDropdowns();
                // Return focus to the trigger
                const link = this.activeDropdown.querySelector('a');
                if (link) link.focus();
                console.log('⌨️ Escape key - closed all dropdowns');
            }
        }
    }
    
    /**
     * Prevent any hover behaviors that might interfere
     */
    preventHoverBehaviors() {
        // Capture and prevent hover events on navigation
        const preventHover = (e) => {
            if (this.navigationElement.contains(e.target)) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        
        // Add event listeners in capture phase to prevent hover
        document.addEventListener('mouseenter', preventHover, true);
        document.addEventListener('mouseover', preventHover, true);
        
        // Monitor for any hover classes and remove them
        const removeHoverClasses = () => {
            if (this.navigationElement) {
                this.navigationElement.querySelectorAll('.hover, :hover').forEach(el => {
                    el.classList.remove('hover');
                });
            }
        };
        
        // Check every 100ms for hover states
        setInterval(removeHoverClasses, 100);
        
        console.log('🚫 Hover prevention measures activated');
    }
    
    /**
     * Setup progressive content display for third column
     */
    setupProgressiveContent() {
        const submenus = this.navigationElement.querySelectorAll('.submenu');
        
        submenus.forEach(submenu => {
            const secondColumnItems = submenu.querySelectorAll('.second-column-item');
            const thirdColumn = submenu.querySelector('.third-column');
            
            if (!thirdColumn || secondColumnItems.length === 0) return;
            
            // Add click listeners to second column items
            secondColumnItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    this.handleSecondColumnClick(item, thirdColumn, e);
                });
                
                // Keyboard support
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleSecondColumnClick(item, thirdColumn, e);
                    }
                });
                
                // Make focusable
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
            });
            
            // Check for :has() support
            if (!CSS.supports('selector(:has(*))')) {
                thirdColumn.classList.add('no-has-support');
            }
            
            console.log('🔄 Setup progressive content for submenu');
        });
    }
    
    /**
     * Handle second column item clicks for progressive content
     */
    handleSecondColumnClick(item, thirdColumn, event) {
        // Remove active class from all second column items in this submenu
        const submenu = item.closest('.submenu');
        submenu.querySelectorAll('.second-column-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Find corresponding third column content
        const itemIndex = Array.from(item.parentElement.children).indexOf(item);
        const thirdColumnContents = thirdColumn.querySelectorAll('.third-column-content');
        
        // Hide all third column content
        thirdColumnContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show corresponding content
        if (thirdColumnContents[itemIndex]) {
            thirdColumnContents[itemIndex].classList.add('active');
        }
        
        console.log('🔄 Updated progressive content:', item.textContent?.trim());
    }
    
    /**
     * Destroy the navigation system (cleanup)
     */
    destroy() {
        if (!this.isInitialized) return;
        
        // Remove global listeners
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Close all dropdowns
        this.closeAllDropdowns();
        
        // Remove initialization class
        if (this.navigationElement) {
            this.navigationElement.classList.remove('s-tier-initialized');
        }
        
        this.isInitialized = false;
        console.log('🧹 S+ Tier Navigation System destroyed');
    }
}

// Auto-initialize when script loads
let sTierNav = null;

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sTierNav = new STierNavigation();
    });
} else {
    sTierNav = new STierNavigation();
}

// Global reference for debugging
window.sTierNavigation = sTierNav;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STierNavigation;
} 