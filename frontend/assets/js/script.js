document.addEventListener('DOMContentLoaded', () => {
    // hiển thị và chạy video
    document.querySelectorAll('.product-item').forEach(item => {
        const img = item.querySelector('.product-img');
        const video = item.querySelector('.product-video');
        let timeoutId;

        item.addEventListener('mouseenter', () => {
            if (!img || !video) return;

            img.style.display = 'none';
            video.style.display = 'block';
            video.currentTime = 0;
            video.pause();

            timeoutId = setTimeout(() => {
                video.play().catch((error) => {
                    // Bỏ qua lỗi nếu bị pause hoặc video lỗi
                    console.warn('Video play bị lỗi hoặc bị gián đoạn:', error.message);
                });
            }, 1500);
        });

        item.addEventListener('mouseleave', () => {
            if (!img || !video) return;

            clearTimeout(timeoutId);
            video.pause();
            video.currentTime = 0;
            video.style.display = 'none';
            img.style.display = 'block';
        });
    });


    // =================================================================

    // Lặp qua từng .product-item
    document.querySelectorAll(".product-item").forEach(item => {
        const btn = item.querySelector(".btn-product");
        const tools = item.querySelector(".product-tools");

        // Toggle active khi click vào nút
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn click lan ra document
            // Xoá active ở các tool khác trước
            document.querySelectorAll(".product-tools.active").forEach(t => {
                if (t !== tools) t.classList.remove("active");
            });
            tools.classList.toggle("active");
        });
    });

    // Click bên ngoài .product-tools thì xoá active
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".product-tools.active").forEach(tools => {
            // Nếu click không nằm trong .product-tools hoặc .btn-product
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


    // =======================================================================

    // chọn danh sách để lưu vào
    const playlistItems = document.querySelectorAll('.playlist-item');
    const addBtn = document.querySelector('.add-playlist-btn');

    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            // Bỏ chọn tất cả
            playlistItems.forEach(other => {
                other.querySelector('input[type="checkbox"]').checked = false;
                other.querySelector('.playlist-check').classList.remove('active');
            });

            // Chọn item hiện tại
            item.querySelector('input[type="checkbox"]').checked = true;
            item.querySelector('.playlist-check').classList.add('active');

            // Bật nút "Thêm vào danh sách"
            addBtn.classList.add('active');
            addBtn.setAttribute('type', 'submit');
        });
    });


    const closePlaylistBtn = document.getElementById('closeModalPlaylist');
    const modalPlaylist = document.getElementById('modalPlaylist');
    const productIdList = document.getElementById('productIdList');
    const productIdForm = document.getElementById('productIdForm');
    const addPlaylistBtn = document.querySelector('.add-playlist-btn');
    const createBtn = document.querySelector('.create-playlist-btn');
    const playlistList = document.querySelector('.playlist-list');
    const playlistForm = document.querySelector('.playlist-form');
    const cancelBtn = document.querySelector('.cancel-playlist-btn');
    const playlistNameInput = document.getElementById('playlistName');
    const submitBtn = document.querySelector('.create-playlist-submit');

    // mử và gán id
    document.querySelectorAll('.product-bt').forEach(button => {
        button.addEventListener('click', () => {
            // Tìm phần tử cha .product-item gần nhất
            const productItem = button.closest('.product-item');
            const productIdInput = productItem?.querySelector('#productId');
            const productTools = productItem?.querySelector('.product-tools');
            const value = productIdInput?.value;

            if (value && modalPlaylist && productIdList && productIdForm) {
                modalPlaylist.classList.add('active'); // Mở modal

                // Gán giá trị vào hidden inputs
                productIdList.value = value;
                productIdForm.value = value;
            }

            // Ẩn product-tools nếu đang mở
            if (productTools?.classList.contains('active')) {
                productTools.classList.remove('active');
            }

            document.body.classList.add('hiddenScroll');
        });
    });

    // Mở form tạo danh sách
    createBtn?.addEventListener('click', () => {
        playlistList.style.display = 'none';
        playlistForm.style.display = 'block';
    });

    // Hủy và reset form
    cancelBtn?.addEventListener('click', () => {
        playlistForm.style.display = 'none';
        playlistList.style.display = 'block';

        playlistForm.reset(); // ✅ Reset toàn bộ form
        submitBtn?.classList.remove('active'); // Gỡ class active nếu có
    });

    // Theo dõi input để bật nút tạo
    playlistNameInput?.addEventListener('input', () => {
        const hasValue = playlistNameInput.value.trim() !== '';
        submitBtn?.classList.toggle('active', hasValue);
    });

    // đóng modal
    closePlaylistBtn?.addEventListener('click', () => {
        // 1. Gỡ active khỏi modal
        modalPlaylist?.classList.remove('active');

        // 2. Reset các .playlist-item
        document.querySelectorAll('.playlist-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const checkMark = item.querySelector('.playlist-check');
            checkbox.checked = false;
            checkMark.classList.remove('active');
        });

        // 3. Reset nút Thêm vào
        if (addPlaylistBtn) {
            addPlaylistBtn.classList.remove('active');
            addPlaylistBtn.setAttribute('type', 'button');
        }

        document.body.classList.remove('hiddenScroll');
    });


    // ============================================================================


    // Xử lý khi click nút chia sẻ
    document.querySelectorAll('.product-share').forEach(shareBtn => {
        shareBtn.addEventListener('click', () => {
            const modal = document.getElementById('modalShare');
            const productItem = shareBtn.closest('.product-item');
            const productIdInput = shareBtn.closest('.product-item')?.querySelector('#productId'); // tìm productId gần nhất
            const productId = productIdInput?.value;

            if (productId) {
                document.getElementById('productIdShare').value = productId;
                modal.classList.add('active');

                // Đóng .product-tools tương ứng nếu có
                const productTools = productItem.querySelector('.product-tools');
                if (productTools) {
                    productTools.classList.remove('active');
                }

                document.body.classList.add('hiddenScroll');
            }
        });
    });

    // Đóng modal khi click vào nút đóng
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
});