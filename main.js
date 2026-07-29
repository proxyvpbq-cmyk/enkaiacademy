document.addEventListener('DOMContentLoaded', () => {
    let worksData = [];
    let currentWorkIndex = 0;

    const galleryGrid = document.getElementById('galleryGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const totalWorksCount = document.getElementById('totalWorksCount');

    // Detail Modal Elements
    const detailOverlay = document.getElementById('detailOverlay');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const detailImg = document.getElementById('detailImg');
    const detailTitle = document.getElementById('detailTitle');
    const detailCategory = document.getElementById('detailCategory');
    const detailDate = document.getElementById('detailDate');
    const detailAuthor = document.getElementById('detailAuthor');
    const detailDesc = document.getElementById('detailDesc');
    const downloadHdBtn = document.getElementById('downloadHdBtn');
    const prevWorkBtn = document.getElementById('prevWorkBtn');
    const nextWorkBtn = document.getElementById('nextWorkBtn');

    fetch('works.json')
        .then(res => res.json())
        .then(data => {
            worksData = data;
            if (totalWorksCount) totalWorksCount.textContent = worksData.length;
            renderGallery(worksData);
        });

    function renderGallery(items) {
        galleryGrid.innerHTML = '';

        if (items.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        items.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'work-card';

            card.innerHTML = `
                <div class="card-image-wrap">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-content">
                    <span class="card-tag">${item.categoryName || item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <span class="card-author">${item.author || 'T Tran Quang Trung'}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                openDetailModal(item.id);
            });

            galleryGrid.appendChild(card);
        });
    }

    function openDetailModal(id) {
        const index = worksData.findIndex(w => w.id === id);
        if (index === -1) return;

        currentWorkIndex = index;
        const work = worksData[currentWorkIndex];

        detailImg.src = work.image;
        detailTitle.textContent = work.title;
        detailCategory.textContent = work.categoryName || work.category;
        detailDate.textContent = work.date || '2026';
        detailAuthor.textContent = work.author || 'Tran Quang Trung';
        detailDesc.textContent = work.description || 'Digital artwork by Tran Quang Trung.';
        downloadHdBtn.href = work.image;

        detailOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeDetailBtn.addEventListener('click', () => {
        detailOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    prevWorkBtn.addEventListener('click', () => {
        currentWorkIndex = (currentWorkIndex - 1 + worksData.length) % worksData.length;
        openDetailModal(worksData[currentWorkIndex].id);
    });

    nextWorkBtn.addEventListener('click', () => {
        currentWorkIndex = (currentWorkIndex + 1) % worksData.length;
        openDetailModal(worksData[currentWorkIndex].id);
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const filtered = filter === 'all' ? worksData : worksData.filter(item => item.category === filter);
            renderGallery(filtered);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase().trim();
            const filtered = worksData.filter(item => item.title.toLowerCase().includes(q));
            renderGallery(filtered);
        });
    }
});
