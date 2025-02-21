jQuery(function($) {

	$(document).ready(function() {
		var windowWidth = $(window).width();

		$('#content').click( function() {
			hideSubmenus();
			$('[data-has-submenu]').removeClass('top-level-item');
		});

		if(windowWidth < 1024) {
			hideSubmenus();
			$('[data-main-menu] a').attr('tabindex', '-1');
			// $('[data-main-menu] input').attr('tabindex', '-1');
		}

		window.addEventListener('resize', function(){
			windowWidth = $(window).width();

			if(windowWidth < 1024) {
				hideSubmenus();
				$('[data-main-menu] a').attr('tabindex', '-1');
				// $('[data-main-menu] input').attr('tabindex', '-1');
			} else {
				$('[data-main-menu] a').attr('tabindex', '0');
				// $('[data-main-menu] input').attr('tabindex', '0');
			}
		});

		$('[data-main-menu] > a').attr('tabindex', '-1');
		// open and close main mobile menu
		$('[data-mobile-nav-toggle]').click( function(e) {
			e.preventDefault();

			$(this).toggleClass('is_active');

			var headerHeight = $('.site-header').height();
			var mobileNavPosition = (headerHeight - 1);

			if( $('[data-main-menu]').hasClass('closed')) {
				$('[data-main-menu]').css('top', mobileNavPosition);
				$('[data-main-menu]').attr('aria-expanded', 'true');
				$('[data-main-menu]').addClass('expanded');
				$('[data-main-menu]').removeClass('closed');
				$('[data-main-menu] > ul > li > a').attr('tabindex', '0');
			} else {
				$('[data-main-menu]').css('top', '-100rem');
				$('[data-main-menu]').attr('aria-expanded', 'false');
				$('[data-main-menu]').addClass('closed');
				$('[data-main-menu]').removeClass('expanded');
				$('[data-main-menu] > ul > li > a').attr('tabindex', '-1');
			}

			$('[data-menu-icon]').toggleClass('hidden');
			$('[data-menu-close]').toggleClass('hidden');
			$('.sub-menu').removeClass('menu-open');

			if( $('[data-main-menu]').hasClass('expanded') ) {
				$('[data-main-menu] > a').attr('tabindex', '0');
				$('[data-main-menu] input').attr('tabindex', '0');
			} else {
				$('[data-main-menu] > a').attr('tabindex', '-1');
				$('[data-main-menu] input').attr('tabindex', '-1');
			}
		});

		// set submenu attributes on page load
		function hideSubmenus() {
			$('.submenu').removeClass('menu-open');
			$('.submenu').attr('aria-expanded', 'false');
			$('.submenu').attr('aria-hidden', 'true');
			$('.submenu a').attr('tabindex', '-1');
		}

		// set submenu attributes on page load
		hideSubmenus();

		// open and close sub menus
		$('[data-has-submenu]').click( function(e) {
			e.preventDefault();
			hideSubmenus();
			$('[data-has-submenu]').removeClass('top-level-item');
			if($(this).hasClass('submenu-open')) {
				// hideSubmenus();
				$(this).removeClass('submenu-open');
				$(this).removeClass('top-level-item');
				// close all other open submenus
				hideSubmenus();
			} else {
				hideSubmenus();
				// remove 'submenu-open' class from all other submenus
				$('[data-has-submenu]').removeClass('submenu-open');
				$(this).addClass('top-level-item');
				$(this).addClass('submenu-open');
				// Find the closest submenu and toggle the class
				$(this).closest('li').find('.submenu').toggleClass('menu-open');
				$(this).closest('li').find('.submenu').attr('aria-expanded', 'true');
				$(this).closest('li').find('.submenu').attr('aria-hidden', 'false');
				$(this).closest('li').find('.submenu a').attr('tabindex', '0');
			}
		});
	});

});

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.fade-in');

	if (elements.length > 0) {
		elements.forEach((element, index) => {
			setTimeout(() => {
				element.classList.remove('fade-in');
			}, index * 300);
		});
	}

});