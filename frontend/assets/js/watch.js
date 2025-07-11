const video = document.querySelector('.play-video');
const playBtn = document.querySelector('.ti-player-play-filled');
const volumeBtn = document.querySelector('.play-volume');
const volumeIcon = volumeBtn.querySelector('i');
const volumeNumber = document.querySelector('.play-volume__number');
const volumeToggle = document.querySelector('.play-volume__toggle');
const volumeBar = document.querySelector('.play-volume__bar');
const realTime = document.getElementById('realTime');
const totalTime = document.getElementById('totalTime');
const speedData = document.querySelector('.play-speed__data');
const speedItems = document.querySelectorAll('.play-speed__item');
const fullscreenBtn = document.querySelector('.ti-arrows-maximize');
const progressBar = document.querySelector('.play-bar');
const progressToggle = document.querySelector('.play-toggle');
const progressTime = document.querySelector('.play-bar__number');
const screenPlay = document.querySelector('.play-screem');

// Cập nhật thời gian
const formatTime = seconds => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
};

video.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(video.duration);
});

video.addEventListener('timeupdate', () => {
    realTime.textContent = formatTime(video.currentTime);
    updateProgressUI();
});

video.addEventListener('ended', () => {
    screenPlay.classList.remove('active');
    playBtn.classList.remove('ti-player-pause-filled', 'ti-player-play-filled');
    playBtn.classList.add('ti-repeat');
});

// Phát / Tạm dừng bằng nút nhỏ
playBtn.addEventListener('click', () => {
    if (playBtn.classList.contains('ti-repeat')) {
        video.currentTime = 0;
        video.play();
        playBtn.classList.remove('ti-repeat');
        playBtn.classList.add('ti-player-pause-filled');
        screenPlay.classList.add('active');
    } else if (video.paused) {
        video.play();
        playBtn.classList.remove('ti-player-play-filled');
        playBtn.classList.add('ti-player-pause-filled');
        screenPlay.classList.add('active');
    } else {
        video.pause();
        playBtn.classList.remove('ti-player-pause-filled');
        playBtn.classList.add('ti-player-play-filled');
        screenPlay.classList.remove('active');
    }
});

// Phát / Tạm dừng bằng nút giữa màn hình
screenPlay.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        screenPlay.classList.add('active');
        playBtn.classList.remove('ti-player-play-filled');
        playBtn.classList.add('ti-player-pause-filled');
    } else {
        video.pause();
        screenPlay.classList.remove('active');
        playBtn.classList.remove('ti-player-pause-filled');
        playBtn.classList.add('ti-player-play-filled');
    }
});

// Điều chỉnh âm lượng (theo chiều dọc + kéo chuột)
let volume = 0.5; // mặc định 50%
video.volume = volume;
volumeNumber.textContent = Math.round(volume * 100);

const updateVolumeUI = () => {
    volumeNumber.textContent = Math.round(volume * 100);
    const barHeight = volumeBar.clientHeight;
    const toggleHeight = volume * barHeight;
    volumeToggle.style.height = `${toggleHeight}px`;

    if (volume === 0) {
        volumeIcon.classList.remove('ti-volume');
        volumeIcon.classList.add('ti-volume-off');
    } else {
        volumeIcon.classList.remove('ti-volume-off');
        volumeIcon.classList.add('ti-volume');
    }
};

const setVolumeFromPosition = (clientY) => {
    const rect = volumeBar.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const percent = 1 - (offsetY / rect.height);
    volume = Math.max(0, Math.min(1, percent));
    video.volume = volume;
    updateVolumeUI();
};

let isDraggingVolume = false;

volumeBar.addEventListener('mousedown', (e) => {
    isDraggingVolume = true;
    setVolumeFromPosition(e.clientY);
});

window.addEventListener('mousemove', (e) => {
    if (isDraggingVolume) {
        setVolumeFromPosition(e.clientY);
    }
    if (isDraggingProgress) {
        setProgressFromPosition(e.clientX);
    }
});

window.addEventListener('mouseup', () => {
    isDraggingVolume = false;
    isDraggingProgress = false;
});

// Tốc độ phát lại
speedItems.forEach(item => {
    item.addEventListener('click', () => {
        speedItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const speed = parseFloat(item.textContent.replace('X', ''));
        video.playbackRate = speed;
        speedData.textContent = item.textContent;
    });
});

// Toàn màn hình
fullscreenBtn.addEventListener('click', () => {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
});

// Điều chỉnh tiến độ video (drag bar)
let isDraggingProgress = false;

const updateProgressUI = () => {
    const percent = video.currentTime / video.duration;
    const barWidth = progressBar.clientWidth;
    progressToggle.style.width = `${percent * barWidth}px`;
    progressTime.textContent = formatTime(video.currentTime);
};

const setProgressFromPosition = (clientX) => {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percent = offsetX / rect.width;
    const clamped = Math.max(0, Math.min(1, percent));
    video.currentTime = clamped * video.duration;
    updateProgressUI();
};

progressBar.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    setProgressFromPosition(e.clientX);
});

// Cập nhật UI lần đầu
updateVolumeUI();