/* ============================================================
   Outfitters — Award-tier motion engine
   - Lenis smooth scroll
   - Custom cursor with contextual labels
   - Split-text headline reveals (vanilla, no library)
   - IntersectionObserver-driven reveals (sections, images, cards)
   - Branded loading sequence
   - Drop countdown + mobile menu
   ============================================================ */

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hoverFine = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Loading sequence ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("is-done");
    document.body.classList.add("is-loaded");
    revealVisible();
  }, reduced ? 200 : 1500);
});

/* ---------- Lenis smooth scroll (loaded from CDN) ---------- */
function initLenis() {
  if (reduced || typeof Lenis === "undefined") return;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ---------- Custom cursor ---------- */
function initCursor() {
  if (!hoverFine || reduced) return;
  const cursor = document.getElementById("cursor");
  const label = document.getElementById("cursor-label");
  if (!cursor || !label) return;

  document.body.classList.add("cursor-ready");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.classList.add("is-active");
  });
  window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) cursor.classList.remove("is-active");
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  function tick() {
    cx = lerp(cx, mx, 0.18);
    cy = lerp(cy, my, 0.18);
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  const hoverMap = [
    [".product__media", "Quick add +"],
    [".cat-tile", "View"],
    [".campaign__half", "Shop"],
    [".community__tile", "View"],
    [".hero__image", "Discover"],
    [".article-card__media", "Read"],
    ["a, button", ""],
  ];

  hoverMap.forEach(([sel, text]) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hover");
        label.textContent = text;
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover");
        label.textContent = "";
      });
    });
  });
}

/* ---------- Split-text wrapping ---------- */
function splitText() {
  const selectors = [".hero__title", ".section-title", ".club__title", ".newsletter__title"];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.dataset.split === "done") return;
      const html = el.innerHTML;
      // Wrap each top-level word (preserving inline tags like <em> and <br/>)
      const tokens = html.split(/(<[^>]+>|\s+)/g);
      const out = tokens
        .map((tok) => {
          if (!tok) return "";
          if (/^<[^>]+>$/.test(tok)) return tok;
          if (/^\s+$/.test(tok)) return " ";
          return `<span class="split-word">${tok}</span>`;
        })
        .join("");
      el.innerHTML = `<span class="split-line">${out}</span>`;
      el.dataset.split = "done";
    });
  });
}

/* ---------- Hover ellipse position on category tiles ---------- */
function initEllipseTracking() {
  document.querySelectorAll(".cat-tile").forEach((tile) => {
    tile.addEventListener("mousemove", (e) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--hover-x", `${((e.clientX - r.left) / r.width) * 100}%`);
      tile.style.setProperty("--hover-y", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

/* ---------- IntersectionObserver reveals ---------- */
let revealObserver;
function initReveals() {
  const targets = document.querySelectorAll(
    [
      ".hero",
      ".categories",
      ".products",
      ".campaign",
      ".sale",
      ".club",
      ".community",
      ".newsletter",
      ".product",
      ".cat-tile",
      ".tier",
      ".community__tile",
      ".article-card",
      ".hero__image",
      ".cat-tile img",
      ".product__media",
      ".campaign__half",
      ".article-card__media",
    ].join(",")
  );

  // Tag images for clip-path reveal
  document.querySelectorAll(".hero__image, .campaign__half, .article-card__media").forEach((el) => {
    el.classList.add("reveal-img");
  });

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((t) => revealObserver.observe(t));
}

function revealVisible() {
  // Mark anything already in viewport at load time as revealed (no animation hold)
  document.querySelectorAll(".hero, .hero__image, .utility-bar").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add("is-revealed");
    }
  });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const menuToggle = document.querySelector(".header__menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
    document.body.style.overflow = open ? "" : "hidden";
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Mobile: header condense + auto-hide on scroll ---------- */
function initMobileHeader() {
  if (window.innerWidth > 768) return;
  const header = document.getElementById("site-header");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-condensed", y > 40);
    if (y > 200 && y > lastY + 5) header.classList.add("is-hidden");
    else if (y < lastY - 5) header.classList.remove("is-hidden");
    lastY = y;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
}

/* ---------- Mobile: search drawer ---------- */
function initSearchDrawer() {
  const drawer = document.getElementById("search-drawer");
  const openBtn = document.getElementById("search-open");
  const closeBtn = document.getElementById("search-close");
  if (!drawer || !openBtn || !closeBtn) return;

  const open = () => {
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => drawer.querySelector("input")?.focus(), 350);
  };
  const close = () => {
    drawer.hidden = true;
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  document.querySelectorAll(".header__actions .icon-btn[aria-label='Search']").forEach((b) => {
    b.addEventListener("click", open);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) close();
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 600);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => {
    if (window.lenis) window.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Drop countdown ---------- */
function initCountdown() {
  const countdown = document.getElementById("countdown");
  if (!countdown) return;

  const target = new Date();
  target.setDate(target.getDate() + 7);
  target.setHours(target.getHours() + 14);
  target.setMinutes(target.getMinutes() + 32);

  const cells = countdown.querySelectorAll("b");
  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  const tick = () => {
    const diff = target - new Date();
    if (diff <= 0) {
      cells.forEach((c) => (c.textContent = "00"));
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    cells[0].textContent = pad(d);
    cells[1].textContent = pad(h);
    cells[2].textContent = pad(m);
    cells[3].textContent = pad(s);
  };

  tick();
  setInterval(tick, 1000);
}

/* ---------- Bootstrap ---------- */
document.addEventListener("DOMContentLoaded", () => {
  splitText();
  initReveals();
  initEllipseTracking();
  initCursor();
  initMobileMenu();
  initMobileHeader();
  initSearchDrawer();
  initBackToTop();
  initCountdown();
  initLenis();
});
