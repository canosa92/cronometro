const stopwatch = document.getElementById('stopwatch') as HTMLElement | null;
const playPauseButton = document.getElementById('play-pause') as HTMLElement | null;
const orbitBall = document.getElementById('orbit-ball') as HTMLElement | null;

let stopwatchInterval: number | null = null;

let runningTime = 0;
let timerMode = false;
let timerDuration = 0;
let startPauseTime = 0;

function createTimeMarks(): void {
    const timeMarks = document.querySelector('.time-marks') as HTMLElement | null;
    if (timeMarks) {
        for (let i = 0; i < 60; i++) {
            const mark = document.createElement('div');
            mark.className = `time-mark ${i % 5 === 0 ? 'main' : ''}`;
            mark.style.transform = `rotate(${i * 6}deg)`;
            timeMarks.appendChild(mark);
        }
    }
}

function updateBallPosition(timeInMs: number): void {
    if (orbitBall && !orbitBall.classList.contains('running')) {
        const seconds = (timeInMs / 1000) % 60;
        const degrees = (seconds / 60) * 360;
        orbitBall.style.transform = `rotate(${degrees}deg)`;
    }
}

function toggleTheme(): void {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

const playPause = (): void => {
    if (playPauseButton && orbitBall) {
        const isPaused = !playPauseButton.classList.contains('running');
        if (isPaused) {
            playPauseButton.classList.add('running');
            if (runningTime === 0) {
                orbitBall.style.transform = 'rotate(0deg)';
                orbitBall.classList.add('running');
            } else {
                const currentRotation = getComputedStyle(orbitBall).transform;
                orbitBall.style.transform = currentRotation;
                orbitBall.classList.remove('paused');
                orbitBall.classList.add('running');
            }
            start();
        } else {
            playPauseButton.classList.remove('running');
            orbitBall.classList.add('paused');
            pause();
        }
    }
};

const pause = (): void => {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        startPauseTime = Date.now();
    }
};

const stopTimer = (): void => {
    playPauseButton?.classList.remove('running');
    orbitBall?.classList.remove('running');
    orbitBall?.classList.remove('paused');
    orbitBall!.style.transform = 'rotate(0deg)';
    clearInterval(stopwatchInterval!);
    runningTime = 0;
    timerMode = false;
    stopwatch!.textContent = '00:00:000';
};


const start = (): void => {
    let startTime: number;
    if (runningTime === 0) {
        startTime = Date.now();
    } else {
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
            if (stopwatch) stopwatch.textContent = calculateTime(remainingTime);
        } else {
            if (stopwatch) stopwatch.textContent = calculateTime(runningTime);
        }
    }, 10);
};

const calculateTime = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
};

const setTimer = (minutes: number): void => {
    stopTimer();
    timerMode = true;
    timerDuration = minutes * 60 * 1000;
    runningTime = 0;
    if (stopwatch) stopwatch.textContent = calculateTime(timerDuration);
};

const setCustomTimer = (): void => {
    const customMinutes = (document.getElementById('custom-minutes') as HTMLInputElement | null)?.value;
    if (customMinutes && parseInt(customMinutes) > 0) {
        setTimer(parseInt(customMinutes));
    } else {
        alert('Por favor, ingresa un número válido de minutos');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    createTimeMarks();
    loadTheme();
    if (orbitBall) orbitBall.style.transform = 'rotate(0deg)';
});
