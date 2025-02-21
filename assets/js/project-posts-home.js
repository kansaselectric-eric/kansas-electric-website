document.addEventListener('DOMContentLoaded', () => {
  console.log('Fetching project posts...');
  fetch('/assets/js/project-posts.json')
    .then(response => response.json())
    .then(data => {
      const projectGrid = document.querySelector('[data-project-grid]');

      // Slice the array to start from index 0 and end at index 10
      const slicedData = data.slice(0, 3);

      slicedData.forEach(post => {
          const postDiv = document.createElement('li');

          postDiv.innerHTML = `
              <a href="${post.url}" class="block group overflow-hidden">
              <div class="w-full h-72 mb-4">
                <img class="block transform group-hover:scale-105 group-focus:scale-105 transition duration-200 ease-in-out w-full h-full object-cover object-center" src="${post.image}" alt="${post.title}">
              </div>
              <h3 class="text-xl font-bold mb-4">${post.title}</h3>
              <p class="inline-block mb-12 lg:mb-4 text-base font-semibold text-ke-blue py-2 w-full md:w-auto rounded hover:translate-x-2 focus:translate-x-2 transition duration-200 ease-in-out">Read More</p>
              </a>
          `;

          projectGrid.appendChild(postDiv);
      });
    })
    .catch(error => console.error('Error loading blog posts:', error));
}, false);