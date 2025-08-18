// I unify all navigation behaviors (desktop + mobile) in one place.
// I detect which nav DOM exists and initialize the matching controller.
(function () {
  'use strict';

  // ---------- Utilities ----------
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function debounce(func, wait) {
    var timeout;
    return function () {
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () { func.apply(null, args); }, wait);
    };
  }

  function throttle(func, limit) {
    var inThrottle;
    return function () {
      if (!inThrottle) {
        func.apply(null, arguments);
        inThrottle = true;
        setTimeout(function () { inThrottle = false; }, limit);
      }
    };
  }

  // ---------- Redesigned Navigation (from redesigned-navigation.js) ----------
  function RedesignedNavigation() {
    this.activeDropdown = null;
    this.mobileMenuOpen = false;
    this.activeMobileDropdown = null;
    this.scrollThreshold = 50;
    this.lastScrollY = 0;
    this.isScrolled = false;
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  RedesignedNavigation.prototype.init = function () {
    var _this = this;
    onReady(function () { _this.setup(); });
  };

  RedesignedNavigation.prototype.setup = function () {
    this.nav = document.querySelector('.redesigned-nav');
    if (!this.nav) return;
    this.setupDesktopDropdowns();
    this.setupMobileMenu();
    this.setupGlobalListeners();
    this.setupKeyboardNavigation();
    this.setupScrollEffects();
    this.setActiveNavItem();
  };

  RedesignedNavigation.prototype.setupScrollEffects = function () {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.handleScroll();
  };

  RedesignedNavigation.prototype.handleScroll = function () {
    var currentScrollY = window.scrollY;
    if (currentScrollY > this.scrollThreshold && !this.isScrolled) {
      this.nav.classList.add('scrolled');
      this.isScrolled = true;
    } else if (currentScrollY <= this.scrollThreshold && this.isScrolled) {
      this.nav.classList.remove('scrolled');
      this.isScrolled = false;
    }
    this.lastScrollY = currentScrollY;
  };

  RedesignedNavigation.prototype.handleResize = function () {
    if (window.innerWidth >= 1024 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
    this.closeAllDropdowns();
  };

  RedesignedNavigation.prototype.setupDesktopDropdowns = function () {
    var _this = this;
    var dropdownItems = this.nav.querySelectorAll('.redesigned-nav-item[data-dropdown]');
    dropdownItems.forEach(function (item) {
      var link = item.querySelector('.redesigned-nav-link');
      var dropdown = item.querySelector('.redesigned-dropdown');
      if (link && dropdown) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          _this.toggleDropdown(item);
        });
        dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
        link.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            _this.toggleDropdown(item);
          } else if (e.key === 'Escape') {
            _this.closeDropdown(item);
            link.focus();
          } else if (e.key === 'ArrowDown' && item.classList.contains('dropdown-open')) {
            e.preventDefault();
            var firstDropdownLink = dropdown.querySelector('.redesigned-dropdown-link');
            if (firstDropdownLink) firstDropdownLink.focus();
          }
        });
      }
    });
  };

  RedesignedNavigation.prototype.setupMobileMenu = function () {
    var _this = this;
    var mobileToggle = this.nav.querySelector('.redesigned-mobile-toggle');
    var mobileMenu = this.nav.querySelector('.redesigned-mobile-menu');
    var mobileOverlay = this.nav.querySelector('.redesigned-mobile-overlay');
    if (mobileToggle && mobileMenu && mobileOverlay) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        _this.toggleMobileMenu();
      });
      mobileOverlay.addEventListener('click', function () { _this.closeMobileMenu(); });
    }
  };

  RedesignedNavigation.prototype.setupGlobalListeners = function () {
    var _this = this;
    document.addEventListener('click', function (e) {
      if (!_this.nav.contains(e.target)) {
        _this.closeAllDropdowns();
        _this.closeMobileMenu();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        _this.closeAllDropdowns();
        _this.closeMobileMenu();
      }
    });
  };

  RedesignedNavigation.prototype.setupKeyboardNavigation = function () {
    var focusable = this.nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    focusable.forEach(function (el) {
      el.addEventListener('focus', function () {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  };

  RedesignedNavigation.prototype.toggleDropdown = function (item) {
    if (item.classList.contains('dropdown-open')) this.closeDropdown(item); else this.openDropdown(item);
  };
  RedesignedNavigation.prototype.openDropdown = function (item) {
    this.closeAllDropdowns(item);
    var link = item.querySelector('.redesigned-nav-link');
    item.classList.add('dropdown-open');
    if (link) link.setAttribute('aria-expanded', 'true');
    this.activeDropdown = item;
  };
  RedesignedNavigation.prototype.closeDropdown = function (item) {
    var link = item.querySelector('.redesigned-nav-link');
    item.classList.remove('dropdown-open');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (this.activeDropdown === item) this.activeDropdown = null;
  };
  RedesignedNavigation.prototype.closeAllDropdowns = function (exclude) {
    var _this = this;
    var items = this.nav.querySelectorAll('.redesigned-nav-item[data-dropdown]');
    items.forEach(function (i) { if (i !== exclude) _this.closeDropdown(i); });
  };
  RedesignedNavigation.prototype.toggleMobileMenu = function () {
    if (this.mobileMenuOpen) this.closeMobileMenu(); else this.openMobileMenu();
  };
  RedesignedNavigation.prototype.openMobileMenu = function () {
    var mobileToggle = this.nav.querySelector('.redesigned-mobile-toggle');
    var mobileMenu = this.nav.querySelector('.redesigned-mobile-menu');
    var mobileOverlay = this.nav.querySelector('.redesigned-mobile-overlay');
    if (mobileToggle && mobileMenu && mobileOverlay) {
      document.body.style.overflow = 'hidden';
      mobileToggle.classList.add('active');
      mobileMenu.classList.add('active');
      mobileOverlay.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      this.mobileMenuOpen = true;
    }
  };
  RedesignedNavigation.prototype.closeMobileMenu = function () {
    var mobileToggle = this.nav.querySelector('.redesigned-mobile-toggle');
    var mobileMenu = this.nav.querySelector('.redesigned-mobile-menu');
    var mobileOverlay = this.nav.querySelector('.redesigned-mobile-overlay');
    if (mobileToggle && mobileMenu && mobileOverlay) {
      document.body.style.overflow = '';
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      this.mobileMenuOpen = false;
    }
  };
  RedesignedNavigation.prototype.setActiveNavItem = function () {
    var currentPath = window.location.pathname;
    var links = this.nav.querySelectorAll('.redesigned-nav-link, .redesigned-mobile-nav-link');
    links.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href && (currentPath === href || currentPath.indexOf(href + '/') === 0)) {
        link.classList.add('active');
      }
    });
  };

  // ---------- S+ Tier Navigation (from s-tier-navigation.js) ----------
  function STierNavigation() {
    this.activeDropdown = null;
    this.isInitialized = false;
    this.navigationElement = null;
    this.dropdownItems = [];
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  STierNavigation.prototype.init = function () {
    var _this = this;
    onReady(function () { _this.setup(); });
  };
  STierNavigation.prototype.setup = function () {
    this.navigationElement = document.querySelector('.main-navigation');
    if (!this.navigationElement) return;
    var items = Array.prototype.slice.call(this.navigationElement.querySelectorAll('.nav-item'));
    this.dropdownItems = items.filter(function (it) { return !!it.querySelector('.submenu'); });
    var _this = this;
    this.dropdownItems.forEach(function (navItem) {
      var link = navItem.querySelector('a');
      var submenu = navItem.querySelector('.submenu');
      var caret = navItem.querySelector('.dropdown-caret, svg');
      if (!link || !submenu || !caret) return;
      caret.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); _this.toggle(navItem); });
      link.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _this.toggle(navItem); }
      });
      link.addEventListener('click', function (e) { e.preventDefault(); });
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('aria-haspopup', 'true');
      submenu.setAttribute('aria-hidden', 'true');
    });
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeydown);
    this.isInitialized = true;
  };
  STierNavigation.prototype.toggle = function (navItem) {
    if (navItem.classList.contains('dropdown-open')) this.close(navItem); else { this.closeAll(); this.open(navItem); }
  };
  STierNavigation.prototype.open = function (navItem) {
    var link = navItem.querySelector('a');
    var submenu = navItem.querySelector('.submenu');
    if (!link || !submenu) return;
    navItem.classList.add('dropdown-open');
    link.setAttribute('aria-expanded', 'true');
    submenu.setAttribute('aria-hidden', 'false');
    this.activeDropdown = navItem;
  };
  STierNavigation.prototype.close = function (navItem) {
    var link = navItem.querySelector('a');
    var submenu = navItem.querySelector('.submenu');
    if (!link || !submenu) return;
    navItem.classList.remove('dropdown-open');
    link.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('aria-hidden', 'true');
    if (this.activeDropdown === navItem) this.activeDropdown = null;
  };
  STierNavigation.prototype.closeAll = function () { var _this = this; this.dropdownItems.forEach(function (i) { if (i.classList.contains('dropdown-open')) _this.close(i); }); };
  STierNavigation.prototype.handleOutsideClick = function (e) { if (this.activeDropdown && this.navigationElement && !this.navigationElement.contains(e.target)) { this.closeAll(); } };
  STierNavigation.prototype.handleKeydown = function (e) { if (e.key === 'Escape' && this.activeDropdown) { var link = this.activeDropdown.querySelector('a'); this.closeAll(); if (link) link.focus(); } };

  // ---------- Standard Navigation (from assets/js/navigation.js) ----------
  function initStandardNavigation() {
    // Mobile menu toggle
    var mobileToggle = document.querySelector('[data-mobile-nav-toggle]');
    var mainNav = document.querySelector('[data-main-menu]') || document.querySelector('.main-navigation');
    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', function (e) {
        e.preventDefault();
        // I support both older 'closed' flag and newer 'open' flag
        if (mainNav.classList.contains('closed')) {
          mainNav.classList.remove('closed');
          mainNav.classList.add('open');
        } else if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          mainNav.classList.add('closed');
        } else {
          mainNav.classList.toggle('open');
        }
      });
    }

    // Fix third column width regression
    Array.prototype.forEach.call(document.querySelectorAll('.third-column'), function (column) {
      if (column.classList.contains('w-1/2')) column.classList.remove('w-1/2');
    });

    // Fallback class if :has is unsupported
    var hasSupport = true;
    try { document.querySelector(':has(*)'); } catch (e) { hasSupport = false; }
    if (!hasSupport) {
      Array.prototype.forEach.call(document.querySelectorAll('.third-column'), function (column) { column.classList.add('no-has-support'); });
    }

    // Desktop hover behavior with throttling
    var navItems = document.querySelectorAll('.nav-item');
    if (window.innerWidth >= 1024) {
      Array.prototype.forEach.call(navItems, function (item) {
        var submenu = item.querySelector('.submenu');
        if (!submenu) return;
        var timeout;
        var enter = throttle(function () {
          clearTimeout(timeout);
          Array.prototype.forEach.call(document.querySelectorAll('.submenu'), function (menu) {
            if (menu !== submenu) {
              menu.style.opacity = '0';
              menu.style.visibility = 'hidden';
              setTimeout(function () { if (menu.style.visibility === 'hidden') menu.style.display = 'none'; }, 300);
            }
          });
          submenu.style.display = 'flex';
          setSubmenuPosition();
          setTimeout(function () { submenu.style.opacity = '1'; submenu.style.visibility = 'visible'; ensureThirdColumnVisible(submenu); }, 10);
        }, 100);
        item.addEventListener('mouseenter', enter);
        item.addEventListener('mouseleave', function () {
          timeout = setTimeout(function () {
            submenu.style.opacity = '0';
            submenu.style.visibility = 'hidden';
            setTimeout(function () { if (submenu.style.visibility === 'hidden') submenu.style.display = 'none'; }, 300);
          }, 200);
        });
        submenu.addEventListener('mouseenter', function () { clearTimeout(timeout); });
        submenu.addEventListener('mouseleave', function () {
          timeout = setTimeout(function () {
            submenu.style.opacity = '0';
            submenu.style.visibility = 'hidden';
            setTimeout(function () { if (submenu.style.visibility === 'hidden') submenu.style.display = 'none'; }, 300);
          }, 200);
        });
      });
    } else {
      // Mobile: click to toggle submenu
      Array.prototype.forEach.call(navItems, function (item) {
        var link = item.querySelector('a');
        var submenu = item.querySelector('.submenu');
        if (!submenu || !link) return;
        link.addEventListener('click', function (e) {
          if (window.innerWidth < 1024 && submenu) {
            e.preventDefault();
            if (submenu.style.display === 'block') submenu.style.display = 'none';
            else {
              Array.prototype.forEach.call(document.querySelectorAll('.submenu'), function (menu) { if (menu !== submenu) menu.style.display = 'none'; });
              submenu.style.display = 'block';
              ensureThirdColumnVisible(submenu);
            }
          }
        });
      });
    }

    function ensureThirdColumnVisible(submenu) {
      if (!submenu) return;
      var thirdColumnContents = submenu.querySelectorAll('.third-column-content');
      var activeThirdColumnContent = submenu.querySelector('.third-column-content.active');
      if (!activeThirdColumnContent && thirdColumnContents.length > 0) {
        var firstSecondColumnItem = submenu.querySelector('.second-column-item');
        if (firstSecondColumnItem) {
          Array.prototype.forEach.call(submenu.querySelectorAll('.second-column-item'), function (i) { i.classList.remove('active'); });
          firstSecondColumnItem.classList.add('active');
          var targetId = firstSecondColumnItem.getAttribute('data-target');
          if (targetId) {
            var targetContent = document.getElementById(targetId);
            if (targetContent) {
              Array.prototype.forEach.call(thirdColumnContents, function (c) { c.classList.remove('active'); });
              targetContent.classList.add('active');
            } else if (thirdColumnContents.length > 0) {
              Array.prototype.forEach.call(thirdColumnContents, function (c) { c.classList.remove('active'); });
              thirdColumnContents[0].classList.add('active');
            }
          } else if (thirdColumnContents.length > 0) {
            Array.prototype.forEach.call(thirdColumnContents, function (c) { c.classList.remove('active'); });
            thirdColumnContents[0].classList.add('active');
          }
        } else if (thirdColumnContents.length > 0) {
          Array.prototype.forEach.call(thirdColumnContents, function (c) { c.classList.remove('active'); });
          thirdColumnContents[0].classList.add('active');
        }
      }
      var recheck = submenu.querySelector('.third-column-content.active');
      if (!recheck && thirdColumnContents.length > 0) thirdColumnContents[0].classList.add('active');
    }

    function setSubmenuPosition() {
      if (window.innerWidth >= 1024) {
        var header = document.querySelector('.site-header');
        var headerHeight = 80;
        if (header) {
          headerHeight = header.offsetHeight;
          document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
        }
        Array.prototype.forEach.call(document.querySelectorAll('.submenu'), function (submenu) {
          submenu.style.position = 'fixed';
          submenu.style.top = String(headerHeight) + 'px';
          submenu.style.left = '0';
          submenu.style.right = '0';
          submenu.style.width = '100vw';
          submenu.style.marginTop = '0';
          submenu.style.borderTop = 'none';
          submenu.style.zIndex = '9';
          submenu.offsetHeight; // force reflow
        });
      }
    }

    var debouncedResize = debounce(function () {
      setSubmenuPosition();
      Array.prototype.forEach.call(document.querySelectorAll('.submenu'), ensureThirdColumnVisible);
    }, 250);

    setSubmenuPosition();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('load', debounce(function () {
      setSubmenuPosition();
      Array.prototype.forEach.call(document.querySelectorAll('.submenu'), ensureThirdColumnVisible);
    }, 100));
  }

  // ---------- Mobile fallback hamburger (if no [data-mobile-nav-toggle]) ----------
  function setupHamburgerFallback() {
    var hasExplicitToggle = document.querySelector('[data-mobile-nav-toggle]');
    var mainMenu = document.querySelector('[data-main-menu]') || document.querySelector('.main-navigation');
    if (hasExplicitToggle || !mainMenu) return;
    var header = document.querySelector('.site-header');
    if (!header) return;
    var toggle = document.createElement('button');
    toggle.className = 'hamburger-toggle';
    toggle.setAttribute('aria-label', 'Toggle mobile menu');
    toggle.innerHTML = '<span class="line"></span><span class="line"></span><span class="line"></span>';
    header.appendChild(toggle);
    toggle.addEventListener('click', function () {
      if (mainMenu.classList.contains('open')) { mainMenu.classList.remove('open'); mainMenu.classList.add('closed'); }
      else { mainMenu.classList.remove('closed'); mainMenu.classList.add('open'); }
      toggle.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
  }

  // ---------- Bootstrap ----------
  onReady(function () {
    // Prefer redesigned controller when its DOM exists
    if (document.querySelector('.redesigned-nav')) {
      var rn = new RedesignedNavigation();
      rn.init();
      return;
    }
    // Handle Kansas Electric KSE nav if present
    if (document.querySelector('.kse-nav')) {
      // Always run KSE init; don't early return so standard hover assist also applies
      initKseNavigation();
      initKseMobileOverlay();
    }
    // If S-tier hints exist, use S tier controller
    var hasSCarets = document.querySelector('.main-navigation .dropdown-caret');
    var hasSTierFlag = document.querySelector('.main-navigation.s-tier, .main-navigation[data-s-tier-nav]');
    if (hasSCarets || hasSTierFlag) {
      var st = new STierNavigation();
      st.init();
    } else if (!document.querySelector('.kse-nav')) {
      // Default: standard nav
      initStandardNavigation();
    }
  });
})();

