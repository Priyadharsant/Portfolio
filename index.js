let projects_list = [
    ["Simon Game","Using JQuery",'https://priyadharsant.github.io/simon_game/'],
    ["Music Player","Basic Music Player",'https://priyadharsant.github.io/music_player/'],
    ["Dice Game","Two Player Game","https://priyadharsant.github.io/dice_game/"],
    ["Tin Dog","Using Bootstrap","https://priyantindog.netlify.app/"],
    ["KMV Asuran","Website for Gaming YouTuber","https://Priyadharsant.github.io/old_portfolio/asuran"]
]

let project = document.querySelectorAll(".projects");
projects_list.forEach((e,i) => {
    let h4 = document.createElement("h4");
    let p = document.createElement("p");
    h4.innerText = e[0];
    p.innerText = e[1];
    let li = document.createElement("li");
    li.appendChild(h4)
    li.appendChild(p)
    project[0].appendChild(li)
    project[1].appendChild(li.cloneNode(true));
    li.onclick =() => {
         window.location.href = e[2];
         }
})

let achieve = [
  "1000+ Problems Solved in SkillRack",
  "500+ Problems Solved in CodeChef",
  "25+ Certificate in SkillRack",
  "2nd Place in Skillrack College level",
  "550+ Bronze Medals in SkillRack",
  "SkillRack Global Rank 4527",
  "CodeChef Gold Batch for Problem Solving"
];

let achievement = document.querySelectorAll(".achieve p");

function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let random = Math.floor(Math.random() * arr.length);
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
}

function updateAchievements() {
  shuffle(achieve); 
  achievement.forEach((el, i) => {
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => {
        el.innerText = achieve[i];
        el.classList.add("show");
      }, 800); 
    }, i * 300); 
  });
}

updateAchievements();
setInterval(updateAchievements, 4600);

// Initialize EmailJS
(function(){
  emailjs.init("dC14qcr4g4yVnkS27");
})();

const emailInput = document.getElementById("email");
const notifyBox = document.getElementById("note");

// Show / hide note box
emailInput.addEventListener("focus", () => {
  notifyBox.classList.add("show");
});

emailInput.addEventListener("blur", () => {
  notifyBox.classList.remove("show");
});

// Handle form submit
document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();
  let mail = document.getElementById("email");
  if (mail.value === '') {
      mail.value = "unknownemail1807@gmail.com";
      console.log(mail.value)
  }
  emailjs.sendForm("service_2ij6k8", "template_70dkd0o", this)
    .then(() => {
      alert("✅ Message sent successfully!");
      this.reset();
    })
    .catch((error) => {
      alert("❌ Failed to send, try again.");
      console.error(error);
    });
});