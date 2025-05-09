// Video carousel with simplified functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get the carousel container
  const carousel = document.getElementById('video-carousel');
  if (!carousel) {
    console.error('Video carousel container not found');
    return;
  }
  
  // Ensure the carousel is visible
  carousel.style.opacity = '1';
  
  // Get all videos
  const videos = carousel.querySelectorAll('video');
  if (videos.length === 0) {
    console.error('No video elements found in carousel');
    return;
  }
  
  // Initialize
  let currentIndex = 0;
  
  // Function to switch videos
  function showVideo(index) {
    // Hide all videos
    videos.forEach(v => {
      v.classList.remove('active');
      v.pause();
    });
    
    // Show and play the selected video
    const video = videos[index];
    video.classList.add('active');
    
    // Play the video
    video.play().catch(error => {
      console.error(`Error playing video ${index+1}:`, error);
      
      // Try playing muted if autoplay was blocked
      if (error.name === 'NotAllowedError') {
        video.muted = true;
        video.play();
      }
    });
  }
  
  // Start with the first video
  showVideo(0);
  
  // Switch videos every 6 seconds
  setInterval(function() {
    currentIndex = (currentIndex + 1) % videos.length;
    showVideo(currentIndex);
  }, 6000);
  
  // Also ensure the parent section is visible
  const homeSlider = document.querySelector('[data-home-slider]');
  if (homeSlider) {
    homeSlider.style.opacity = '1';
  }
  
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
  
  // Safeguard to ensure video carousel remains visible when interacting with navigation
  function ensureCarouselVisibility() {
    // Ensure carousel container is visible
    if (carousel) {
      carousel.style.opacity = '1';
      carousel.style.visibility = 'visible';
    }
    
    // Ensure parent section is visible
    if (homeSlider) {
      homeSlider.style.opacity = '1';
      homeSlider.style.visibility = 'visible';
    }
    
    // Ensure active video is visible
    const activeVideo = carousel.querySelector('video.active');
    if (activeVideo) {
      activeVideo.style.opacity = '1';
      activeVideo.style.visibility = 'visible';
    }
  }
  
  // Run the safeguard periodically
  setInterval(ensureCarouselVisibility, 500);
  
  // Also run when interacting with navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', ensureCarouselVisibility);
    item.addEventListener('mouseleave', ensureCarouselVisibility);
  });
  
  // Run when interacting with any part of the page
  document.addEventListener('click', ensureCarouselVisibility);
  document.addEventListener('mousemove', function() {
    // Throttle to avoid excessive calls
    if (!this.throttled) {
      this.throttled = true;
      ensureCarouselVisibility();
      setTimeout(() => { this.throttled = false; }, 200);
    }
  });
});
