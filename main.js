document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle) toggle.addEventListener("click", () => links.classList.toggle("open"));
  document.querySelectorAll(".nav-link, .btn-cta").forEach(a => {
    a.addEventListener("click", () => links && links.classList.remove("open"));
  });

  let works = [];

  function randomSlug() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return "post-" + s;
  }

  async function loadWorks() {
    try {
      const res = await fetch("works.json");
      if (!res.ok) throw new Error();
      works = await res.json();
    } catch {
      works = [
        {
          id: 1,
          slug: "post-k7m2x9qa",
          title: "Morning Light",
          type: "image",
          category: "PHOTOGRAPHY",
          src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
          description: "Soft morning light filtering through early mist.",
          date: "2026-03-12",
          tags: ["Landscape", "Light", "Nature"]
        }
      ];
    }
    // Ensure every work has a slug
    works.forEach(w => {
      if (!w.slug) {
        const prefix = w.type === "video" ? "vid-" : "post-";
        w.slug = prefix + randomSlug().replace(/^post-/, "");
      }
    });
    renderGallery(works);
    openFromUrl();
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
      const badge = item.type === "video" ? "Video" : "Image";
      const cat = item.category || (item.type === "video" ? "VIDEO" : "ART");
      const media =
        item.type === "video"
          ? `<video src="${item.src}" muted loop playsinline preload="metadata"></video>`
          : `<img src="${item.src}" alt="${item.title}" loading="lazy" />`;
      card.innerHTML = `
        <div class="card-media">
          ${media}
          <span class="item-badge">${badge}</span>
        </div>
        <div class="card-body">
          <span class="item-cat">${cat}</span>
          <h3 class="item-title">${item.title}</h3>
          <div class="item-author">
            <span class="author-avatar">T</span>
            <span class="author-name">Tran Quang Trung</span>
          </div>
        </div>`;
      card.addEventListener("click", () => openModal(item, true));
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

  function makeKey(item) {
    if (item.slug) return item.slug;
    const prefix = item.type === "video" ? "vid-" : "post-";
    return prefix + String(item.id);
  }
  function getPermalink(item) {
    const base = window.location.href.split("?")[0].split("#")[0];
    return base + "?" + makeKey(item);
  }

  function openModal(item, updateUrl) {
    currentItem = item;
    document.getElementById("modalTitle").textContent = item.title;
    document.getElementById("modalCat").textContent =
      item.category || (item.type === "video" ? "VIDEO" : "ART");
    document.getElementById("modalDesc").textContent = item.description || "";
    document.getElementById("modalDate").textContent = item.date || "—";

    const tagsEl = document.getElementById("modalTags");
    tagsEl.innerHTML = "";
    (item.tags || []).forEach(t => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = "#" + t;
      tagsEl.appendChild(span);
    });

    modalMedia.innerHTML = "";
    if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      modalMedia.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.title;
      modalMedia.appendChild(img);
    }

    const dl = document.getElementById("btnDownload");
    if (dl) {
      dl.href = item.src;
      dl.setAttribute("download", (item.title || "artwork").replace(/\s+/g, "_"));
      dl.style.display = "inline-flex";
    }

    if (updateUrl) {
      history.replaceState(null, "", "?" + makeKey(item));
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    const v = modalMedia.querySelector("video");
    if (v) {
      v.pause();
      v.src = "";
    }
    history.replaceState(null, "", window.location.pathname);
  }

  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.querySelector(".modal-overlay").addEventListener("click", closeModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  const btnCopy = document.getElementById("btnCopyLink");
  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      if (!currentItem) return;
      const link = getPermalink(currentItem);
      try {
        await navigator.clipboard.writeText(link);
        btnCopy.textContent = "Link copied!";
        setTimeout(() => {
          btnCopy.textContent = "Share";
        }, 1800);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = link;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        btnCopy.textContent = "Link copied!";
        setTimeout(() => {
          btnCopy.textContent = "Share";
        }, 1800);
      }
    });
  }

  function openFromUrl() {
    const q = (window.location.search || "").replace(/^\?/, "");
    if (!q) return;
    const key = q.split("&")[0];
    const item = works.find(w => w.slug === key || makeKey(w) === key);
    if (item) openModal(item, false);
  }
  window.addEventListener("popstate", openFromUrl);

  loadWorks();
});

document.addEventListener('click',e=>{
 const img=e.target.closest('img');
 if(!img) return;
 let m=document.getElementById('imgModal');
 if(!m){
   m=document.createElement('div');
   m.id='imgModal'; m.className='modal';
   m.innerHTML='<img><div style="color:white;margin-top:10px;text-align:center" id="cap"></div>';
   m.onclick=()=>m.style.display='none';
   document.body.appendChild(m);
 }
 m.querySelector('img').src=img.src;
 document.getElementById('cap').textContent=img.alt||'Chi tiết hình ảnh';
 m.style.display='flex';
});
