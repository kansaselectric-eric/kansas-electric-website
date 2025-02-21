window.addEventListener("load", function() {
  const homeCarousel = document.querySelector('[data-carousel]');

  // if(heroImage !== null) {
  //   heroImage.forEach(function(item) {
  //     item.classList.add('fade-in');
  //     item.classList.add('shift');
  //     item.classList.remove('conceal');
  //   });
  // }

  function rotateImg() {
    // get the slides
    const images = document.querySelector('[data-slides');
    // get the 'active' slide
    const activeSlide = images.querySelector('[data-active]');
    // set offset to 1
    const offset = 1;
    // convert images (iterable object) children (the li) to an array with spread syntax (...)
      // find the index of the active image
      // add the offset to get the new index
      let newIndex = [...images.children].indexOf(activeSlide) + offset;
      // if the 'prev' button is clicked and the new index is less than 0
      // subtract 1 from from the total number of children (li)
      // if (newIndex < 0) {
      //   newIndex = images.children.length - 1;
      // }
      // if the new index is greater than or equal to the number of slides
      // set new index back to zero
      if (newIndex >= images.children.length) {
        newIndex = 0;
      }
      // add the dataset-active attribute to the current active slide
      images.children[newIndex].dataset.active = true;
      // use the 'delete' remove the dataset active attribute from the previous active slide
      delete activeSlide.dataset.active;
  }

  if (homeCarousel) {
    let interval = setInterval(rotateImg, 6000);
  }

});