// Render Feather Icons
feather.replace();

// Scroll Reveal Animation Functionality
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

// Attach Event Listener for Scroll
window.addEventListener('scroll', revealOnScroll);

// Execute once on page load
document.addEventListener('DOMContentLoaded', revealOnScroll);
