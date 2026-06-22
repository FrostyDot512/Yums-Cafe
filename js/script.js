const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const revealElements = document.querySelectorAll(".reveal");
const galleryItems = document.querySelectorAll("[data-lightbox]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxContent = document.querySelector("[data-lightbox-content]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const menuTabs = document.querySelectorAll("[data-filter]");
const menuItems = document.querySelectorAll(".menu-item");
const yearTarget = document.querySelector("[data-year]");
const preloader = document.querySelector(".preloader");

// Keep the transparent header readable once the page starts scrolling.
const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

// Mobile navigation is locked to avoid background scrolling under the menu.
const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  header.classList.remove("is-open");
  nav.classList.remove("is-open");
  navToggle.classList.remove("is-active");
  navToggle.setAttribute("aria-expanded", "false");
};

const openNavigation = () => {
  document.body.classList.add("nav-open");
  header.classList.add("is-open");
  nav.classList.add("is-open");
  navToggle.classList.add("is-active");
  navToggle.setAttribute("aria-expanded", "true");
};

// The same modal supports still images and video clips from the gallery.
const openLightbox = (type, src) => {
  lightboxContent.innerHTML = "";

  const media = document.createElement(type === "video" ? "video" : "img");
  media.src = src;

  if (type === "video") {
    media.controls = true;
    media.autoplay = true;
    media.playsInline = true;
  } else {
    media.alt = "Expanded Yums Cafe gallery image";
  }

  lightboxContent.appendChild(media);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxContent.innerHTML = "";
  document.body.style.overflow = "";
};

// Reveal content once to keep scroll movement subtle and performant.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

window.addEventListener("load", () => {
  preloader.classList.add("is-hidden");
  revealElements.forEach((element) => revealObserver.observe(element));
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.contains("is-open");
  isOpen ? closeNavigation() : openNavigation();
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const category = tab.dataset.filter;

    menuTabs.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");

    menuItems.forEach((item) => {
      const shouldShow = category === "all" || item.dataset.category === category;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

galleryItems.forEach((item) => {
  const previewVideo = item.querySelector("video");

  item.addEventListener("click", () => {
    openLightbox(item.dataset.lightbox, item.dataset.src);
  });

  if (previewVideo) {
    item.addEventListener("mouseenter", () => previewVideo.play());
    item.addEventListener("mouseleave", () => {
      previewVideo.pause();
      previewVideo.currentTime = 0;
    });
  }
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeNavigation();
  }
});

yearTarget.textContent = new Date().getFullYear();
