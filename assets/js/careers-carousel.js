let currentIndex = 0;
const slides = document.querySelectorAll('.career-carousel picture');
let interval = setInterval(nextSlide, 5000);

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
}

document.getElementById('carousel').addEventListener('mouseenter', () => {
    clearInterval(interval);
});

document.getElementById('carousel').addEventListener('mouseleave', () => {
    interval = setInterval(nextSlide, 5000);
});