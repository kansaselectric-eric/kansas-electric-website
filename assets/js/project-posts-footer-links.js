document.addEventListener('DOMContentLoaded', () => {
  console.log('Fetching project posts for footer...');
  fetch('/assets/js/project-posts.json')
    .then(response => response.json())
    .then(data => {
      const projectList = document.querySelector('[data-project-links]');

      // Slice the array to start from index 0 and end at index 4
      const slicedData = data.slice(0, 3);

      slicedData.forEach(post => {
          const postDiv = document.createElement('li');
          postDiv.classList.add('mb-2');

          postDiv.innerHTML = `<a href="${post.url}" class="inline-block leading-4 md:leading-10 py-1 md:leading-normal md:py-0 text-ke-gray-light transition duration-200 hover:translate-x-2 focus:translate-x-2">${post.short_title}</a>`;

          projectList.appendChild(postDiv);
      });
    })
    .catch(error => console.error('Error loading blog posts:', error));
}, false);