(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var narrow = window.matchMedia("(max-width: 900px)").matches;

  /* ----- Sticky header + multi-layer parallax ----- */
  var layerEls = document.querySelectorAll("[data-parallax-layer]");
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  var splash = document.querySelector(".splash-sticky");
  var splashPin = document.querySelector(".splash-pin");
  var ticking = false;

  function updateDepth() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    if (reduceMotion) return;

    var sy = window.scrollY;
    var vh = window.innerHeight;

    // Multi-layer hero parallax (different speeds)
    layerEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax-layer")) || 0.2;
      var offset = Math.min(sy * speed, 220);
      el.style.transform = "translate3d(0, " + offset.toFixed(1) + "px, 0)";
    });

    // Accent / stack parallax via CSS var
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      var parent = el.parentElement || el;
      var rect = parent.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > vh + 120) return;
      var local = (sy - (el.offsetTop || 0)) * speed * 0.35;
      // Prefer relative-to-viewport nudge
      var mid = rect.top + rect.height * 0.5 - vh * 0.5;
      local = mid * speed * -0.35;
      el.style.setProperty("--parallax-y", local.toFixed(1) + "px");
    });

    // Sticky splash progress (light storytelling)
    if (splash && splashPin && !narrow) {
      var pinRect = splashPin.getBoundingClientRect();
      var travel = Math.max(1, splashPin.offsetHeight - splash.offsetHeight);
      var scrolled = Math.min(Math.max(-pinRect.top, 0), travel);
      var progress = scrolled / travel;
      splash.style.setProperty("--splash-progress", progress.toFixed(3));
      splash.classList.toggle("is-pinned", pinRect.top <= 72 && pinRect.bottom > vh);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateDepth();
      ticking = false;
    });
  }

  updateDepth();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    function () {
      narrow = window.matchMedia("(max-width: 900px)").matches;
      updateDepth();
    },
    { passive: true }
  );

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
    document
      .querySelectorAll(
        ".value-grid, .pkg-grid, .story-grid, .photo-strip, .mem-gallery, .contact-channels"
      )
      .forEach(function (grid) {
        var kids = grid.querySelectorAll(
          ":scope > .reveal, :scope > .tilt-card.reveal, :scope > figure.reveal, :scope > article.reveal"
        );
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

  /* ----- Soft 3D card tilt (desktop only) — stronger lift ----- */
  if (!reduceMotion && finePointer) {
    var tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach(function (card) {
      var frame;
      var max = 10; // degrees — bold but still premium

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
