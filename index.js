let projects_list = [
  ["ToDo", "Add Edit ToDo", "https://todo-bfp3.onrender.com/"],
  ["Post Site", "Create,Edit and Delete", "https://post-priyan.vercel.app/"],
  ["Simon Game", "Using JQuery", 'https://priyadharsant.github.io/simon_game/'],
  ["Music Player", "Basic Music Player", 'https://priyadharsant.github.io/music_player/'],
  ["Dice Game", "Two Player Game", "https://priyadharsant.github.io/dice_game/"],
  ["Tin Dog", "Using Bootstrap", "https://priyantindog.netlify.app/"],
  ["KMV Asuran", "Website for Gaming YouTuber", "https://Priyadharsant.github.io/old_portfolio/asuran"]
]

let project = document.querySelectorAll(".projects");
projects_list.forEach((e, i) => {
  let h4 = document.createElement("h4");
  let p = document.createElement("p");
  h4.innerText = e[0];
  p.innerText = e[1];
  let li = document.createElement("li");
  li.appendChild(h4)
  li.appendChild(p)
  li.setAttribute("onclick", "window.location.href='" + e[2] + "'")
  project[0].appendChild(li)
  project[1].appendChild(li.cloneNode(true));
  // try {
  //   li.onclick = () => {
  //     window.location.href = e[2];
  //     console.log(e[2])
  //   }
  // } catch (error
  // ) {
  //   console.log(error)
  // }
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
let success = ["#d4edda", "#155724"];
let err_msg = ["#f8d7da", "#721c24"];
updateAchievements();
setInterval(updateAchievements, 4600);


(function () {
  emailjs.init("dC14qcr4g4yVnkS27");
})();

const emailInput = document.getElementById("email");
const notifyBox = document.getElementById("note");

emailInput.addEventListener("focus", () => {
  notifyBox.classList.add("show");
});

emailInput.addEventListener("blur", () => {
  notifyBox.classList.remove("show");
});

document.getElementById("contact-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  let mail = document.getElementById("email");
  let notify_status = document.querySelector(".notify_status");
  let notify_sym = document.querySelector(".notify_sym");
  let notify_msg = document.querySelector(".notify_msg");
  let send_btn = document.querySelector(".send");
  if (mail.value === '') {
    mail.value = "unknownemail1807@gmail.com";
    console.log(mail.value)
  }
  send_btn.innerText = "Sending...";
  send_btn.disabled = true;
  setTimeout(() => {
    send_btn.innerText = "Send";
    send_btn.disabled = false;
  }, 3000);
  console.log(this)
  await emailjs.sendForm("service_2ij6k8e", "template_70dkd0o", this)
    .then(() => {
      notify_msg.innerText = "Your message has been sent successfully!";
      notify_sym.style.borderColor = "#03e803";
      notify_sym.querySelector("p").style.color = "#03e803";
      notify_sym.querySelector("p").innerText = "✓";
      this.reset();
    })
    .catch((error) => {
      notify_msg.innerText = "Something went wrong! Please try again.";
      notify_sym.style.borderColor = "#f94e4e";
      notify_sym.querySelector("p").style.color = "#f94e4e";
      notify_sym.querySelector("p").innerText = "!";
      console.error(error);
    });
  notify_status.classList.add("show");

  setTimeout(() => {
    notify_status.classList.remove("show");
  }, 3000)
});

const hamburger_menu = document.getElementById("hamburger_menu");
const menu = document.getElementById("menu");

hamburger_menu.addEventListener("click", () => {
  menu.classList.toggle("show");
  hamburger_menu.classList.toggle("active");
});
window.addEventListener("scroll", () => {
  menu.classList.remove("show");
  hamburger_menu.classList.remove("active");
});

let year = new Date().getFullYear();
document.querySelector(".license p").innerHTML = `&copy; ${year} Priyadharsan.`;