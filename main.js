// Main Interactive Script for Dark Navy Portfolio
document.addEventListener('DOMContentLoaded', () => {
    let worksData = [];
    let currentWorkIndex = 0;
    let currentFilter = 'all';

    // DOM Elements
    const galleryGrid = document.getElementById('galleryGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const totalWorksCount = document.getElementById('totalWorksCount');
    
    // View Switcher
    const grid3ColBtn = document.getElementById('grid3Col');
    const grid4ColBtn = document.getElementById('grid4Col');

    // Detail Modal Elements
    const detailOverlay = document.getElementById('detailOverlay');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const detailImg = document.getElementById('detailImg');
    const detailTitle = document.getElementById('detailTitle');
    const detailCategory = document.getElementById('detailCategory');
    const detailDate = document.getElementById('detailDate');
    const detailViews = document.getElementById('detailViews');
    const detailClient = document.getElementById('detailClient');
    const detailDesc = document.getElementById('detailDesc');
    const specResolution = document.getElementById('specResolution');
    const specTools = document.getElementById('specTools');
    const detailTags = document.getElementById('detailTags');
    const downloadHdBtn = document.getElementById('downloadHdBtn');
    const prevWorkBtn = document.getElementById('prevWorkBtn');
    const nextWorkBtn = document.getElementById('nextWorkBtn');
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    const fullScreenBtn = document.getElementById('fullScreenBtn');

    // 1. Fetch Works JSON Data
    fetch('works.json')
        .then(response => response.json())
        .then(data => {
            worksData = data;
            if(totalWorksCount) totalWorksCount.textContent = worksData.length;
            renderGallery(worksData);
            checkUrlHash();
        })
        .catch(err => {
            console.error('Lỗi khi tải dữ liệu works.json:', err);
        });

    // 2. Render Gallery Cards
    function renderGallery(items) {
        galleryGrid.innerHTML = '';

        if (items.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'work-card';
            card.setAttribute('data-id', item.id);

            card.innerHTML = `
                <div class="card-image-wrap">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="card-hover-overlay">
                        <div class="card-top-actions">
                            <span class="card-badge">${item.categoryName || item.category}</span>
                            <div class="card-view-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
                        </div>
                        <div class="card-bottom-info">
                            <h3 class="card-title">${item.title}</h3>
                            <div class="card-meta">
                                <span><i class="fa-regular fa-calendar"></i> ${item.date}</span>
                                <span><i class="fa-regular fa-heart"></i> ${item.likes || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <span class="card-body-title">${item.title}</span>
                    <span class="card-body-cat">${item.categoryName || item.category}</span>
                </div>
            `;

            // Click Handler -> Open Detail Page/Modal
            card.addEventListener('click', () => {
                openDetailModal(item.id);
            });

            galleryGrid.appendChild(card);
        });
    }

    // 3. Open Detail Modal / Detail Page
    function openDetailModal(workId) {
        const index = worksData.findIndex(w => w.id === workId);
        if (index === -1) return;

        currentWorkIndex = index;
        const work = worksData[currentWorkIndex];

        // Populate details
        detailImg.src = work.image;
        detailTitle.textContent = work.title;
        detailCategory.textContent = work.categoryName || work.category;
        detailDate.textContent = work.date;
        detailViews.textContent = work.views || '1.5k';
        detailClient.textContent = work.client || 'Aura Client';
        detailDesc.textContent = work.description || 'Tác phẩm sáng tạo độc đáo với độ chi tiết cao và phong cách hiện đại.';
        specResolution.textContent = work.resolution || '3840 x 2160 (4K)';
        specTools.textContent = work.tools ? work.tools.join(', ') : 'Photoshop, Blender';
        likeCount.textContent = work.likes || 0;
        downloadHdBtn.href = work.image;

        // Render tags
        detailTags.innerHTML = '';
        if (work.tags && work.tags.length > 0) {
            work.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag-pill';
                tagEl.textContent = '#' + tag;
                detailTags.appendChild(tagEl);
            });
        }

        // Show Modal Overlay
        detailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update URL hash for deep linking
        window.location.hash = `work-${work.id}`;
    }

    function closeDetailModal() {
        detailOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    // 4. Navigation inside detail view (Prev / Next)
    prevWorkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (worksData.length === 0) return;
        currentWorkIndex = (currentWorkIndex - 1 + worksData.length) % worksData.length;
        openDetailModal(worksData[currentWorkIndex].id);
    });

    nextWorkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (worksData.length === 0) return;
        currentWorkIndex = (currentWorkIndex + 1) % worksData.length;
        openDetailModal(worksData[currentWorkIndex].id);
    });

    closeDetailBtn.addEventListener('click', closeDetailModal);

    // Close on overlay click outside container
    detailOverlay.addEventListener('click', (e) => {
        if (e.target === detailOverlay) {
            closeDetailModal();
        }
    });

    // Keydown ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailOverlay.classList.contains('active')) {
            closeDetailModal();
        }
    });

    // 5. Like Toggle
    let isLiked = false;
    likeBtn.addEventListener('click', () => {
        let count = parseInt(likeCount.textContent) || 0;
        if (!isLiked) {
            count++;
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').className = 'fa-solid fa-heart';
            isLiked = true;
        } else {
            count--;
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('i').className = 'fa-regular fa-heart';
            isLiked = false;
        }
        likeCount.textContent = count;
        if (worksData[currentWorkIndex]) {
            worksData[currentWorkIndex].likes = count;
        }
    });

    // Fullscreen Image Preview
    fullScreenBtn.addEventListener('click', () => {
        if (detailImg.requestFullscreen) {
            detailImg.requestFullscreen();
        } else if (detailImg.webkitRequestFullscreen) {
            detailImg.webkitRequestFullscreen();
        }
    });

    // 6. Category Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Search Filtering
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        const filtered = worksData.filter(item => {
            const matchesCategory = (currentFilter === 'all') || (item.category === currentFilter);
            const matchesSearch = item.title.toLowerCase().includes(query) ||
                                  (item.tags && item.tags.some(t => t.toLowerCase().includes(query))) ||
                                  (item.description && item.description.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });

        renderGallery(filtered);
    }

    // 7. Grid Columns Toggle
    if (grid3ColBtn && grid4ColBtn) {
        grid3ColBtn.addEventListener('click', () => {
            grid3ColBtn.classList.add('active');
            grid4ColBtn.classList.remove('active');
            galleryGrid.classList.remove('grid-4');
        });

        grid4ColBtn.addEventListener('click', () => {
            grid4ColBtn.classList.add('active');
            grid3ColBtn.classList.remove('active');
            galleryGrid.classList.add('grid-4');
        });
    }

    // Check URL Hash for direct image link
    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#work-')) {
            const id = hash.replace('#work-', '');
            openDetailModal(id);
        }
    }
});
