const emailInput = document.getElementById("email");
const notifyBox = document.getElementById("note");

emailInput.addEventListener("focus", () => {
  notifyBox.classList.add("show");
});

emailInput.addEventListener("blur", () => {
  notifyBox.classList.remove("show");
});
window.addEventListener('load', () => {
    const popup = document.getElementById('popup');
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 20000);
    document.getElementById('loading').style.display = 'none';
});

function hidePopup() { document.getElementById('popup').classList.remove('show'); }

emailjs.init("dC14qcr4g4yVnkS27");

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    emailjs.sendForm('service_0j2q9jq', 'template_70dkd0o', this).then(() => {
        alert('Message sent successfully!');
        this.reset();
    }, (error) => {
        alert('Failed to send, try again.');
        console.error(error);
    });
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const likeButton = document.getElementById('like-button');
const likeCount = document.getElementById('like-count');
let likes = parseInt(localStorage.getItem('likes')) || 0;
likeCount.textContent = likes;
if (sessionStorage.getItem('hasLiked')) {
    likeButton.disabled = true;
    likeButton.textContent = '❤️ Liked';
    likeButton.classList.add('liked');
}
likeButton.addEventListener('click', () => {
    if (!sessionStorage.getItem('hasLiked')) {
        likes++;
        likeCount.textContent = likes;
        localStorage.setItem('likes', likes);
        sessionStorage.setItem('hasLiked', 'true');
        likeButton.classList.add('liked');
        likeButton.textContent = '❤️ Liked';
        likeButton.disabled = true;
    }
});
