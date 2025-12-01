let startTime = 0;
let elapsed = 0;
let interval;
let running = false;


const display = document.getElementById("display");
const controls = document.getElementById("controls");     
const lapsArea = document.querySelector(".laps-area");
const lapsList = document.getElementById("laps");
const lap_txt = document.querySelector("#laps-txt");

const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");


pauseBtn.addEventListener("click", (e) => { e.stopPropagation(); pause(); });
resetBtn.addEventListener("click", (e) => { e.stopPropagation(); reset(); });
lapBtn.addEventListener("click", (e) => { e.stopPropagation(); lap(); });

window.addEventListener("click", (e) => {
    if (e.target.closest("#controls") || e.target.closest(".laps-area")) {
        return;
    }
    start();
});

function start() {
    if (running) return;

    running = true;
    startTime = Date.now() - elapsed;

    if (controls) {
        controls.style.opacity = "1";
        controls.style.transform = "translateY(0)";
        controls.style.pointerEvents = "auto";
    }
    if (lapsArea) {
        lapsArea.style.opacity = "1";
        lapsArea.style.transform = "translateX(0)";
    }

    interval = setInterval(updateDisplay, 10);
}

function pause() {
    if (!running) return;
    running = false;
    clearInterval(interval);
    elapsed = Date.now() - startTime;
}

function reset() {
    clearInterval(interval);

    let reverseStart = elapsed;
    let step = reverseStart / 200;

    let reverseInterval = setInterval(() => {
        reverseStart -= step;

        if (reverseStart <= 0) {
            clearInterval(reverseInterval);
            reverseStart = 0;
        }

        let ms = Math.floor((reverseStart % 1000) / 10);
        let sec = Math.floor((reverseStart / 1000) % 60);
        let min = Math.floor((reverseStart / 60000) % 60);
        let hr = Math.floor(reverseStart / 3600000);

        display.textContent =
            `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;

        if (reverseStart === 0) {
            running = false;
            elapsed = 0;
            startTime = 0;
            lapsList.innerHTML = "";
            lap_txt.innerText = "";
        }
    }, 5);

    running = false;
    elapsed = 0;
    startTime = 0;
}


function lap() {
    if (!running) return;

    const li = document.createElement("li");
    li.textContent = display.textContent;
    li.style.transform = "translateX(20px)";
    li.style.opacity = "0";
    li.style.transition = "transform 0.25s ease, opacity 0.25s ease";

    lapsList.appendChild(li);
    requestAnimationFrame(() => {
        li.style.transform = "translateX(0)";
        li.style.opacity = "1";
    });

    lap_txt.innerText = 'laps';
}

function updateDisplay() {
    elapsed = Date.now() - startTime;

    let ms = Math.floor((elapsed % 1000) / 10);
    let sec = Math.floor((elapsed / 1000) % 60);
    let min = Math.floor((elapsed / 60000) % 60);
    let hr = Math.floor(elapsed / 3600000);

    display.textContent = `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;
}

function pad(num) {
    return String(num).padStart(2, "0");
}

if (controls) {
    controls.style.opacity = "0";
    controls.style.transform = "translateY(20px)";
    controls.style.transition = "opacity 0.45s ease, transform 0.45s ease";
    controls.style.pointerEvents = "none";
}
if (lapsArea) {
    lapsArea.style.opacity = "0";
    lapsArea.style.transform = "translateX(40px)";
    lapsArea.style.transition = "opacity 0.6s ease, transform 0.6s ease";
}
