(function($) {
    $(document).ready(function() {
        let submenuTimeout;
        const mainMenu = document.querySelector('[data-main-menu]');
        const menuItems = document.querySelectorAll('[data-has-submenu]');
        const submenus = document.querySelectorAll('.submenu');
        const videoCarousel = document.querySelector('.video-carousel');

        console.log("✅ Navigation.js Loaded");

        function openMenu(item) {
            clearTimeout(submenuTimeout);
            closeAllSubmenus();
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                submenu.classList.add('menu-open');
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateY(0)';
                submenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }
        }

        function closeMenu(item) {
            submenuTimeout = setTimeout(() => {
                const submenu = item.querySelector('.submenu');
                if (!submenu) return;
                if (!item.matches(':hover') && !submenu.matches(':hover')) {
                    closeAllSubmenus();
                }
            }, 500);
        }

        function closeAllSubmenus() {
            submenus.forEach(sub => {
                if (!sub.matches(':hover')) {
                    sub.classList.remove('menu-open');
                    sub.style.opacity = '0';
                    sub.style.visibility = 'hidden';
                    sub.style.transform = 'translateY(-10px)';
                    sub.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                }
            });
        }

		document.addEventListener("DOMContentLoaded", function () {
			console.log("✅ navigation.js Loaded");
		
			let submenuTimeout;
			const menuItems = document.querySelectorAll("[data-has-submenu]");
			const submenus = document.querySelectorAll(".submenu");
		
			function openMenu(item) {
				clearTimeout(submenuTimeout);
				closeAllSubmenus();
				const submenu = item.querySelector(".submenu");
				if (submenu) {
					submenu.classList.add("menu-open");
					submenu.style.opacity = "1";
					submenu.style.visibility = "visible";
					submenu.style.transform = "translateY(0)";
				}
			}
		
			function closeMenu(item) {
				submenuTimeout = setTimeout(() => {
					const submenu = item.querySelector(".submenu");
					if (!submenu) return;
					if (!item.matches(":hover") && !submenu.matches(":hover")) {
						closeAllSubmenus();
					}
				}, 500);
			}
		
			function closeAllSubmenus() {
				submenus.forEach((sub) => {
					if (!sub.matches(":hover")) {
						sub.classList.remove("menu-open");
						sub.style.opacity = "0";
						sub.style.visibility = "hidden";
						sub.style.transform = "translateY(-10px)";
					}
				});
			}
		
			menuItems.forEach((item) => {
				item.addEventListener("mouseenter", () => openMenu(item));
				item.addEventListener("mouseleave", () => closeMenu(item));
			});
		
			submenus.forEach((submenu) => {
				submenu.addEventListener("mouseenter", () => clearTimeout(submenuTimeout));
				submenu.addEventListener("mouseleave", function () {
					submenuTimeout = setTimeout(() => {
						if (!this.matches(":hover") && !this.closest("[data-has-submenu]:hover")) {
							closeAllSubmenus();
						}
					}, 500);
				});
			});
		
			console.log("✅ Navigation Fix Applied - Test Hover Now");
		});
		

        submenus.forEach(submenu => {
            submenu.addEventListener('mouseenter', () => {
                clearTimeout(submenuTimeout);
            });

            submenu.addEventListener('mouseleave', function() {
                submenuTimeout = setTimeout(() => {
                    if (!this.matches(':hover') && !this.closest('[data-has-submenu]:hover')) {
                        closeAllSubmenus();
                    }
                }, 500);
            });
        });

        // 🔥 FORCE Video Carousel to Stay Visible
        if (videoCarousel) {
            console.log("Checking video carousel visibility...");
            videoCarousel.style.opacity = '1';
            videoCarousel.style.visibility = 'visible';
            videoCarousel.style.display = 'block';
            videoCarousel.style.transition = 'opacity 0.3s ease-in-out';

            setTimeout(() => {
                let styles = window.getComputedStyle(videoCarousel);
                console.log("🚨 Video Carousel Current Styles:", styles);

                if (styles.display === 'none' || styles.opacity === '0' || styles.visibility === 'hidden') {
                    console.log("⚠️ Video carousel is hidden! Forcing it visible.");
                    videoCarousel.style.setProperty("display", "block", "important");
                    videoCarousel.style.setProperty("opacity", "1", "important");
                    videoCarousel.style.setProperty("visibility", "visible", "important");
                }
            }, 1000);
        }

        // ✅ Check for conflicting CSS rules in index.html
        setTimeout(() => {
            let inlineStyles = document.querySelector('style');
            if (inlineStyles) {
                console.log("🚨 Inline CSS in index.html:", inlineStyles.innerText);
            }
        }, 2000);

        console.log("✅ Final Fix Applied - Test Hover and Video Carousel Now");
    });
})(jQuery);
