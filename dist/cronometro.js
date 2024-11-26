"use strict";
const stopwatch = document.getElementById('stopwatch');
const playPauseButton = document.getElementById('play-pause');
const orbitBall = document.getElementById('orbit-ball');
let stopwatchInterval = null;
let runningTime = 0;
let timerMode = false;
let timerDuration = 0;
let startPauseTime = 0;
function createTimeMarks() {
    const timeMarks = document.querySelector('.time-marks');
    if (timeMarks) {
        for (let i = 0; i < 60; i++) {
            const mark = document.createElement('div');
            mark.className = `time-mark ${i % 5 === 0 ? 'main' : ''}`;
            mark.style.transform = `rotate(${i * 6}deg)`;
            timeMarks.appendChild(mark);
        }
    }
}
function updateBallPosition(timeInMs) {
    if (orbitBall && !orbitBall.classList.contains('running')) {
        const seconds = (timeInMs / 1000) % 60;
        const degrees = (seconds / 60) * 360;
        orbitBall.style.transform = `rotate(${degrees}deg)`;
    }
}
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
const playPause = () => {
    if (playPauseButton && orbitBall) {
        const isPaused = !playPauseButton.classList.contains('running');
        if (isPaused) {
            playPauseButton.classList.add('running');
            if (runningTime === 0) {
                orbitBall.style.transform = 'rotate(0deg)';
                orbitBall.classList.add('running');
            }
            else {
                const currentRotation = getComputedStyle(orbitBall).transform;
                orbitBall.style.transform = currentRotation;
                orbitBall.classList.remove('paused');
                orbitBall.classList.add('running');
            }
            start();
        }
        else {
            playPauseButton.classList.remove('running');
            orbitBall.classList.add('paused');
            pause();
        }
    }
};
const pause = () => {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        startPauseTime = Date.now();
    }
};
const stopTimer = () => {
    playPauseButton === null || playPauseButton === void 0 ? void 0 : playPauseButton.classList.remove('running');
    orbitBall === null || orbitBall === void 0 ? void 0 : orbitBall.classList.remove('running');
    orbitBall === null || orbitBall === void 0 ? void 0 : orbitBall.classList.remove('paused');
    orbitBall.style.transform = 'rotate(0deg)';
    clearInterval(stopwatchInterval);
    runningTime = 0;
    timerMode = false;
    stopwatch.textContent = '00:00:000';
};
const start = () => {
    let startTime;
    if (runningTime === 0) {
        startTime = Date.now();
    }
    else {
        startTime = Date.now() - runningTime;
    }
    stopwatchInterval = setInterval(() => {
        runningTime = Date.now() - startTime;
        if (timerMode) {
            const remainingTime = timerDuration - runningTime;
            if (remainingTime <= 0) {
                stopTimer();
                alert('¡Tiempo completado!');
                return;
            }
            if (stopwatch)
                stopwatch.textContent = calculateTime(remainingTime);
        }
        else {
            if (stopwatch)
                stopwatch.textContent = calculateTime(runningTime);
        }
    }, 10);
};
const calculateTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
};
const setTimer = (minutes) => {
    stopTimer();
    timerMode = true;
    timerDuration = minutes * 60 * 1000;
    runningTime = 0;
    if (stopwatch)
        stopwatch.textContent = calculateTime(timerDuration);
};
const setCustomTimer = () => {
    var _a;
    const customMinutes = (_a = document.getElementById('custom-minutes')) === null || _a === void 0 ? void 0 : _a.value;
    if (customMinutes && parseInt(customMinutes) > 0) {
        setTimer(parseInt(customMinutes));
    }
    else {
        alert('Por favor, ingresa un número válido de minutos');
    }
};
document.addEventListener('DOMContentLoaded', () => {
    createTimeMarks();
    loadTheme();
    if (orbitBall)
        orbitBall.style.transform = 'rotate(0deg)';
});
