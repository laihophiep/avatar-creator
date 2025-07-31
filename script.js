document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('upload-btn');
    const zoomSlider = document.getElementById('zoom-slider');
    const downloadBtn = document.getElementById('download-btn');
    const container = document.getElementById('canvas-container');

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Khởi tạo Konva Stage ---
    const stage = new Konva.Stage({
        container: 'canvas-container',
        width: width,
        height: height,
    });

    const userImageLayer = new Konva.Layer();
    const frameLayer = new Konva.Layer();
    stage.add(userImageLayer, frameLayer);

    let userImage = null;

    // --- Xử lý tải ảnh người dùng lên ---
    uploadBtn.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            Konva.Image.fromURL(reader.result, (img) => {
                userImageLayer.destroyChildren(); // Xóa ảnh cũ nếu có
                
                userImage = img;
                userImage.setAttrs({
                    x: width / 2,
                    y: height / 2,
                    draggable: true,
                });

                // Căn giữa và điều chỉnh kích thước ban đầu
                const aspectRatio = userImage.width() / userImage.height();
                let newWidth, newHeight;
                if (aspectRatio > 1) { // Ảnh ngang
                    newHeight = height;
                    newWidth = height * aspectRatio;
                } else { // Ảnh dọc hoặc vuông
                    newWidth = width;
                    newHeight = width / aspectRatio;
                }
                userImage.width(newWidth);
                userImage.height(newHeight);
                userImage.offsetX(userImage.width() / 2);
                userImage.offsetY(userImage.height() / 2);

                userImageLayer.add(userImage);
                zoomSlider.disabled = false;
                downloadBtn.disabled = false;
            });
        };
        reader.readAsDataURL(file);
    });

    // --- Xử lý thanh trượt phóng to/thu nhỏ ---
    zoomSlider.addEventListener('input', (e) => {
        if (!userImage) return;
        const scale = parseFloat(e.target.value);
        userImage.scale({ x: scale, y: scale });
    });

    // --- Tải và hiển thị ảnh khung ---
    Konva.Image.fromURL('./images/frame.png', (frameImg) => {
        frameImg.setAttrs({
            width: width,
            height: height,
            listening: false, // Để khung không bắt sự kiện chuột
        });
        frameLayer.add(frameImg);
    });

    // --- Xử lý tải ảnh đã ghép về ---
    downloadBtn.addEventListener('click', () => {
        const dataURL = stage.toDataURL({
            pixelRatio: 3, // Tăng chất lượng ảnh xuất ra
            mimeType: 'image/png',
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'avatar-facebook.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});