document.addEventListener('DOMContentLoaded', () => {
    // Lặp qua từng .broadcast-item
    document.querySelectorAll(".broadcast-item").forEach(item => {
        const btn = item.querySelector(".btn-broadcast");
        const tools = item.querySelector(".broadcast-tools");

        // Toggle active khi click vào nút
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn click lan ra document
            // Xoá active ở các tool khác trước
            document.querySelectorAll(".broadcast-tools.active").forEach(t => {
                if (t !== tools) t.classList.remove("active");
            });
            tools.classList.toggle("active");
        });
    });

    // Click bên ngoài .broadcast-tools thì xoá active
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".broadcast-tools.active").forEach(tools => {
            // Nếu click không nằm trong .broadcast-tools hoặc .btn-broadcast
            if (!tools.contains(e.target) && !tools.previousElementSibling?.contains(e.target)) {
                tools.classList.remove("active");
            }
        });
    });

    // Cuộn trang thì xoá tất cả .active
    window.addEventListener("scroll", () => {
        document.querySelectorAll(".broadcast-tools.active").forEach(tools => {
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


    // ============================================================================


    // Xử lý khi click nút chia sẻ
    const shareBtn = document.querySelector('.broadcast-share');

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const modal = document.getElementById('modalShare');
            const broadcastItem = shareBtn.closest('.broadcast-item');
            const broadcastIdInput = shareBtn.querySelector('#broadcastListId');
            const broadcastId = broadcastIdInput?.value;

            if (broadcastId) {
                document.getElementById('productIdShare').value = broadcastId;
                modal.classList.add('active');

                // Đóng .broadcast-tools nếu có
                const broadcastTools = broadcastItem?.querySelector('.broadcast-tools');
                if (broadcastTools) {
                    broadcastTools.classList.remove('active');
                }

                document.body.classList.add('hiddenScroll');
            }
        });
    }

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


    // ==========================================================================

    // Lấy tất cả các report-item
    const reportItems = document.querySelectorAll('.report-item');
    const submitBtnReport = document.getElementById('submitBtnReport');
    const cancelBtnReport = document.getElementById('cancelBtnReport');
    const modalReport = document.getElementById('modalReport');
    const productIdReport = document.getElementById('productIdReport');

    reportItems.forEach(item => {
        item.addEventListener('click', () => {
            // Bỏ chọn tất cả các radio khác
            reportItems.forEach(i => {
                const radio = i.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
                i.classList.remove('selected');
            });

            // Chọn radio hiện tại
            const currentRadio = item.querySelector('input[type="radio"]');
            if (currentRadio) currentRadio.checked = true;

            // Thêm .active và đổi type nếu có radio được chọn
            if (currentRadio?.checked) {
                submitBtnReport.classList.add('active');
                submitBtnReport.setAttribute('type', 'submit');
                item.classList.add('selected');
            }
        });
    });

    // Huỷ: reset modal
    cancelBtnReport?.addEventListener('click', () => {
        // Xoá active modal
        modalReport?.classList.remove('active');

        // Reset chọn radio
        reportItems.forEach(item => {
            const radio = item.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
            item.classList.remove('selected');
        });

        // Reset nút submit
        submitBtnReport.classList.remove('active');
        submitBtnReport.setAttribute('type', 'button');

        document.body.classList.remove('hiddenScroll');
    });

    // Mở modal báo cáo khi click .product-report
    document.querySelectorAll('.product-report').forEach(reportBtn => {
        reportBtn.addEventListener('click', () => {
            const productItem = reportBtn.closest('.broadcast-item');
            const productIdInput = productItem?.querySelector('#broadcastId');
            const productId = productIdInput?.value;

            if (productId) {
                productIdReport.value = productId;
                modalReport?.classList.add('active');

                // Xoá .active trong .product-tools tương ứng nếu có
                const productTools = productItem.querySelector('.broadcast-tools');
                if (productTools) {
                    productTools.classList.remove('active');
                }
            }

            document.body.classList.add('hiddenScroll');
        });
    });
});