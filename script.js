/* ============================================================
   SIGNAL IN THE NOISE — motion & interaction
   Contracts (from creative direction):
   - One owner per animated element. GSAP owns scroll reveals.
   - Lenis drives scroll; a single rAF via gsap.ticker.
   - Reduced motion: everything visible, no animation.
   - The site is fully usable if JS or CDNs fail.
   ============================================================ */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  /* ---------- Hero line split (GSAP-independent CSS reveal) ---------- */
  var heroLine = document.getElementById("heroLine");
  if (heroLine) {
    heroLine.querySelectorAll(".hl").forEach(function (hl) {
      var text = hl.textContent;
      hl.textContent = "";
      var inner = document.createElement("span");
      inner.textContent = text;
      hl.appendChild(inner);
    });
  }

  /* ---------- Loader (max ~1.2s, timeout-forced at 1.8s) ---------- */
  var loader = document.getElementById("loader");
  function killLoader() {
    if (!loader) return;
    loader.classList.add("is-leaving");
    loader.classList.remove("is-active", "is-loading");
    window.setTimeout(function () { loader.remove(); }, 450);
  }
  if (loader && !reducedMotion) {
    var lines = loader.querySelectorAll(".loader-line");
    loader.classList.add("is-active", "is-loading");
    lines.forEach(function (line, i) {
      window.setTimeout(function () { line.classList.add("is-on"); }, 180 + i * 280);
    });
    window.setTimeout(killLoader, 1300);
    window.setTimeout(killLoader, 1800); // hard timeout — content first, always
  } else if (loader) {
    loader.remove();
  }

  /* ---------- Lenis smooth scroll (single rAF through gsap.ticker) ---------- */
  var lenis = null;
  if (!reducedMotion && hasLenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    window.lenis = lenis; // exposed for programmatic navigation & debugging
    if (hasGSAP) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); window.requestAnimationFrame(raf); }
      window.requestAnimationFrame(raf);
    }
  }

  /* Anchor navigation routes through Lenis; falls back to native */
  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ---------- Scroll reveals (GSAP ScrollTrigger, or instant fallback) ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reducedMotion || !hasGSAP) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    if (heroLine) heroLine.classList.add("is-in");
  } else {
    window.gsap.registerPlugin(window.ScrollTrigger);
    if (heroLine) {
      window.ScrollTrigger.create({
        trigger: heroLine,
        start: "top 85%",
        once: true,
        onEnter: function () { heroLine.classList.add("is-in"); }
      });
    }
    reveals.forEach(function (el) {
      window.ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () { el.classList.add("is-in"); }
      });
    });
    window.document.fonts && document.fonts.ready.then(function () {
      window.ScrollTrigger.refresh();
    });
  }

  /* ---------- Progress line + chapter rail (no GSAP needed) ---------- */
  var progressBar = document.getElementById("progressBar");
  var railLinks = document.querySelectorAll(".chapter-rail a");
  var chapters = ["signal", "origin", "mind", "build", "process", "human", "next"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var y = window.scrollY || doc.scrollTop;
    if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    var current = 0;
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].getBoundingClientRect().top <= window.innerHeight * 0.45) current = i;
    }
    railLinks.forEach(function (link, i) {
      link.classList.toggle("is-active", i === current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Signal canvas: noise → signal (one scene, CH 00 only) ---------- */
  var canvas = document.getElementById("signalCanvas");
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var COUNT = window.innerWidth < 700 ? 900 : 1800;
    var W = 0, H = 0, assembled = 0, pointer = { x: 0.5, y: 0.5 };
    var running = true;

    function latticePoint(i, total) {
      // pseudo-grid: coherent lattice the particles converge to
      var cols = Math.ceil(Math.sqrt(total * (W / Math.max(H, 1))));
      var rows = Math.ceil(total / cols);
      var gx = (i % cols) / cols, gy = Math.floor(i / cols) / rows;
      return { x: gx * W, y: gy * H };
    }

    function build() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        var target = latticePoint(i, COUNT);
        particles.push({
          x: Math.random() * W, y: Math.random() * H,          // noise start
          tx: target.x, ty: target.y,                          // signal target
          d: 0.55 + Math.random() * 0.4,                       // per-particle delay factor
          s: Math.random() * 1.4 + 0.4                         // size
        });
      }
      assembled = 0;
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var silver = "rgba(191,194,200,";
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var ease = Math.min(1, assembled * p.d * 1.15);
        var e = 1 - Math.pow(1 - ease, 3); // cubic out
        var px = p.x + (p.tx - p.x) * e;
        var py = p.y + (p.ty - p.y) * e;
        // pointer parallax, subtle
        px += (pointer.x - 0.5) * 14 * (p.s / 1.8);
        py += (pointer.y - 0.5) * 14 * (p.s / 1.8);
        // gentle post-assembly drift
        if (ease >= 1) {
          py += Math.sin(t / 1600 + i) * 1.5;
        }
        ctx.fillStyle = silver + (0.18 + 0.5 * e) + ")";
        ctx.fillRect(px, py, p.s, p.s);
      }
    }

    var t0 = null;
    function frame(t) {
      if (!running) return;
      if (t0 === null) t0 = t;
      assembled = Math.min(1, (t - t0) / 2400);
      draw(t);
      window.requestAnimationFrame(frame);
    }

    build();
    window.requestAnimationFrame(frame);

    window.addEventListener("resize", build);
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) window.requestAnimationFrame(frame);
    });
    window.addEventListener("pointermove", function (e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
    }, { passive: true });
  } else if (canvas) {
    // Reduced motion: draw the static lattice once — the "signal" as a still
    var c2 = canvas.getContext("2d");
    var r2 = canvas.parentElement.getBoundingClientRect();
    canvas.width = r2.width; canvas.height = r2.height;
    c2.fillStyle = "rgba(191,194,200,0.5)";
    var step = 26;
    for (var x = step; x < r2.width; x += step) {
      for (var y = step; y < r2.height; y += step) {
        c2.fillRect(x, y, 1.4, 1.4);
      }
    }
  }

  /* ---------- Signal terminal (supplementary navigation) ---------- */
  var terminal = document.getElementById("terminal");
  var terminalInput = document.getElementById("terminalInput");
  var terminalOut = document.getElementById("terminalOut");
  var lastFocus = null;

  var commands = {
    "home": { go: "#signal", out: "→ CH 00 · the signal" },
    "signal": { go: "#signal", out: "→ CH 00 · the signal (already tuned)" },
    "origin": { go: "#origin", out: "→ CH 01 · the origin" },
    "mind": { go: "#mind", out: "→ CH 02 · the mind" },
    "build": { go: "#build", out: "→ CH 03 · the build" },
    "process": { go: "#process", out: "→ CH 04 · spec before code" },
    "human": { go: "#human", out: "→ CH 05 · the human side" },
    "next": { go: "#next", out: "→ CH 06 · still becoming" },
    "contact": { go: "#next", out: "→ CH 06 · contact grid" }
  };

  function openTerminal() {
    lastFocus = document.activeElement;
    terminal.hidden = false;
    terminalInput.value = "";
    terminalOut.textContent = "";
    terminalInput.focus();
  }
  function closeTerminal() {
    terminal.hidden = true;
    document.body.classList.remove("theme-negative");
    terminalOut.textContent = "";
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && terminal.hidden && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      openTerminal();
    } else if (e.key === "Escape" && !terminal.hidden) {
      closeTerminal();
    }
  });
  terminal.addEventListener("click", function (e) { if (e.target === terminal) closeTerminal(); });
  terminalInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var cmd = terminalInput.value.trim().toLowerCase().replace(/^\/+/, "");
    if (!cmd) return;
    if (cmd === "negative") {
      document.body.classList.toggle("theme-negative");
      terminalOut.textContent = document.body.classList.contains("theme-negative")
        ? "theme: negative — light mode engaged" : "theme: signal — dark mode restored";
      return;
    }
    if (cmd === "reset") {
      document.body.classList.remove("theme-negative");
      terminalOut.textContent = "signal reset. typing again?";
      return;
    }
    if (cmd === "close" || cmd === "exit") { closeTerminal(); return; }
    var target = commands[cmd];
    if (target) {
      terminalOut.textContent = target.out;
      window.setTimeout(function () {
        closeTerminal();
        var el = document.querySelector(target.go);
        if (el) scrollToTarget(el);
      }, 350);
    } else {
      terminalOut.textContent = "unknown signal: '" + cmd + "' — try origin · mind · build · process · human · next · negative";
    }
  });
})();
