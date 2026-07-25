/**
 * Enkai Art Agency — Soft Elegant Theme
 * Gallery + Detail Modal
 */

document.addEventListener("DOMContentLoaded", () => {
  // Nav scroll effect
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });

  // Mobile menu
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");
  if (toggle) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });

  // Load works
  let works = [];

  async function loadWorks() {
    try {
      const res = await fetch("data/works.json");
      if (!res.ok) throw new Error("Không tải được danh sách");
      works = await res.json();
      renderGallery(works);
    } catch (err) {
      console.warn(err);
      works = getFallbackWorks();
      renderGallery(works);
    }
  }

  function getFallbackWorks() {
    return [
      {
        id: 1,
        title: "Ánh sáng ban mai",
        type: "image",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
        description: "Khoảnh khắc ánh sáng nhẹ nhàng len qua lớp sương sớm.",
        date: "2026-03-12",
      },
      {
        id: 2,
        title: "Hoa dịu dàng",
        type: "image",
        src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80",
        description: "Sắc hoa mềm mại, tông màu pastel.",
        date: "2026-01-20",
      },
      {
        id: 3,
        title: "Không gian tối giản",
        type: "image",
        src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
        description: "Góc nhìn nội thất tối giản với ánh sáng tự nhiên.",
        date: "2025-12-05",
      },
    ];
  }

  const grid = document.getElementById("galleryGrid");

  function renderGallery(list) {
    grid.innerHTML = "";
    if (!list.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <p style="font-size:1.15rem">Chưa có tác phẩm nào</p>
          <p>Hãy thêm ảnh/video vào data/works.json</p>
        </div>`;
      return;
    }

    list.forEach((item) => {
      const card = document.createElement("article");
      card.className = "gallery-item";
      card.dataset.type = item.type;

      const media =
        item.type === "video"
          ? `<video src="${item.src}" muted loop playsinline preload="metadata"></video>
             <span class="item-badge">VIDEO</span>`
          : `<img src="${item.src}" alt="${item.title}" loading="lazy" />`;

      card.innerHTML = `
        ${media}
        <div class="item-overlay">
          <h3 class="item-title">${item.title}</h3>
          <span class="item-type">${item.type === "video" ? "Video" : "Ảnh"}</span>
        </div>
      `;

      card.addEventListener("click", () => openModal(item));
      grid.appendChild(card);
    });
  }

  // Filter
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      const filtered = filter === "all" ? works : works.filter((w) => w.type === filter);
      renderGallery(filtered);
    });
  });

  // Modal
  const modal = document.getElementById("detailModal");
  const modalMedia = document.getElementById("modalMedia");
  const modalTitle = document.getElementById("modalTitle");
  const modalType = document.getElementById("modalType");
  const modalDesc = document.getElementById("modalDesc");
  const modalDate = document.getElementById("modalDate");

  function openModal(item) {
    modalTitle.textContent = item.title;
    modalType.textContent = item.type === "video" ? "Video" : "Ảnh";
    modalDesc.textContent = item.description || "";
    modalDate.textContent = item.date ? `Ngày: ${formatDate(item.date)}` : "";

    modalMedia.innerHTML = "";
    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      modalMedia.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.title;
      modalMedia.appendChild(img);
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const v = modalMedia.querySelector("video");
    if (v) {
      v.pause();
      v.src = "";
    }
  }

  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.querySelector(".modal-overlay").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  function formatDate(str) {
    if (!str) return "";
    const d = new Date(str);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  loadWorks();
});
