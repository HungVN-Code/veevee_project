document.addEventListener('DOMContentLoaded', () => {
    const postMoreBtn = document.querySelector('.post-more');
    const closeModalDesBtn = document.getElementById('closeModalDes');
    const modalDes = document.getElementById('modalDes');

    const productIdDes = document.getElementById('productIdDes');
    const desTitle = document.getElementById('desTitle');
    const desContent = document.getElementById('desContent');

    postMoreBtn?.addEventListener('click', () => {
        const postId = document.querySelector('#postId')?.value;
        const postTitle = document.querySelector('#postTitle')?.textContent || 'Tiêu đề';
        const desText = document.querySelector('#desText')?.textContent || '';

        // Gán dữ liệu vào modal
        productIdDes.value = postId || '';
        desTitle.textContent = postTitle;
        desContent.textContent = desText;

        // Mở modal
        modalDes?.classList.add('active');
        document.body.classList.add('hiddenScroll');
    });

    closeModalDesBtn?.addEventListener('click', () => {
        modalDes?.classList.remove('active');
        document.body.classList.remove('hiddenScroll');
    });


    // ==================================================================================

    const productList = document.querySelector('.product-list');
    const allProducts = Array.from(document.querySelectorAll('.product-item'));
    const paginationSelect = document.querySelectorAll('.pagination-option');
    const paginationList = document.querySelector('.pagination-list');
    const displayNumber = document.getElementById('displayNumber');
    const paginationContainer = document.querySelector('.pagination');

    let currentPage = 1;
    let itemsPerPage = parseInt(displayNumber.textContent);

    // Hiển thị sản phẩm theo trang
    function renderProducts() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        allProducts.forEach((product, index) => {
            product.style.display = (index >= start && index < end) ? 'block' : 'none';
        });

        // Ẩn phân trang nếu tổng số sản phẩm < itemsPerPage
        if (allProducts.length <= itemsPerPage) {
            paginationContainer.style.display = 'none';
        } else {
            paginationContainer.style.display = 'block';
            renderPagination();
        }
    }

    // Tạo phân trang với logic ngắn gọn và tránh hiển thị dấu ... dư
    function renderPagination() {
        const totalPages = Math.ceil(allProducts.length / itemsPerPage);
        paginationList.innerHTML = '';

        // Trang đầu
        if (currentPage > 1) {
            const first = document.createElement('div');
            first.className = 'pagination-item';
            first.id = 'paginationHeader';
            first.textContent = 'Trang đầu';
            first.addEventListener('click', () => {
                currentPage = 1;
                renderProducts();
            });
            paginationList.appendChild(first);
        }

        // Prev button
        if (currentPage > 1) {
            const prev = document.createElement('div');
            prev.className = 'pagination-item';
            prev.id = 'prev';
            prev.innerHTML = '<i class="ti ti-chevrons-left"></i>';
            prev.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderProducts();
                }
            });
            paginationList.appendChild(prev);
        }

        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        pages.forEach(p => {
            const item = document.createElement('div');
            item.className = 'pagination-item';
            item.textContent = p;

            if (p === '...') {
                item.classList.add('intermediate');
            } else {
                if (p === currentPage) item.classList.add('active');
                item.addEventListener('click', () => {
                    currentPage = p;
                    renderProducts();
                });
            }

            paginationList.appendChild(item);
        });

        // Next button
        if (currentPage < totalPages) {
            const next = document.createElement('div');
            next.className = 'pagination-item';
            next.id = 'next';
            next.innerHTML = '<i class="ti ti-chevrons-right"></i>';
            next.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderProducts();
                }
            });
            paginationList.appendChild(next);
        }

        // Trang cuối
        if (currentPage < totalPages) {
            const last = document.createElement('div');
            last.className = 'pagination-item';
            last.id = 'paginationFooter';
            last.textContent = 'Trang cuối';
            last.addEventListener('click', () => {
                currentPage = totalPages;
                renderProducts();
            });
            paginationList.appendChild(last);
        }
    }

    // Chọn số lượng mỗi trang
    paginationSelect.forEach(option => {
        option.addEventListener('click', () => {
            paginationSelect.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            itemsPerPage = parseInt(option.textContent);
            displayNumber.textContent = itemsPerPage;

            currentPage = 1;
            renderProducts();
        });
    });

    // Khởi tạo
    renderProducts();
});