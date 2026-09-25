(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var heroMedia = document.querySelector(".hero-media");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ----- Sticky header + hero parallax ----- */
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    if (heroMedia && !reduceMotion) {
      var y = window.scrollY;
      var offset = Math.min(y * 0.32, 160);
      heroMedia.style.transform = "translate3d(0, " + offset + "px, 0)";
    }
    // Parallax floating accents + depth layers
    if (!reduceMotion) {
      var sy = window.scrollY;
      document.querySelectorAll("[data-parallax]").forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.parentElement
          ? el.parentElement.getBoundingClientRect()
          : el.getBoundingClientRect();
        // Only nudge when near viewport
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        var local = (sy - (el.offsetTop || 0)) * speed;
        // Prefer CSS custom property so we don't fight tilt transforms
        el.style.setProperty("--parallax-y", local.toFixed(1) + "px");
      });
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Mobile nav ----- */
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ----- Scroll reveal (with stagger) ----- */
  if ("IntersectionObserver" in window) {
    // Stagger siblings that share a grid/parent
    document.querySelectorAll(".value-grid, .pkg-grid, .story-grid, .photo-strip, .mem-gallery, .contact-channels").forEach(function (grid) {
      var kids = grid.querySelectorAll(":scope > .reveal, :scope > .tilt-card.reveal, :scope > figure.reveal, :scope > article.reveal");
      kids.forEach(function (el, i) {
        el.style.setProperty("--reveal-delay", i * 90 + "ms");
      });
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ----- Soft 3D card tilt (desktop only) ----- */
  if (!reduceMotion && finePointer) {
    var tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach(function (card) {
      var frame;
      var max = 7; // degrees — tasteful, not carnival

      function reset() {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--tilt-glow-x", "50%");
        card.style.setProperty("--tilt-glow-y", "50%");
        card.classList.remove("is-tilting");
      }

      card.addEventListener("pointerenter", function () {
        card.classList.add("is-tilting");
      });

      card.addEventListener("pointermove", function (e) {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          var rotY = (px - 0.5) * (max * 2);
          var rotX = (0.5 - py) * (max * 2);
          card.style.setProperty("--tilt-x", rotX.toFixed(2) + "deg");
          card.style.setProperty("--tilt-y", rotY.toFixed(2) + "deg");
          card.style.setProperty("--tilt-glow-x", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--tilt-glow-y", (py * 100).toFixed(1) + "%");
        });
      });

      card.addEventListener("pointerleave", function () {
        if (frame) cancelAnimationFrame(frame);
        reset();
      });
    });
  }
})();
