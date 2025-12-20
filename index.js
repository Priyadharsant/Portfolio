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

// Show / hide note box
emailInput.addEventListener("focus", () => {
  notifyBox.classList.add("show");
});

emailInput.addEventListener("blur", () => {
  notifyBox.classList.remove("show");
});

document.getElementById("contact-form").addEventListener("submit", function (event) {
  event.preventDefault();
  let mail = document.getElementById("email");
  let sendbtn = documents.getElementByClass("send");
  let notify_status = document.querySelector(".notify_status");
  if (mail.value === '') {
    mail.value = "unknownemail1807@gmail.com";
    console.log(mail.value)
  }
  sendbtn.setAttribute("disabled",true);
  emailjs.sendForm("service_2ij6k8e", "template_70dkd0o", this)
    .then(() => {
      notify_status.innerText = "✅ Message sent successfully!";
      notify_status.style.background = success[0];
      notify_status.style.color = success[1];
      notify_status.style.borderColor = "green";
      notify_status.style.boxShadow = "0 0 10px #a5ff80"
      this.reset();
    })
    .catch((error) => {
      notify_status.innerText = "❌ Failed to send, try again.";
      notify_status.style.background = err_msg[0];
      notify_status.style.color = err_msg[1]
      //notify_status.style.borderColor = "red";
      notify_status.style.boxShadow = "0 0 10px  #ff808a"
      console.error(error);
    });
  notify_status.classList.add("show");
  sendbtn.setAttribute("disabled",false);
  setTimeout(() => {
    notify_status.classList.remove("show");
  }, 5000)
});

const hamburger_menu = document.getElementById("hamburger_menu");
const menu = document.getElementById("menu");

hamburger_menu.addEventListener("click", () => {
  menu.classList.toggle("show");
  hamburger_menu.classList.toggle("active");
});
