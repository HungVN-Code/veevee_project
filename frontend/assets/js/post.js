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
});