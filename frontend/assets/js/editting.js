document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitPublish');
    const cancelBtn = document.getElementById('cancelEditing');
    const imgFileBanner = document.getElementById('imgFileBanner');
    const imgFileAvatar = document.getElementById('imgFileAvatar');
    const imgBanner = document.getElementById('imgBanner');
    const imgAvatar = document.getElementById('imgAvatar');
    const channelTitle = document.getElementById('channelTitle');
    const channelName = document.getElementById('channelName');
    const channelDes = document.getElementById('channelDes');

    // Lưu giá trị ban đầu
    const initialValues = {
        bannerSrc: imgBanner.src,
        avatarSrc: imgAvatar.src,
        title: channelTitle.value,
        name: channelName.value,
        des: channelDes.value
    };

    function checkChanges() {
        const hasChanges = (
            imgBanner.src !== initialValues.bannerSrc ||
            imgAvatar.src !== initialValues.avatarSrc ||
            channelTitle.value !== initialValues.title ||
            channelName.value !== initialValues.name ||
            channelDes.value !== initialValues.des
        );

        if (hasChanges) {
            submitBtn.classList.add('active');
            cancelBtn.classList.add('active');
            submitBtn.setAttribute('type', 'submit');
        } else {
            submitBtn.classList.remove('active');
            cancelBtn.classList.remove('active');
            submitBtn.setAttribute('type', 'button');
        }
    }

    // Gán ảnh và kiểm tra thay đổi
    imgFileBanner.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imgBanner.src = event.target.result;
                checkChanges();
            };
            reader.readAsDataURL(file);
        }
    });

    imgFileAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imgAvatar.src = event.target.result;
                checkChanges();
            };
            reader.readAsDataURL(file);
        }
    });

    [channelTitle, channelName, channelDes].forEach(input => {
        input.addEventListener('input', checkChanges);
    });

    // Reset khi nhấn Huỷ
    cancelBtn.addEventListener('click', () => {
        imgBanner.src = initialValues.bannerSrc;
        imgAvatar.src = initialValues.avatarSrc;
        channelTitle.value = initialValues.title;
        channelName.value = initialValues.name;
        channelDes.value = initialValues.des;

        submitBtn.classList.remove('active');
        cancelBtn.classList.remove('active');
        submitBtn.setAttribute('type', 'button');
    });
});
