// I use this lightweight reveal script to replace AOS animations sitewide
// without adding another dependency. I keep it small, safe, and defer-loaded.
(function () {
  'use strict';

  // I fade images in once they load to reduce jank
  function setupImageFadeIn() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('loaded');
        }, { once: true });
      }
    });
  }

  // I reveal elements with [data-aos] as they enter the viewport
  function setupScrollReveal() {
    var elements = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'));
    if (!elements.length) return;

    // Ensure initial hidden state
    elements.forEach(function (el) { el.classList.add('aos-hide'); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-show');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      elements.forEach(function (el) { io.observe(el); });
    } else {
      // Fallback: just show them if IO isn't supported
      elements.forEach(function (el) { el.classList.add('aos-show'); });
    }
  }

  // I make sure section headings don't carry stray transforms
  function resetSectionHeadingTransforms() {
    document.querySelectorAll('.section-heading').forEach(function (el) {
      el.style.transform = 'none';
    });
  }

  // Add ARIA behaviors to nav dropdowns for keyboard and SR users
  function setupNavA11y() {
    var navItems = Array.prototype.slice.call(document.querySelectorAll('.kse-nav-item[data-dropdown]'));
    if (!navItems.length) return;

    navItems.forEach(function (item) {
      var link = item.querySelector('.kse-nav-link');
      var dropdownId = link && link.getAttribute('aria-controls');
      var dropdown = dropdownId ? document.getElementById(dropdownId) : null;
      if (!link || !dropdown) return;

      // Ensure base ARIA state
      link.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');

      function open() {
        link.setAttribute('aria-expanded', 'true');
        dropdown.setAttribute('aria-hidden', 'false');
      }
      function close() {
        link.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');
      }

      // Mouse interactions shouldn't change visuals beyond existing CSS
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);

      // Keyboard interactions
      link.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (link.getAttribute('aria-expanded') === 'true') {
            close();
          } else {
            open();
            // Move focus to first item in dropdown if present
            var first = dropdown.querySelector('a, button, [tabindex="0"]');
            if (first) first.focus();
          }
        }
        if (e.key === 'Escape') {
          close();
          link.focus();
        }
      });
      dropdown.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          close();
          link.focus();
        }
      });
    });
  }

  // Trap focus inside an active mobile nav overlay
  function setupMobileFocusTrap() {
    var overlay = document.getElementById('mobileNavOverlay');
    var trigger = document.getElementById('mobileMenuTrigger');
    var backdrop = document.getElementById('mobileNavBackdrop');
    if (!overlay) return;

    function getFocusable() {
      return Array.prototype.slice.call(overlay.querySelectorAll('a[href], button, select, textarea, input, [tabindex]:not([tabindex="-1"])'))
        .filter(function (el) { return !el.hasAttribute('disabled') && el.offsetParent !== null; });
    }

    function handleKeydown(e) {
      if (e.key !== 'Tab') return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    function onOpen() {
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
      overlay.addEventListener('keydown', handleKeydown);
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }
    function onClose() {
      overlay.removeEventListener('keydown', handleKeydown);
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    }

    // Observe class changes to detect open/close without altering visuals
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'class') {
          var isOpen = overlay.classList.contains('active');
          if (isOpen) onOpen(); else onClose();
        }
      });
    });
    observer.observe(overlay, { attributes: true });

    // Also close on backdrop click with ESC handled elsewhere in pages
    if (backdrop) {
      backdrop.addEventListener('click', onClose);
    }

    // Keyboard support on trigger
    if (trigger) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-controls', 'mobileNavOverlay');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open mobile menu');
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupImageFadeIn();
    setupScrollReveal();
    resetSectionHeadingTransforms();
    setupNavA11y();
    setupMobileFocusTrap();
  });
})();

