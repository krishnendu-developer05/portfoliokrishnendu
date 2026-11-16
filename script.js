/* ============================================================
   KRISHNENDU ROY — INTERACTIVE ENGINE
   Spotlight card cursor tracking · Lag-free 60FPS · Filter tabs
   Zero dependencies · Optimized for high-throughput responsiveness
   ============================================================ */

(function () {
  "use strict";

  // Check reduced motion preference
  var isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- 1. Hardware Accelerated Scroll Reveals ---------------- */
  var revealElements = document.querySelectorAll(".reveal");

  if (isReduced || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------- 2. Razorpay-Style Spotlight Card Tracking ---------------- */
  // Mouse cursor spotlight flashlight on cards using requestAnimationFrame
  if (!isReduced && window.innerWidth > 768) {
    var spotlightCards = document.querySelectorAll(".spotlight-card");

    spotlightCards.forEach(function (card) {
      var rafId = null;

      function updateCardSpotlight(e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty("--mouse-x", x + "px");
          card.style.setProperty("--mouse-y", y + "px");
        });
      }

      card.addEventListener("mousemove", updateCardSpotlight, { passive: true });
      card.addEventListener("mouseleave", function () {
        if (rafId) cancelAnimationFrame(rafId);
      });
    });
  }

  /* ---------------- 3. Interactive Project Category Filter ---------------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card-wrap");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filterVal = btn.getAttribute("data-filter");

      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      projectCards.forEach(function (wrap) {
        var category = wrap.getAttribute("data-category") || "";
        if (filterVal === "all" || category.indexOf(filterVal) !== -1) {
          wrap.style.display = "";
          setTimeout(function () {
            wrap.style.opacity = "1";
            wrap.style.transform = "translate3d(0, 0, 0)";
          }, 20);
        } else {
          wrap.style.opacity = "0";
          wrap.style.transform = "translate3d(0, 10px, 0)";
          wrap.style.display = "none";
        }
      });
    });
  });

  /* ---------------- 4. Collapsible Architecture Specs ---------------- */
  var specToggles = document.querySelectorAll("[data-spec-toggle]");

  specToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = toggle.getAttribute("data-spec-toggle");
      var drawer = document.getElementById(targetId);
      if (!drawer) return;

      var isOpen = drawer.classList.contains("is-open");
      if (isOpen) {
        drawer.classList.remove("is-open");
        toggle.innerHTML = "<span>Architecture Spec ▾</span>";
        toggle.setAttribute("aria-expanded", "false");
      } else {
        drawer.classList.add("is-open");
        toggle.innerHTML = "<span>Close Spec ▴</span>";
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------- 5. One-Click Copy with Toast Feedback ---------------- */
  var toastNotice = document.getElementById("toastNotice");
  var toastTimer = null;

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.querySelector(".toast-text").textContent = message;
    toastNotice.classList.add("is-active");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastNotice.classList.remove("is-active");
    }, 2800);
  }

  var copyButtons = document.querySelectorAll("[data-copy]");
  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(function () {
          showToast("Copied to clipboard: " + textToCopy);
        }).catch(function () {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Copied to clipboard: " + text);
    } catch (err) {
      showToast("Could not copy automatically: " + text);
    }
    document.body.removeChild(ta);
  }

  /* ---------------- 6. Topbar Active Scroll Spy & Elevation ---------------- */
  var topbar = document.querySelector(".topbar");
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");

  function onScroll() {
    var scrollPos = window.scrollY || window.pageYOffset;

    // Topbar shadow / elevation
    if (topbar) {
      if (scrollPos > 30) {
        topbar.style.borderColor = "rgba(13, 148, 251, 0.2)";
        topbar.style.backgroundColor = "rgba(5, 9, 20, 0.88)";
      } else {
        topbar.style.borderColor = "rgba(255, 255, 255, 0.08)";
        topbar.style.backgroundColor = "rgba(7, 12, 24, 0.75)";
      }
    }

    // Scroll spy for navigation
    var currentSection = "";
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
