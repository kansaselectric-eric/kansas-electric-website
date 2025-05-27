/**
 * Kansas Electric - Fortune 500 Navigation Controller
 * Advanced navigation system with premium animations and interactions
 */

class RedesignedNavigation {
    constructor() {
        this.activeDropdown = null;
        this.mobileMenuOpen = false;
        this.activeMobileDropdown = null;
        this.scrollThreshold = 50;
        this.lastScrollY = 0;
        this.isScrolled = false;
        
        // Bind methods to preserve context
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.nav = document.querySelector('.redesigned-nav');
        if (!this.nav) return;

        this.setupDesktopDropdowns();
        this.setupMobileMenu();
        this.setupGlobalListeners();
        this.setupKeyboardNavigation();
        this.setupScrollEffects();
        this.setActiveNavItem();
        
        console.log('Fortune 500 Navigation initialized');
    }

    setupScrollEffects() {
        // Add scroll listener for sticky shrink effect
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });
        
        // Initial check
        this.handleScroll();
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > this.scrollThreshold && !this.isScrolled) {
            this.nav.classList.add('scrolled');
            this.isScrolled = true;
        } else if (currentScrollY <= this.scrollThreshold && this.isScrolled) {
            this.nav.classList.remove('scrolled');
            this.isScrolled = false;
        }
        
        this.lastScrollY = currentScrollY;
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 1024 && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Close all dropdowns on resize
        this.closeAllDropdowns();
    }

    setupDesktopDropdowns() {
        const dropdownItems = this.nav.querySelectorAll('.redesigned-nav-item[data-dropdown]');
        
        console.log('Setting up desktop dropdowns, found:', dropdownItems.length, 'items');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.redesigned-nav-link');
            const dropdown = item.querySelector('.redesigned-dropdown');
            
            console.log('Setting up dropdown for:', item.getAttribute('data-dropdown'), 'link:', !!link, 'dropdown:', !!dropdown);
            
            if (link && dropdown) {
                // Enhanced click handler for entire link area
                link.addEventListener('click', (e) => {
                    console.log('Dropdown clicked:', item.getAttribute('data-dropdown'));
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown(item);
                });

                // Prevent dropdown clicks from closing
                dropdown.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                // Enhanced keyboard support
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleDropdown(item);
                    } else if (e.key === 'Escape') {
                        this.closeDropdown(item);
                        link.focus();
                    } else if (e.key === 'ArrowDown' && item.classList.contains('dropdown-open')) {
                        e.preventDefault();
                        const firstDropdownLink = dropdown.querySelector('.redesigned-dropdown-link');
                        if (firstDropdownLink) firstDropdownLink.focus();
                    }
                });

                // Enhanced dropdown link navigation
                const dropdownLinks = dropdown.querySelectorAll('.redesigned-dropdown-link');
                dropdownLinks.forEach((dropdownLink, index) => {
                    dropdownLink.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextLink = dropdownLinks[index + 1];
                            if (nextLink) nextLink.focus();
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            if (index === 0) {
                                link.focus();
                            } else {
                                const prevLink = dropdownLinks[index - 1];
                                if (prevLink) prevLink.focus();
                            }
                        } else if (e.key === 'Escape') {
                            this.closeDropdown(item);
                            link.focus();
                        }
                    });
                });
            }
        });
    }

    setupMobileMenu() {
        const mobileToggle = this.nav.querySelector('.redesigned-mobile-toggle');
        const mobileMenu = this.nav.querySelector('.redesigned-mobile-menu');
        const mobileOverlay = this.nav.querySelector('.redesigned-mobile-overlay');

        if (mobileToggle && mobileMenu && mobileOverlay) {
            // Mobile toggle click
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Mobile overlay click
            mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });

            // Mobile dropdown items
            const mobileDropdownItems = mobileMenu.querySelectorAll('.redesigned-mobile-nav-item[data-dropdown]');
            mobileDropdownItems.forEach(item => {
                const link = item.querySelector('.redesigned-mobile-nav-link');
                const caret = link?.querySelector('.redesigned-nav-caret');
                
                if (link) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.toggleMobileDropdown(item);
                    });
                }
            });

            // Enhanced keyboard support for mobile
            mobileToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        }
    }

    setupGlobalListeners() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target)) {
                this.closeAllDropdowns();
                this.closeMobileMenu();
            }
        });

        // Enhanced escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking nav links
        const mobileNavLinks = this.nav.querySelectorAll('.redesigned-mobile-dropdown-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow navigation
                setTimeout(() => this.closeMobileMenu(), 150);
            });
        });
    }

    setupKeyboardNavigation() {
        // Enhanced tab navigation
        const focusableElements = this.nav.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                // Ensure focused elements are visible
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            });
        });
    }

    toggleDropdown(navItem) {
        const isOpen = navItem.classList.contains('dropdown-open');
        
        console.log('Toggle dropdown:', navItem.getAttribute('data-dropdown'), 'currently open:', isOpen);
        
        if (isOpen) {
            this.closeDropdown(navItem);
        } else {
            this.openDropdown(navItem);
        }
    }

    openDropdown(navItem) {
        // Close any other open dropdowns first
        this.closeAllDropdowns(navItem);
        
        const link = navItem.querySelector('.redesigned-nav-link');
        const dropdown = navItem.querySelector('.redesigned-dropdown');
        
        console.log('Opening dropdown:', navItem.getAttribute('data-dropdown'));
        
        if (link && dropdown) {
            // Add open state with enhanced animations
            navItem.classList.add('dropdown-open');
            link.setAttribute('aria-expanded', 'true');
            link.classList.add('active');
            
            console.log('Dropdown opened, classes added:', navItem.classList.toString());
            
            // Set active dropdown
            this.activeDropdown = navItem;
            
            // Focus management
            const firstDropdownLink = dropdown.querySelector('.redesigned-dropdown-link');
            if (firstDropdownLink && document.activeElement === link) {
                // Only auto-focus if triggered by keyboard
                setTimeout(() => firstDropdownLink.focus(), 100);
            }
        }
    }

    closeDropdown(navItem) {
        const link = navItem.querySelector('.redesigned-nav-link');
        
        if (link) {
            navItem.classList.remove('dropdown-open');
            link.setAttribute('aria-expanded', 'false');
            link.classList.remove('active');
            
            if (this.activeDropdown === navItem) {
                this.activeDropdown = null;
            }
        }
    }

    closeAllDropdowns(excludeItem = null) {
        const dropdownItems = this.nav.querySelectorAll('.redesigned-nav-item[data-dropdown]');
        
        dropdownItems.forEach(item => {
            if (item !== excludeItem) {
                this.closeDropdown(item);
            }
        });
    }

    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileToggle = this.nav.querySelector('.redesigned-mobile-toggle');
        const mobileMenu = this.nav.querySelector('.redesigned-mobile-menu');
        const mobileOverlay = this.nav.querySelector('.redesigned-mobile-overlay');

        if (mobileToggle && mobileMenu && mobileOverlay) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Add active states
            mobileToggle.classList.add('active');
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            
            // Set ARIA attributes
            mobileToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            
            this.mobileMenuOpen = true;
            
            // Focus first menu item
            setTimeout(() => {
                const firstMenuItem = mobileMenu.querySelector('.redesigned-mobile-nav-link');
                if (firstMenuItem) firstMenuItem.focus();
            }, 300);
        }
    }

    closeMobileMenu() {
        const mobileToggle = this.nav.querySelector('.redesigned-mobile-toggle');
        const mobileMenu = this.nav.querySelector('.redesigned-mobile-menu');
        const mobileOverlay = this.nav.querySelector('.redesigned-mobile-overlay');

        if (mobileToggle && mobileMenu && mobileOverlay) {
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Remove active states
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            
            // Set ARIA attributes
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            
            this.mobileMenuOpen = false;
            
            // Close all mobile dropdowns
            this.closeAllMobileDropdowns();
            
            // Return focus to toggle
            mobileToggle.focus();
        }
    }

    toggleMobileDropdown(navItem) {
        const isOpen = navItem.classList.contains('dropdown-open');
        
        if (isOpen) {
            this.closeMobileDropdown(navItem);
        } else {
            this.openMobileDropdown(navItem);
        }
    }

    openMobileDropdown(navItem) {
        // Close other mobile dropdowns
        this.closeAllMobileDropdowns(navItem);
        
        const link = navItem.querySelector('.redesigned-mobile-nav-link');
        
        navItem.classList.add('dropdown-open');
        if (link) link.setAttribute('aria-expanded', 'true');
        
        this.activeMobileDropdown = navItem;
    }

    closeMobileDropdown(navItem) {
        const link = navItem.querySelector('.redesigned-mobile-nav-link');
        
        navItem.classList.remove('dropdown-open');
        if (link) link.setAttribute('aria-expanded', 'false');
        
        if (this.activeMobileDropdown === navItem) {
            this.activeMobileDropdown = null;
        }
    }

    closeAllMobileDropdowns(excludeItem = null) {
        const mobileDropdownItems = this.nav.querySelectorAll('.redesigned-mobile-nav-item[data-dropdown]');
        
        mobileDropdownItems.forEach(item => {
            if (item !== excludeItem) {
                this.closeMobileDropdown(item);
            }
        });
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navLinks = this.nav.querySelectorAll('.redesigned-nav-link, .redesigned-mobile-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
                link.classList.add('active');
            }
        });
    }

    // Public methods for external control
    closeAll() {
        this.closeAllDropdowns();
        this.closeMobileMenu();
    }

    destroy() {
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Reset states
        this.closeAll();
        document.body.style.overflow = '';
        
        console.log('Fortune 500 Navigation destroyed');
    }
}

// Auto-initialize when script loads
const navigation = new RedesignedNavigation();
navigation.init();

// Fallback initialization after a short delay
setTimeout(() => {
    if (!window.RedesignedNavigation || !window.RedesignedNavigation.nav) {
        console.log('Fallback initialization triggered');
        const fallbackNav = new RedesignedNavigation();
        fallbackNav.init();
        window.RedesignedNavigation = fallbackNav;
    }
}, 100);

// Export for external access
window.RedesignedNavigation = navigation; 