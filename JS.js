let startTime = 0;
let elapsed = 0;
let interval;
let running = false;
let isResetting = false;

const display = document.getElementById("display");
const controls = document.getElementById("controls");
const lapsArea = document.querySelector(".laps-area");
const lapsList = document.getElementById("laps");
const lap_txt = document.querySelector("#laps-txt");

const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

pauseBtn.addEventListener("click", (e) => { e.stopPropagation(); if (!isResetting) pause(); });
resetBtn.addEventListener("click", (e) => { e.stopPropagation(); if (!isResetting) reset(); });
lapBtn.addEventListener("click", (e) => { e.stopPropagation(); if (!isResetting) lap(); });

window.addEventListener("click", (e) => {
    if (e.target.closest("#controls") || e.target.closest(".laps-area")) return;
    if (isResetting) return;
    if (!running) {
        start();
    } else {
        pause();
    }
});

function start() {
    if (running || isResetting) return;

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
    if (!running || isResetting) return;
    running = false;
    clearInterval(interval);
    elapsed = Date.now() - startTime;
}

function reset() {
    if (isResetting) return;
    isResetting = true;
    if (controls) {
        controls.style.pointerEvents = "none";
    }
    if (running) {
        elapsed = Date.now() - startTime;
    }
    clearInterval(interval);
    running = false;

    const duration = 600; 
    const tick = 10; 
    const steps = Math.max(1, Math.floor(duration / tick));
    let reverseStart = Math.max(0, elapsed);
    const decrement = reverseStart / steps;

    if (reverseStart <= 0) {
        finishReset();
        return;
    }

    let current = reverseStart;
    let reverseInterval = setInterval(() => {
        current -= decrement;
        if (current <= 0) {
            current = 0;
        }

        let ms = Math.floor((current % 1000) / 10);
        let sec = Math.floor((current / 1000) % 60);
        let min = Math.floor((current / 60000) % 60);
        let hr = Math.floor(current / 3600000);

        display.textContent = `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;

        if (current === 0) {
            clearInterval(reverseInterval);
            finishReset();
        }
    }, tick);
}

function finishReset() {
    running = false;
    elapsed = 0;
    startTime = 0;

    lapsList.innerHTML = "";
    lap_txt.innerText = "";
    display.textContent = "00:00:00.00";
    if (controls) {
        controls.style.opacity = "0";
        controls.style.transform = "translateY(20px)";
        controls.style.pointerEvents = "none";
    }
    if (lapsArea) {
        lapsArea.style.opacity = "0";
        lapsArea.style.transform = "translateX(40px)";
    }
    isResetting = false;
}

function lap() {
    let currentElapsed = running ? (Date.now() - startTime) : elapsed;
    let ms = Math.floor((currentElapsed % 1000) / 10);
    let sec = Math.floor((currentElapsed / 1000) % 60);
    let min = Math.floor((currentElapsed / 60000) % 60);
    let hr = Math.floor(currentElapsed / 3600000);
    const li = document.createElement("li");

    li.textContent = `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;
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
    return String(Math.max(0, Math.floor(num))).padStart(2, "0");
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
