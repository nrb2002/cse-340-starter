const hambBtn = document.getElementById('ham-btn');
const mobileMenu = document.querySelector('.nav-bar ul');

hambBtn.addEventListener('click', () => {
hambBtn.classList.toggle('active');   // toggles ☰ ↔ ✖
mobileMenu.classList.toggle('show');        // toggles menu visibility
});


//Highlight the active menu link
const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-bar ul li a");

navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
        link.parentElement.classList.add("current");
    } else {
        link.parentElement.classList.remove("current");
    }
});
