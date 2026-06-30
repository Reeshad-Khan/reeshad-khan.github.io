document.addEventListener("DOMContentLoaded", function () {
  const yearNode = document.getElementById("y");
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  initAutoStagger();
  initReveals();
  initCounters();
  initPublicationFilters();
  initActiveNav();
  initGallery();
  initScrollProgress();
  initNavShadow();
});

function initReveals() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const delay = entry.target.getAttribute("data-reveal-delay");
        if (delay) {
          entry.target.style.setProperty("--reveal-delay", delay + "ms");
        }

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

function animateCounter(node) {
  const target = Number(node.getAttribute("data-counter"));
  if (!Number.isFinite(target)) return;

  const start = performance.now();
  const duration = 900;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    node.textContent = String(Math.round(target * eased));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      node.textContent = String(target);
    }
  }

  requestAnimationFrame(step);
}

function initPublicationFilters() {
  const buttons = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll(".pub-card[data-status]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");

      buttons.forEach(function (btn) {
        btn.classList.toggle("is-active", btn === button);
      });

      cards.forEach(function (card) {
        const matches = filter === "all" || card.getAttribute("data-status") === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link[href^='#']");
  if (!sections.length || !links.length) return;

  const lookup = {};
  links.forEach(function (link) {
    lookup[link.getAttribute("href").slice(1)] = link;
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        links.forEach(function (link) {
          link.classList.remove("is-active");
        });

        const active = lookup[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function initScrollProgress() {
  var bar = document.getElementById("scroll-progress");
  if (!bar) return;
  function update() {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initNavShadow() {
  var nav = document.querySelector(".site-nav");
  if (!nav) return;
  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
  }, { passive: true });
}

function initAutoStagger() {
  var containers = document.querySelectorAll(".timeline, .research-grid, .student-grid, .hero-stats, .service-list");
  containers.forEach(function (container) {
    var children = Array.from(container.querySelectorAll("[data-reveal]"));
    children.forEach(function (child, idx) {
      if (!child.hasAttribute("data-reveal-delay")) {
        child.setAttribute("data-reveal-delay", String(idx * 90));
      }
    });
  });
}

function initGallery() {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
  const dots = Array.from(gallery.querySelectorAll(".gallery-dot"));
  const prev = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");

  if (!slides.length) return;

  let index = 0;
  let timer = null;

  function render(newIndex) {
    index = (newIndex + slides.length) % slides.length;

    slides.forEach(function (slide, idx) {
      slide.classList.toggle("is-active", idx === index);
    });

    dots.forEach(function (dot, idx) {
      dot.classList.toggle("is-active", idx === index);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      render(index + 1);
    }, 3500);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
  }

  if (prev) {
    prev.addEventListener("click", function () {
      render(index - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      render(index + 1);
      start();
    });
  }

  dots.forEach(function (dot, idx) {
    dot.addEventListener("click", function () {
      render(idx);
      start();
    });
  });

  gallery.addEventListener("mouseenter", stop);
  gallery.addEventListener("mouseleave", start);

  render(0);
  start();
}
