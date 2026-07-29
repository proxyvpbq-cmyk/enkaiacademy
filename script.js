// Dữ liệu mặc định ban đầu
const initialArtworks = [
    {
        id: "art-1",
        title: "Tác Phẩm Nghệ Thuật 01",
        type: "image",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000",
        date: "2026-03-25",
        desc: "Đây là câu chuyện và cảm hứng tạo nên tác phẩm nghệ thuật đầu tiên thuộc sở hữu của Enkai Art Agency dưới sự thực hiện của Trần Quang Trung."
    },
    {
        id: "art-2",
        title: "Thử Nghiệm Chuyển Động Video",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32822-large.mp4",
        date: "2026-03-28",
        desc: "Video mô phỏng ánh sáng nghệ thuật với tone màu xanh mượt mà."
    }
];

// Khởi tạo LocalStorage nếu chưa có
if (!localStorage.getItem('enkai_artworks')) {
    localStorage.setItem('enkai_artworks', JSON.stringify(initialArtworks));
}

function getArtworks() {
    return JSON.parse(localStorage.getItem('enkai_artworks')) || [];
}

function saveArtworks(data) {
    localStorage.setItem('enkai_artworks', JSON.stringify(data));
}

// -------------------------------------------------------------
// LOGIC CHO TRANG CHỦ (INDEX.HTML)
// -------------------------------------------------------------
if (document.getElementById('main-content')) {
    const mainContent = document.getElementById('main-content');

    function renderPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const artId = urlParams.get('id');

        if (artId) {
            // Hiển thị TRANG CHI TIẾT RIÊNG BIỆT của tác phẩm
            renderSinglePage(artId);
            document.querySelector('.hero').style.display = 'none';
            document.querySelector('.filter-bar').style.display = 'none';
        } else {
            // Hiển thị DANH SÁCH TÁC PHẨM
            document.querySelector('.hero').style.display = 'block';
            document.querySelector('.filter-bar').style.display = 'flex';
            renderGallery('all');
        }
    }

    function renderGallery(filter = 'all') {
        const list = getArtworks();
        const filtered = list.filter(item => filter === 'all' || item.type === filter);

        let html = '<div class="gallery-grid">';
        filtered.forEach(item => {
            const mediaTag = item.type === 'image' 
                ? `<img src="${item.url}" class="art-thumb" alt="${item.title}">`
                : `<video src="${item.url}" class="art-thumb" muted></video>`;

            html += `
                <a href="index.html?id=${item.id}" class="art-card">
                    ${mediaTag}
                    <div class="art-card-info">
                        <div class="art-card-title">${item.title}</div>
                        <div class="art-card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${item.date}</span>
                            <span>${item.type === 'image' ? '📸 Ảnh' : '🎥 Video'}</span>
                        </div>
                    </div>
                </a>
            `;
        });
        html += '</div>';
        mainContent.innerHTML = html;
    }

    function renderSinglePage(id) {
        const list = getArtworks();
        const item = list.find(a => a.id === id);

        if (!item) {
            mainContent.innerHTML = '<h2>Không tìm thấy tác phẩm này!</h2><a href="index.html" class="btn-back">← Quay lại trang chủ</a>';
            return;
        }

        const mediaTag = item.type === 'image'
            ? `<img src="${item.url}" alt="${item.title}">`
            : `<video src="${item.url}" controls autoplay></video>`;

        mainContent.innerHTML = `
            <div class="single-page">
                <a href="index.html" class="btn-back"><i class="fa-solid fa-arrow-left"></i> Quay lại thư viện tác phẩm</a>
                <div class="single-media">${mediaTag}</div>
                <div class="single-info">
                    <h2>${item.title}</h2>
                    <div class="single-meta">
                        <span><i class="fa-solid fa-user-nib"></i> Tác giả: <strong>Trần Quang Trung</strong></span>
                        <span><i class="fa-regular fa-calendar-check"></i> Ngày đăng: <strong>${item.date}</strong></span>
                        <span><i class="fa-solid fa-layer-group"></i> Định dạng: <strong>${item.type === 'image' ? 'Hình ảnh' : 'Video'}</strong></span>
                    </div>
                    <div class="single-content">${item.desc || 'Chưa có mô tả thêm cho tác phẩm này.'}</div>
                </div>
            </div>
        `;
    }

    // Xử lý nút Lọc (Filter)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderGallery(e.target.dataset.filter);
        });
    });

    renderPage();
}