// I keep KSE navigation logic here to replace page-specific inline scripts
function initKseNavigation() {
  // Click-driven dropdowns for KSE nav
  var nav = document.querySelector('.kse-nav');
  if (!nav) return;

  function closeAllDropdowns() {
    Array.prototype.forEach.call(nav.querySelectorAll('.kse-dropdown'), function (dropdown) {
      dropdown.classList.remove('active', 'show');
      dropdown.style.display = '';
      dropdown.style.opacity = '';
      dropdown.style.visibility = '';
      dropdown.style.pointerEvents = '';
    });
    Array.prototype.forEach.call(nav.querySelectorAll('.kse-nav-item'), function (item) {
      item.setAttribute('aria-expanded', 'false');
    });
  }

  Array.prototype.forEach.call(nav.querySelectorAll('.kse-nav-item'), function (item) {
    var dropdownId = item.getAttribute('data-dropdown');
    if (!dropdownId) return;
    var dropdown = document.getElementById(dropdownId + '-dropdown');
    var link = item.querySelector('.kse-nav-link');
    if (!dropdown || !link) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('active') || dropdown.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add('active', 'show');
        // Grid for industries grid, else flex
        var isGrid = dropdown.classList.contains('industries-grid');
        dropdown.style.display = isGrid ? 'grid' : 'flex';
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.pointerEvents = 'auto';
        item.setAttribute('aria-expanded', 'true');
      }
    });

    // Desktop hover support (>=1024px)
    var enterHandler = function () {
      if (window.innerWidth < 1024) return;
      closeAllDropdowns();
      var isGrid = dropdown.classList.contains('industries-grid');
      dropdown.classList.add('active', 'show');
      dropdown.style.display = isGrid ? 'grid' : 'flex';
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.pointerEvents = 'auto';
      item.setAttribute('aria-expanded', 'true');
    };
    var leaveHandler = function () {
      if (window.innerWidth < 1024) return;
      dropdown.classList.remove('active', 'show');
      dropdown.style.display = 'none';
      dropdown.style.opacity = '';
      dropdown.style.visibility = '';
      dropdown.style.pointerEvents = '';
      item.setAttribute('aria-expanded', 'false');
    };
    item.addEventListener('mouseenter', enterHandler);
    item.addEventListener('mouseleave', leaveHandler);
    dropdown.addEventListener('mouseenter', function () { /* keep open */ });
    dropdown.addEventListener('mouseleave', leaveHandler);

    dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.kse-nav')) closeAllDropdowns();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAllDropdowns(); });
}

// I wire up the small "MENU" trigger to open a simple slide-in overlay
function initKseMobileOverlay() {
  var trigger = document.getElementById('kse-nav-toggle') || document.getElementById('mobileMenuTrigger');
  var overlay = document.getElementById('mobileNavOverlay');
  var backdrop = document.getElementById('mobileNavBackdrop');
  var closeBtn = document.getElementById('mobileNavClose');
  if (!trigger || !overlay || !backdrop) return;

  function open() {
    overlay.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', function (e) { e.preventDefault(); open(); });
  backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
}


