// Video force-play script with IntersectionObserver optimization
// This script attempts multiple techniques to get videos playing efficiently

(function() {
  let isCarouselVisible = false;
  let carouselObserver = null;
  let userHasInteracted = false;
  
  // Wait for DOM to be ready
  function init() {
    console.log('[Video Force Play] Initializing...');
    
    // Find all video elements in the carousel
    const carousel = document.getElementById('video-carousel');
    if (!carousel) {
      console.error('[Video Force Play] Video carousel not found');
      return;
    }
    
    const videos = carousel.querySelectorAll('video');
    if (videos.length === 0) {
      console.error('[Video Force Play] No videos found in carousel');
      return;
    }
    
    console.log(`[Video Force Play] Found ${videos.length} videos`);
    
    // Apply force-play to the active video or the first video
    const activeVideo = carousel.querySelector('video.active') || videos[0];
    forcePlayVideo(activeVideo, true);
    
    // Set up all videos with proper attributes
    videos.forEach((video, index) => {
      // Set crucial video attributes
      prepareVideoAttributes(video);
      
      // Apply display settings
      if (video !== activeVideo) {
        hideVideo(video);
      } else {
        showVideo(video);
      }
      
      // Handle video events
      setupVideoEventListeners(video, index);
    });
    
    // Try playing on user interaction
    setupUserInteractionPlayback();
    
    // Monitor visibility with IntersectionObserver
    setupIntersectionObserver(carousel);
    
    // Page visibility API for tab focus/blur
    setupPageVisibilityHandler();
  }
  
  // Apply all necessary attributes to a video
  function prepareVideoAttributes(video) {
    video.muted = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x-webkit-airplay', 'allow');
    video.preload = 'auto';
    video.defaultMuted = true;
    video.volume = 0;
    
    // Apply video style forcibly
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
  }
  
  // Force video to show
  function showVideo(video) {
    video.classList.add('active');
    video.style.opacity = '1';
    video.style.visibility = 'visible';
    video.style.display = 'block';
    video.style.zIndex = '6';
  }
  
  // Force video to hide
  function hideVideo(video) {
    video.classList.remove('active');
    video.style.opacity = '0';
    video.style.visibility = 'hidden';
    video.style.display = 'none';
    video.pause();
  }
  
  // Set up event listeners for a video
  function setupVideoEventListeners(video, index) {
    video.addEventListener('loadedmetadata', () => {
      console.log(`[Video Force Play] Video ${index+1} metadata loaded, duration: ${video.duration}s`);
    });
    
    video.addEventListener('canplay', () => {
      console.log(`[Video Force Play] Video ${index+1} can play`);
    });
    
    video.addEventListener('play', () => {
      console.log(`[Video Force Play] Video ${index+1} started playing`);
    });
    
    video.addEventListener('pause', () => {
      console.log(`[Video Force Play] Video ${index+1} paused`);
      
      // If this is the active video and carousel is visible, try to resume it
      if (video.classList.contains('active') && isCarouselVisible && userHasInteracted) {
        setTimeout(() => {
          console.log(`[Video Force Play] Attempting to resume paused active video ${index+1}`);
          video.play().catch(e => console.warn(`[Video Force Play] Could not resume video ${index+1}:`, e));
        }, 1000);
      }
    });
    
    video.addEventListener('error', (e) => {
      console.error(`[Video Force Play] Error with video ${index+1}:`, e);
      
      // Show fallback image
      const fallback = document.getElementById('fallback-image');
      if (fallback) {
        fallback.style.display = 'block';
      }
    });
  }
  
  // Try multiple approaches to force video playback
  function forcePlayVideo(video, isInitial = false) {
    if (!video) return;
    
    console.log(`[Video Force Play] ${isInitial ? 'Initial force' : 'Force'} play attempt`);
    
    // Ensure muted state
    video.muted = true;
    video.volume = 0;
    
    // Ensure visible
    showVideo(video);
    
    // Only try to play if user has interacted or if it's initial load
    if (!userHasInteracted && !isInitial) {
      console.log('[Video Force Play] Waiting for user interaction before playing');
      return;
    }
    
    // First attempt: normal play
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('[Video Force Play] First play attempt failed:', error);
        
        // Second attempt: after brief delay
        setTimeout(() => {
          console.log('[Video Force Play] Second play attempt after delay');
          video.play().catch(e => {
            console.warn('[Video Force Play] Second play attempt failed:', e);
            
            // Third attempt: reload and try again
            video.load();
            setTimeout(() => {
              console.log('[Video Force Play] Third play attempt after reload');
              video.play().catch(finalError => {
                console.error('[Video Force Play] Final play attempt failed:', finalError);
                
                // Show fallback
                const fallback = document.getElementById('fallback-image');
                if (fallback && isInitial) {
                  fallback.style.display = 'block';
                }
              });
            }, 1000);
          });
        }, 500);
      });
    }
  }
  
  // Try to play videos on user interaction
  function setupUserInteractionPlayback() {
    // Use click, touchstart and other events to help with autoplay
    ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, handleUserInteraction, { once: true });
    });
    
    function handleUserInteraction() {
      console.log('[Video Force Play] User interaction detected');
      userHasInteracted = true;
      
      // If carousel is visible, try to play the active video
      if (isCarouselVisible) {
        const carousel = document.getElementById('video-carousel');
        if (!carousel) return;
        
        const activeVideo = carousel.querySelector('video.active') || carousel.querySelector('video');
        if (activeVideo) {
          forcePlayVideo(activeVideo);
        }
      }
      
      // Remove all event listeners
      ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'].forEach(eventType => {
        document.removeEventListener(eventType, handleUserInteraction);
      });
    }
  }
  
  // Set up IntersectionObserver for visibility monitoring
  function setupIntersectionObserver(carousel) {
    carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isCarouselVisible;
        isCarouselVisible = entry.isIntersecting && entry.intersectionRatio > 0.1;
        
        console.log(`[Video Force Play] Carousel visibility changed: ${wasVisible} -> ${isCarouselVisible}`);
        
        if (isCarouselVisible && !wasVisible) {
          // Carousel became visible
          ensureCarouselVisibility();
          
          // Try to play active video if user has interacted
          if (userHasInteracted) {
            const activeVideo = carousel.querySelector('video.active');
            if (activeVideo && activeVideo.paused) {
              forcePlayVideo(activeVideo);
            }
          }
        } else if (!isCarouselVisible && wasVisible) {
          // Carousel became hidden - pause videos to save resources
          const videos = carousel.querySelectorAll('video');
          videos.forEach(v => {
            if (!v.paused) v.pause();
          });
        }
      });
    }, {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.1, 0.5]
    });
    
    carouselObserver.observe(carousel);
  }
  
  // Handle page visibility changes
  function setupPageVisibilityHandler() {
    document.addEventListener('visibilitychange', function() {
      const carousel = document.getElementById('video-carousel');
      if (!carousel) return;
      
      if (document.hidden) {
        // Tab is hidden - pause all videos
        const videos = carousel.querySelectorAll('video');
        videos.forEach(v => {
          if (!v.paused) v.pause();
        });
      } else if (isCarouselVisible && userHasInteracted) {
        // Tab is visible again and carousel is in viewport - resume active video
        const activeVideo = carousel.querySelector('video.active');
        if (activeVideo && activeVideo.paused) {
          forcePlayVideo(activeVideo);
        }
      }
    });
  }
  
  // Ensure carousel visibility (called only when needed)
  function ensureCarouselVisibility() {
    if (!isCarouselVisible) return;
    
    const carousel = document.getElementById('video-carousel');
    if (!carousel) return;
    
    // Ensure carousel is visible
    carousel.style.opacity = '1';
    carousel.style.visibility = 'visible';
    carousel.style.display = 'block';
    
    // Check the active video only if visible
    const activeVideo = carousel.querySelector('video.active');
    if (activeVideo) {
      // Ensure active video is properly displayed
      showVideo(activeVideo);
      
      // If the video is paused and user has interacted, try to resume it
      if (activeVideo.paused && !activeVideo.ended && userHasInteracted) {
        console.log('[Video Force Play] Active video is paused, attempting to resume');
        forcePlayVideo(activeVideo);
      }
    }
  }
  
  // Cleanup function
  function cleanup() {
    if (carouselObserver) {
      carouselObserver.disconnect();
      carouselObserver = null;
    }
    
    const carousel = document.getElementById('video-carousel');
    if (carousel) {
      const videos = carousel.querySelectorAll('video');
      videos.forEach(v => {
        v.pause();
        v.removeAttribute('src');
        v.load();
      });
    }
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
  // Run initialization on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 