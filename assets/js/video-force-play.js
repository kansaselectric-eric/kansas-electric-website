// Video force-play script
// This script attempts multiple techniques to get videos playing

(function() {
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
    
    // Monitor visibility
    setupVisibilityChecking();
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
      
      // If this is the active video, try to resume it
      if (video.classList.contains('active')) {
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
      
      // Find the active video or first video
      const carousel = document.getElementById('video-carousel');
      if (!carousel) return;
      
      const activeVideo = carousel.querySelector('video.active') || carousel.querySelector('video');
      if (activeVideo) {
        forcePlayVideo(activeVideo);
      }
      
      // Remove all event listeners
      ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'].forEach(eventType => {
        document.removeEventListener(eventType, handleUserInteraction);
      });
    }
  }
  
  // Set up visibility checking
  function setupVisibilityChecking() {
    // Check every second that the active video is playing
    setInterval(() => {
      const carousel = document.getElementById('video-carousel');
      if (!carousel) return;
      
      // Ensure carousel is visible
      carousel.style.opacity = '1';
      carousel.style.visibility = 'visible';
      carousel.style.display = 'block';
      
      // Check the active video
      const activeVideo = carousel.querySelector('video.active');
      if (activeVideo) {
        // If the video is paused, try to resume it
        if (activeVideo.paused && !activeVideo.ended) {
          console.log('[Video Force Play] Active video is paused, attempting to resume');
          forcePlayVideo(activeVideo);
        }
      }
    }, 1000);
  }
  
  // Run initialization on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 