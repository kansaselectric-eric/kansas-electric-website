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

  document.addEventListener('DOMContentLoaded', function () {
    setupImageFadeIn();
    setupScrollReveal();
    resetSectionHeadingTransforms();
  });
})();

