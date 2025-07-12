document.addEventListener('DOMContentLoaded', () => {
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


    // ========================================================================

    // Xử lý khi click nút chia sẻ
    document.getElementById('btnShare')?.addEventListener('click', () => {
        document.getElementById('modalShare').classList.add('active');
        document.body.classList.add('hiddenScroll');
    });

    document.getElementById('closeModalShare')?.addEventListener('click', () => {
        document.getElementById('modalShare').classList.remove('active');
        document.body.classList.remove('hiddenScroll');
    });


    // ============================================================================

    // Lấy tất cả textarea trong .share-wrap
    const textareas = document.querySelectorAll('.share-wrap textarea');

    // Hàm autoResize áp dụng cho từng textarea
    const autoResize = (el) => {
        el.style.height = 'auto'; // reset trước
        el.style.height = el.scrollHeight + 'px'; // giãn theo nội dung
    };

    // Gắn sự kiện và gọi resize ban đầu
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => autoResize(textarea));
        window.addEventListener('load', () => autoResize(textarea));
    });

    // =============================================================================

    // Lặp qua tất cả các nút sao chép
    document.querySelectorAll('.share-copy').forEach(copyBtn => {
        copyBtn.addEventListener('click', () => {
            // Tìm .textarea tương ứng trong cùng .share-item
            const shareItem = copyBtn.closest('.share-item');
            const textarea = shareItem.querySelector('textarea');

            // Sao chép nội dung
            textarea.select();
            document.execCommand('copy');

            // Đổi icon và text
            const icon = copyBtn.querySelector('i');
            const span = copyBtn.querySelector('span');

            const originalIconClass = 'ti ti-copy';
            const successIconClass = 'ti ti-check';

            icon.className = successIconClass;
            span.textContent = 'Đã sao chép';

            // Sau 3s quay lại
            setTimeout(() => {
                icon.className = originalIconClass;
                span.textContent = 'Sao chép';
            }, 3000);
        });
    });


    // ==================================================================
    document.querySelector('.btn-tools')?.addEventListener('click', () => {
        document.querySelector('.product-tools').classList.add('active');
    });

    // Click bên ngoài .product-tools thì xoá active
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".product-tools.active").forEach(tools => {
            if (!tools.contains(e.target) && !tools.previousElementSibling?.contains(e.target)) {
                tools.classList.remove("active");
            }
        });
    });

    // Cuộn trang thì xoá tất cả .active
    window.addEventListener("scroll", () => {
        document.querySelectorAll(".product-tools.active").forEach(tools => {
            tools.classList.remove("active");
        });
    });


    // =======================================================================

    // tải video
    document.querySelectorAll(".product-download").forEach(button => {
        button.addEventListener("click", () => {
            const fileUrl = button.getAttribute("data-link");
            if (!fileUrl) return;

            // Tạo thẻ <a> tạm thời để tải file
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileUrl.split("/").pop(); // Đặt tên file theo tên gốc
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });


    // ====================================================================

    const reportItems = document.querySelectorAll('.report-item');
    const submitBtnReport = document.getElementById('submitBtnReport');
    const cancelBtnReport = document.getElementById('cancelBtnReport');
    const modalReport = document.getElementById('modalReport');
    const productIdReport = document.getElementById('productIdReport');

    // Chọn report lý do
    reportItems.forEach(item => {
        item.addEventListener('click', () => {
            reportItems.forEach(i => {
                const radio = i.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
                i.classList.remove('selected');
            });

            const currentRadio = item.querySelector('input[type="radio"]');
            if (currentRadio) currentRadio.checked = true;

            if (currentRadio?.checked) {
                submitBtnReport.classList.add('active');
                submitBtnReport.setAttribute('type', 'submit');
                item.classList.add('selected');
            }
        });
    });

    // Huỷ report
    cancelBtnReport?.addEventListener('click', () => {
        modalReport?.classList.remove('active');

        reportItems.forEach(item => {
            const radio = item.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
            item.classList.remove('selected');
        });

        submitBtnReport.classList.remove('active');
        submitBtnReport.setAttribute('type', 'button');
    });

    // Mở modal báo cáo
    const reportBtn = document.querySelector('.product-report');
    if (reportBtn) {
        reportBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn sự kiện lan ra ngoài nếu cần

            const productTools = reportBtn.closest('.product-tools');

            // Xoá .active trước khi mở modal
            if (productTools?.classList.contains('active')) {
                productTools.classList.remove('active');
            }

            const productIdInput = productTools?.querySelector('#productId');
            const productId = productIdInput?.value;

            if (productId) {
                productIdReport.value = productId;

                // Delay mở modal để đảm bảo classList đã cập nhật
                setTimeout(() => {
                    modalReport?.classList.add('active');
                }, 10);
            }
        });
    }
});