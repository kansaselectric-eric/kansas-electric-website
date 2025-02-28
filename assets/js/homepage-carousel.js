window.addEventListener("load", function () {
  const homeCarousel = document.querySelector(".video-carousel");

if (homeCarousel) {
  homeCarousel.style.display = "block";
  homeCarousel.style.opacity = "1";
  homeCarousel.style.visibility = "visible";
}

  if (homeCarousel) {
    const slides = homeCarousel.querySelectorAll("video");
    let currentIndex = 0;
    const totalSlides = slides.length;

    if (totalSlides > 0) {
      slides.forEach((slide) => {
        slide.style.opacity = "0";
        slide.style.display = "none";
      });
      slides[0].style.opacity = "1";
      slides[0].style.display = "block";
    }    

    setInterval(() => {
      slides[currentIndex].style.opacity = "0";
      slides[currentIndex].style.display = "none";
      currentIndex = (currentIndex + 1) % totalSlides;
      slides[currentIndex].style.opacity = "1";
      slides[currentIndex].style.display = "block";
    }, 6000);
  }
});

// Handle submenu hover behavior for services
document.querySelectorAll(".service-link").forEach((link) => {
  link.addEventListener("mouseenter", function () {
    const subSubmenu = this.nextElementSibling;
    if (subSubmenu) {
      subSubmenu.style.display = "flex";
    }
  });

  link.addEventListener("mouseleave", function () {
    const subSubmenu = this.nextElementSibling;
    if (subSubmenu) {
      subSubmenu.style.display = "none";
    }
  });
});
