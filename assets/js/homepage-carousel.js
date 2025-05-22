// Video carousel with simplified functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Homepage carousel script starting...');
  
  // Get the carousel container
  const carousel = document.getElementById('video-carousel');
  if (!carousel) {
    console.error('Video carousel container not found');
    return;
  }
  
  console.log('Found video carousel container:', carousel);
  
  // Always force visibility of the carousel
  carousel.style.opacity = '1';
  carousel.style.visibility = 'visible';
  carousel.style.display = 'block';
  
  // Get all videos
  const videos = carousel.querySelectorAll('video');
  console.log('Found videos in carousel:', videos.length);
  
  if (videos.length === 0) {
    console.error('No video elements found in carousel');
    return;
  }
  
  // Log video details and force attributes
  videos.forEach((video, idx) => {
    // Force essential video attributes
    video.muted = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    
    const source = video.querySelector('source');
    console.log(`Video ${idx+1} source:`, source ? source.src : 'No source');
    console.log(`Video ${idx+1} ready state:`, video.readyState);
    console.log(`Video ${idx+1} network state:`, video.networkState);
    console.log(`Video ${idx+1} is muted:`, video.muted);
    console.log(`Video ${idx+1} is active:`, video.classList.contains('active'));
    
    // Add error listener
    video.addEventListener('error', function(e) {
      console.error(`Error with video ${idx+1}:`, e);
    });
    
    // Add loaded metadata listener
    video.addEventListener('loadedmetadata', function() {
      console.log(`Video ${idx+1} metadata loaded, duration:`, video.duration);
    });
    
    // Add play listener
    video.addEventListener('play', function() {
      console.log(`Video ${idx+1} started playing`);
    });
    
    // Force play all videos once to initiate loading then pause non-active ones
    video.play().catch(e => console.warn(`Initial play attempt for video ${idx+1} failed:`, e));
    
    // Hide all videos initially except the first one
    if (idx !== 0) {
      video.style.opacity = '0';
      video.style.visibility = 'hidden';
      video.style.display = 'none';
      setTimeout(() => video.pause(), 100);
    } else {
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      video.style.display = 'block';
    }
  });
  
  // Initialize
  let currentIndex = 0;
  
  // Function to switch videos with aggressive approach
  function showVideo(index) {
    console.log(`Switching to video ${index+1}`);
    
    // Hide all videos
    videos.forEach(v => {
      v.classList.remove('active');
      v.style.opacity = '0';
      v.style.visibility = 'hidden';
      v.style.display = 'none';
      v.pause();
    });
    
    // Show and play the selected video
    const video = videos[index];
    video.classList.add('active');
    video.style.opacity = '1';
    video.style.visibility = 'visible';
    video.style.display = 'block';
    video.style.zIndex = '10';
    
    // Force a reflow
    void video.offsetHeight;
    
    // Play the video with multiple approaches
    console.log(`Attempting to play video ${index+1}`);
    
    // First try: Standard play
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Error playing video ${index+1}:`, error);
        
        // Try again with explicit muted setting
        video.muted = true;
        
        // Second try: After ensuring muted
        video.play().catch(e => {
          console.error(`Still couldn't play video ${index+1} even muted:`, e);
          
          // Third try: Wait a bit and try again
          setTimeout(() => {
            video.play().catch(finalError => {
              console.error(`Final attempt failed for video ${index+1}:`, finalError);
              
              // Show fallback if available
              const fallback = document.getElementById('fallback-image');
              if (fallback) {
                fallback.style.display = 'block';
              }
            });
          }, 1000);
        });
      });
    }
  }
  
  // Start with the first video - force it to be visible and playing
  console.log('Starting with the first video');
  videos[0].style.opacity = '1';
  videos[0].style.visibility = 'visible';
  videos[0].style.display = 'block';
  videos[0].classList.add('active');
  showVideo(0);
  
  // Add a click handler to help with autoplay restrictions
  document.addEventListener('click', function videoInitializer() {
    console.log('User interaction detected, trying to play videos again');
    videos[currentIndex].play().catch(e => 
      console.warn('Still could not play after user interaction:', e)
    );
    document.removeEventListener('click', videoInitializer);
  });
  
  // Switch videos every 6 seconds
  console.log('Setting up interval to switch videos every 6 seconds');
  setInterval(function() {
    currentIndex = (currentIndex + 1) % videos.length;
    showVideo(currentIndex);
  }, 6000);
  
  // Also ensure the parent section is visible
  const homeSlider = document.querySelector('[data-home-slider]');
  if (homeSlider) {
    console.log('Found home slider, ensuring visibility');
    homeSlider.style.opacity = '1';
    homeSlider.style.visibility = 'visible';
    homeSlider.style.display = 'block';
  } else {
    console.log('Home slider section not found');
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
  
  // Force carousel visibility periodically
  function ensureCarouselVisibility() {
    // Ensure carousel container is visible
    if (carousel) {
      carousel.style.opacity = '1';
      carousel.style.visibility = 'visible';
      carousel.style.display = 'block';
      carousel.style.zIndex = '5';
    }
    
    // Ensure parent section is visible
    if (homeSlider) {
      homeSlider.style.opacity = '1';
      homeSlider.style.visibility = 'visible';
      homeSlider.style.display = 'block';
    }
    
    // Ensure active video is visible
    const activeVideo = carousel.querySelector('video.active');
    if (activeVideo) {
      activeVideo.style.opacity = '1';
      activeVideo.style.visibility = 'visible';
      activeVideo.style.display = 'block';
      activeVideo.style.zIndex = '6';
      
      // Make sure active video is playing
      if (activeVideo.paused) {
        activeVideo.play().catch(e => console.warn('Could not resume active video:', e));
      }
      
      // Make sure other videos are hidden
      videos.forEach(v => {
        if (!v.classList.contains('active')) {
          v.style.opacity = '0';
          v.style.visibility = 'hidden';
          v.style.display = 'none';
          v.pause();
        }
      });
    }
  }
  
  // Run the safeguard periodically
  setInterval(ensureCarouselVisibility, 500);
  
  // Run when interacting with navigation
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
