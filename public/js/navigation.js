const hambBtn = document.getElementById('ham-btn');
const mobileMenu = document.querySelector('.nav-bar ul');

hambBtn.addEventListener('click', () => {
hambBtn.classList.toggle('active');   // toggles ☰ ↔ ✖
mobileMenu.classList.toggle('show');        // toggles menu visibility
});
