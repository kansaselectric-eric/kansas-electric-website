// Video initialization script - ensures videos are properly loaded and ready to play
document.addEventListener('DOMContentLoaded', function() {
  console.log('Video initialization script running...');
  
  // Get the video carousel
  const carousel = document.getElementById('video-carousel');
  if (!carousel) {
    console.error('Video carousel not found');
    return;
  }
  
  // Get all videos
  const videos = carousel.querySelectorAll('video');
  if (videos.length === 0) {
    console.error('No videos found in carousel');
    return;
  }
  
  console.log(`Found ${videos.length} videos in carousel`);
  
  // Function to initialize a single video
  function initVideo(video, index) {
    return new Promise((resolve, reject) => {
      console.log(`Initializing video ${index+1}`);
      
      // Set essential attributes
      video.muted = true;
      video.loop = true;
      video.setAttribute('playsinline', '');
      video.preload = 'auto';
      
      // Set up event listeners
      const onCanPlay = () => {
        console.log(`Video ${index+1} can play`);
        video.removeEventListener('canplay', onCanPlay);
        resolve(video);
      };
      
      const onError = (e) => {
        console.error(`Error loading video ${index+1}:`, e);
        video.removeEventListener('error', onError);
        reject(e);
      };
      
      // Listen for video ready or error
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onError);
      
      // Force loading
      video.load();
      
      // Start loading but pause immediately
      video.play().then(() => {
        if (index !== 0) { // Pause all except the first video
          video.pause();
        }
      }).catch(e => {
        console.warn(`Initial play for video ${index+1} failed:`, e);
        // This is expected due to autoplay restrictions
      });
      
      // Set timeout to resolve anyway after 5 seconds to prevent hanging
      setTimeout(() => {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
          resolve(video);
        } else {
          console.warn(`Video ${index+1} not ready after timeout, continuing anyway`);
          resolve(video);
        }
      }, 5000);
    });
  }
  
  // Initialize all videos
  Promise.all(Array.from(videos).map((video, index) => initVideo(video, index)))
    .then(initializedVideos => {
      console.log('All videos initialized');
      
      // Make sure the first video is active and playing
      videos[0].classList.add('active');
      videos[0].style.opacity = '1';
      videos[0].style.visibility = 'visible';
      videos[0].style.display = 'block';
      
      // Hide other videos
      for (let i = 1; i < videos.length; i++) {
        videos[i].classList.remove('active');
        videos[i].style.opacity = '0';
        videos[i].style.visibility = 'hidden';
        videos[i].style.display = 'none';
        videos[i].pause();
      }
      
      // Start playing the first video
      const playFirstVideo = () => {
        videos[0].play().catch(e => {
          console.error('Error playing first video:', e);
          
          // Try with muted if autoplay was blocked
          if (e.name === 'NotAllowedError') {
            videos[0].muted = true;
            videos[0].play().catch(e2 => {
              console.error('Still could not play first video even muted:', e2);
            });
          }
          
          // Retry after a short delay
          setTimeout(playFirstVideo, 1000);
        });
      };
      
      playFirstVideo();
    })
    .catch(error => {
      console.error('Error initializing videos:', error);
    });
}); 