// -------------------------------------------------------------
// LOGIC CHO TRANG ADMIN (ADMIN.HTML)
// -------------------------------------------------------------
if (document.getElementById('login-section')) {
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const artworkForm = document.getElementById('artwork-form');
    const adminList = document.getElementById('admin-artwork-list');

    // Kiểm tra trạng thái Đăng nhập
    if (sessionStorage.getItem('enkai_admin_logged') === 'true') {
        showDashboard();
    }

    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const pass = document.getElementById('admin-password').value;
        if (pass === 'admin123') {
            sessionStorage.setItem('enkai_admin_logged', 'true');
            showDashboard();
        } else {
            alert('Mật khẩu Admin không chính xác!');
        }
    };

    document.getElementById('logout-btn').onclick = () => {
        sessionStorage.removeItem('enkai_admin_logged');
        location.reload();
    };

    function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        renderAdminList();
    }

    function renderAdminList() {
        const list = getArtworks();
        adminList.innerHTML = '';

        list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.innerHTML = `
                <div class="admin-item-info">
                    <img src="${item.url}" class="admin-item-thumb" onerror="this.src='https://via.placeholder.com/50'">
                    <div>
                        <strong>${item.title}</strong><br>
                        <small>${item.date} | ${item.type}</small>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button onclick="editArtwork('${item.id}')" class="btn-action-edit"><i class="fa-solid fa-pen"></i> Sửa</button>
                    <button onclick="deleteArtwork('${item.id}')" class="btn-action-delete"><i class="fa-solid fa-trash"></i> Xóa</button>
                </div>
            `;
            adminList.appendChild(div);
        });
    }

    // Xử lý Đăng / Sửa tác phẩm
    artworkForm.onsubmit = (e) => {
        e.preventDefault();
        const editId = document.getElementById('edit-id').value;
        const list = getArtworks();

        const dataObj = {
            id: editId || 'art-' + Date.now(),
            title: document.getElementById('art-title').value,
            type: document.getElementById('art-type').value,
            date: document.getElementById('art-date').value,
            url: document.getElementById('art-url').value,
            desc: document.getElementById('art-desc').value
        };

        if (editId) {
            const index = list.findIndex(a => a.id === editId);
            if (index !== -1) list[index] = dataObj;
        } else {
            list.unshift(dataObj);
        }

        saveArtworks(list);
        resetForm();
        renderAdminList();
        alert('Đã lưu thông tin tác phẩm thành công!');
    };

    window.editArtwork = (id) => {
        const list = getArtworks();
        const item = list.find(a => a.id === id);
        if (!item) return;

        document.getElementById('edit-id').value = item.id;
        document.getElementById('art-title').value = item.title;
        document.getElementById('art-type').value = item.type;
        document.getElementById('art-date').value = item.date;
        document.getElementById('art-url').value = item.url;
        document.getElementById('art-desc').value = item.desc;

        document.getElementById('form-title').innerText = "Chỉnh Sửa Tác Phẩm";
        document.getElementById('btn-save').innerText = "Cập Nhật Tác Phẩm";
        document.getElementById('btn-cancel').classList.remove('hidden');
    };

    window.deleteArtwork = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa tác phẩm này không?')) {
            let list = getArtworks();
            list = list.filter(a => a.id !== id);
            saveArtworks(list);
            renderAdminList();
        }
    };

    document.getElementById('btn-cancel').onclick = resetForm;

    function resetForm() {
        document.getElementById('edit-id').value = '';
        artworkForm.reset();
        document.getElementById('form-title').innerText = "Thêm Tác Phẩm Mới";
        document.getElementById('btn-save').innerText = "Đăng Tác Phẩm";
        document.getElementById('btn-cancel').classList.add('hidden');
    }
}