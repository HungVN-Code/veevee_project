document.addEventListener('DOMContentLoaded', () => {
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
                video.play();
            }, 1000);
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
});