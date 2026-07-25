document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle) toggle.addEventListener("click", () => links.classList.toggle("open"));
  document.querySelectorAll(".nav-link, .btn-cta").forEach(a => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });

  let works = [];
  async function loadWorks() {
    try {
      const res = await fetch("works.json");
      if (!res.ok) throw new Error();
      works = await res.json();
    } catch {
      works = [
        { id:1, title:"Morning Light", type:"image", src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80", description:"Soft morning light filtering through early mist.", date:"2026-03-12" },
        { id:2, title:"Gentle Blooms", type:"image", src:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80", description:"Soft floral tones in a refined pastel palette.", date:"2026-01-20" },
        { id:3, title:"Minimal Space", type:"image", src:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80", description:"Minimalist interior with natural light.", date:"2025-12-05" }
      ];
    }
    renderGallery(works);
  }

  const grid = document.getElementById("galleryGrid");
  function renderGallery(list) {
    grid.innerHTML = "";
    if (!list.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#9b9890;padding:2rem">No artworks available</p>';
      return;
    }
    list.forEach(item => {
      const card = document.createElement("article");
      card.className = "gallery-item";
      const media = item.type === "video"
        ? `<video src="${item.src}" muted loop playsinline preload="metadata"></video><span class="item-badge">VIDEO</span>`
        : `<img src="${item.src}" alt="${item.title}" loading="lazy" />`;
      card.innerHTML = `${media}<div class="item-overlay"><h3 class="item-title">${item.title}</h3><span class="item-type">${item.type==="video"?"Video":"Image"}</span></div>`;
      card.addEventListener("click", () => openModal(item));
      grid.appendChild(card);
    });
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      renderGallery(f === "all" ? works : works.filter(w => w.type === f));
    });
  });

  const modal = document.getElementById("detailModal");
  const modalMedia = document.getElementById("modalMedia");
  let currentItem = null;

  function openModal(item) {
    currentItem = item;
    document.getElementById("modalTitle").textContent = item.title;
    document.getElementById("modalType").textContent = item.type === "video" ? "Video" : "Image";
    document.getElementById("modalDesc").textContent = item.description || "";
    document.getElementById("modalDate").textContent = item.date
      ? "Date: " + new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "";
    modalMedia.innerHTML = "";
    if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.src; v.controls = true; v.autoplay = true; v.playsInline = true;
      modalMedia.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = item.src; img.alt = item.title;
      modalMedia.appendChild(img);
    }
    const dl = document.getElementById("btnDownload");
    if (dl) {
      dl.href = item.src;
      dl.setAttribute("download", (item.title || "artwork").replace(/\s+/g, "_"));
      dl.style.display = item.type === "image" ? "inline-flex" : "none";
    }
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  const btnCopy = document.getElementById("btnCopyLink");
  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      if (!currentItem) return;
      const link = currentItem.src;
      try {
        await navigator.clipboard.writeText(link);
        btnCopy.textContent = "Copied!";
        setTimeout(() => { btnCopy.textContent = "Copy Link"; }, 1800);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = link;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        btnCopy.textContent = "Copied!";
        setTimeout(() => { btnCopy.textContent = "Copy Link"; }, 1800);
      }
    });
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    const v = modalMedia.querySelector("video");
    if (v) { v.pause(); v.src = ""; }
  }
  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.querySelector(".modal-overlay").addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  loadWorks();
});
