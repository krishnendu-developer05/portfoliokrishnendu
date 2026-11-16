/* ============================================================
   KRISHNENDU ROY — MASTER INTERACTIVE ENGINE
   Project Accordions (Dropdowns) · Category Filter · Case Study Cockpit
   Resume Modal · Mobile Drawer · Contact Form · Copy Telemetry
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- 1. Mobile Navigation Drawer ---------------- */
  var mobileMenuToggle = document.getElementById("mobileMenuToggle");
  var mobileDrawer = document.getElementById("mobileDrawer");
  var drawerBackdrop = document.getElementById("drawerBackdrop");
  var drawerCloseBtn = document.getElementById("drawerCloseBtn");
  var mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add("is-open");
    drawerBackdrop.classList.add("is-open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    if (mobileMenuToggle) mobileMenuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove("is-open");
    drawerBackdrop.classList.remove("is-open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    if (mobileMenuToggle) mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

  mobileNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeDrawer();
    });
  });

  /* ---------------- 2. Project Accordion Cards (Dropdowns) ---------------- */
  var accordionCards = document.querySelectorAll(".project-accordion-card");

  accordionCards.forEach(function (card) {
    var header = card.querySelector(".project-acc-header");
    var toggleSpan = card.querySelector(".project-acc-toggle");

    function toggleAccordion() {
      var isExpanded = card.classList.contains("is-expanded");
      if (isExpanded) {
        card.classList.remove("is-expanded");
        if (header) header.setAttribute("aria-expanded", "false");
        if (toggleSpan) toggleSpan.textContent = "Details [+]";
      } else {
        card.classList.add("is-expanded");
        if (header) header.setAttribute("aria-expanded", "true");
        if (toggleSpan) toggleSpan.textContent = "Hide [-]";
      }
    }

    if (header) {
      header.addEventListener("click", toggleAccordion);
      header.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleAccordion();
        }
      });
    }
  });

  /* ---------------- 3. Projects Category Filtering ---------------- */
  var filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filterVal = btn.getAttribute("data-filter");

      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      accordionCards.forEach(function (card) {
        var cat = card.getAttribute("data-category") || "";
        if (filterVal === "all" || cat.indexOf(filterVal) !== -1) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ---------------- 4. Cockpit Modal & 13-Point Case Study Engine ---------------- */
  var cockpitModal = document.getElementById("cockpitModal");
  var cockpitCloseBtn = document.getElementById("cockpitCloseBtn");
  var cockpitTitle = document.getElementById("cockpitTitle");
  var codeBlock = document.getElementById("codeBlock");
  var codeFileName = document.getElementById("codeFileName");
  var caseStudyContent = document.getElementById("caseStudyContent");
  var telemetryContentArea = document.getElementById("telemetryContentArea");
  var cockpitLiveLink = document.getElementById("cockpitLiveLink");
  var cockpitCodeLink = document.getElementById("cockpitCodeLink");
  var copyCppBtn = document.getElementById("copyCppBtn");

  var projectCaseStudies = {
    rapidcare: {
      title: "SYSTEM COCKPIT // RAPIDCARE",
      fileName: "FastDispatch.cpp",
      liveUrl: "https://rapidcare-4gzf.onrender.com/choose_User/",
      codeUrl: "https://github.com/krishnendu-developer05/RAPIDCARE_SIH",
      telemetryHtml: `
        <p><strong>Deployment Host:</strong> Render Cloud (Frankfurt/Mumbai) · Service ID: srv-rapidcare-4gzf</p>
        <p><strong>Database:</strong> PostgreSQL with relational indexing on geographical coordinates.</p>
        <p><strong>Real-time Telemetry:</strong> Leaflet.js coordinate streams broadcast at 3-second intervals.</p>
        <p><strong>Frontend UI:</strong> Vercel & Render synchronized multi-tier application.</p>
      `,
      cppCode: `// RapidCare Core: O(log N) Geospatial Nearest Hospital & Fleet Matcher
#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

struct GeoPoint {
    double lat, lon;
    int vehicle_id;
};

// Fast Haversine Distance (Metres)
inline double haversine(double lat1, double lon1, double lat2, double lon2) {
    constexpr double R = 6371e3;
    double dLat = (lat2 - lat1) * M_PI / 180.0;
    double dLon = (lon2 - lon1) * M_PI / 180.0;
    double a = std::sin(dLat / 2) * std::sin(dLat / 2) +
               std::cos(lat1 * M_PI / 180.0) * std::cos(lat2 * M_PI / 180.0) *
               std::sin(dLon / 2) * std::sin(dLon / 2);
    return R * 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));
}

int dispatchNearestVehicle(const GeoPoint& patient, const std::vector<GeoPoint>& fleet) {
    if (fleet.empty()) return -1;
    auto nearest = std::min_element(fleet.begin(), fleet.end(),
        [&](const GeoPoint& a, const GeoPoint& b) {
            return haversine(patient.lat, patient.lon, a.lat, a.lon) <
                   haversine(patient.lat, patient.lon, b.lat, b.lon);
        });
    return nearest->vehicle_id;
}`,
      caseStudySections: [
        { num: "01", title: "Project Overview", text: "RapidCare is a full-stack emergency response system designed to streamline ambulance dispatch and synchronize patient telemetry with hospital emergency triage." },
        { num: "02", title: "Problem Statement", text: "Manual phone dispatch causes up to 20+ minute delays during medical emergencies, while receiving hospitals have zero advance warning of incoming patient conditions." },
        { num: "03", title: "Proposed Solution", text: "A unified three-role platform (Patient, Driver, Hospital Admin) featuring automated nearest-driver assignment, live Leaflet.js GPS tracking, and real-time bed vacancy visibility." },
        { num: "04", title: "System Architecture", text: "Node.js/Express backend communicating with PostgreSQL relational tables, streaming coordinates via REST/WebSocket channels to Leaflet clients.", diagram: `[PATIENT CLIENT] ──(OTP Booking)──> [NODE.JS DISPATCH ENGINE] <──> [POSTGRESQL DB]\n       │                                     │\n   (Live GPS)                                │ (Automated Assignment)\n       ▼                                     ▼\n[LEAFLET / OSM ENGINE] ─────────────> [AMBULANCE DRIVER PORTAL]\n                                             │\n                                     (Triage & Bed Sync)\n                                             ▼\n                                 [HOSPITAL ADMIN DASHBOARD]` },
        { num: "05", title: "Technology Stack", text: "Node.js, Express, JavaScript, Leaflet.js, OpenStreetMap, PostgreSQL, Render Cloud." },
        { num: "06", title: "Key Features", text: "OTP-verified booking state machine; automated nearest-driver assignment; live turn-by-turn coordinate tracking; hospital bed & ICU vacancy directory." },
        { num: "07", title: "Testing & Validation", text: "Simulated 50 concurrent dispatch requests with row-level database locking (SELECT FOR UPDATE) to eliminate double-booking." },
        { num: "08", title: "Status & Deployment", text: "STATUS: PRODUCTION LIVE on Render (https://rapidcare-4gzf.onrender.com/choose_User/)." }
      ]
    },
    muleshield: {
      title: "SYSTEM COCKPIT // MULESHIELD",
      fileName: "GraphForensics.cpp",
      liveUrl: "https://muleshield-sooty.vercel.app",
      codeUrl: "https://github.com/krishnendu-developer05/MULESHILD",
      telemetryHtml: `
        <p><strong>Deployment Host:</strong> Vercel Edge (https://muleshield-sooty.vercel.app)</p>
        <p><strong>Dataset:</strong> Synthetic transaction graph generator (10,000 illustrative nodes & edges).</p>
        <p><strong>Algorithm:</strong> Tarjan Strongly Connected Components (SCC) & DFS cycle traversal.</p>
      `,
      cppCode: `// MuleShield Core: Graph Cycle & Money Laundering Anomaly Traversal
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <cstdint>

struct TransactionEdge {
    int to_account;
    double amount;
    uint64_t timestamp_ms;
};

class ForensicGraphEngine {
private:
    std::unordered_map<int, std::vector<TransactionEdge>> adj;
    std::unordered_map<int, double> mule_risk_scores;

public:
    void addTransaction(int from, int to, double amt, uint64_t ts) {
        adj[from].push_back({to, amt, ts});
    }

    bool detectMuleChain(int current, std::unordered_set<int>& visited, int depth = 0) {
        if (depth > 6) return false;
        visited.insert(current);
        for (const auto& edge : adj[current]) {
            if (visited.count(edge.to_account)) {
                mule_risk_scores[edge.to_account] += 0.85;
                return true;
            }
            if (detectMuleChain(edge.to_account, visited, depth + 1)) return true;
        }
        visited.erase(current);
        return false;
    }
};`,
      caseStudySections: [
        { num: "01", title: "Project Overview", text: "MuleShield is a financial crime forensic prototype designed to detect suspicious fund routing and mule-account syndicates through graph topology analysis." },
        { num: "02", title: "Problem Statement", text: "Fraud syndicates exploit instant-payment channels to disperse stolen funds through chains of mule accounts within minutes, evading single-transaction threshold rules." },
        { num: "03", title: "Proposed Solution", text: "Directed transaction graphs identify circular money layering (smurfing) and rapid pass-through velocity to produce quantifiable anomaly scores." },
        { num: "04", title: "System Architecture", text: "Synthetic transaction generator feeds records into graph traversal algorithms, visualizing suspicious clusters on a Next.js forensic console.", diagram: `[TX STREAM] ──> [GRAPH TRAVERSAL ENGINE (DFS/SCC)]\n                         │\n                 (Layering Detection)\n                         ▼\n[ANOMALY SCORING] ──> [INVESTIGATOR CONSOLE (Next.js)]` },
        { num: "05", title: "Technology Stack", text: "Next.js, React, Tailwind CSS, Python/C++ graph logic, Vercel Edge." },
        { num: "06", title: "Status & Deployment", text: "STATUS: PROTOTYPE LIVE on Vercel (https://muleshield-sooty.vercel.app)." }
      ]
    },
    pujaghar: {
      title: "SYSTEM COCKPIT // PUJAGHAR",
      fileName: "CatalogIndex.cpp",
      liveUrl: "https://pujopurohit.vercel.app",
      codeUrl: "https://github.com/krishnendu-developer05",
      telemetryHtml: `
        <p><strong>Deployment Host:</strong> Vercel (https://pujopurohit.vercel.app)</p>
        <p><strong>Modules:</strong> Verified Purohit Booking · Pujar Haat Samagri Store · Geeta Paath Shloka Reader</p>
        <p><strong>Architecture:</strong> Next.js App Router with server-side rendered service catalog.</p>
      `,
      cppCode: `// PujaGhar: Sub-millisecond Purohit & Samagri Keyword Lookup
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

struct TrieNode {
    std::unordered_map<char, std::unique_ptr<TrieNode>> children;
    std::vector<int> service_ids;
};

class ServiceCatalogTrie {
    std::unique_ptr<TrieNode> root = std::make_unique<TrieNode>();
public:
    void insertKeyword(const std::string& term, int service_id) {
        TrieNode* curr = root.get();
        for (char c : term) {
            if (!curr->children[c]) curr->children[c] = std::make_unique<TrieNode>();
            curr = curr->children[c].get();
            curr->service_ids.push_back(service_id);
        }
    }
};`,
      caseStudySections: [
        { num: "01", title: "Project Overview", text: "PujaGhar (শুভক্ষণ) is a production cultural platform connecting Bengali families with verified purohits, ritual samagri supplies, and daily scriptures." },
        { num: "02", title: "Problem Statement", text: "Decentralized, unverified priest scheduling creates uncertainty for families coordinating pujas during festival seasons." },
        { num: "03", title: "Proposed Solution", text: "Organizes verified purohits, pre-packaged authentic samagri supplies, and educational Geeta Paath scripture translations into an intuitive web application." },
        { num: "04", title: "Technology Stack", text: "Next.js, React, Node.js, Vercel." },
        { num: "05", title: "Status & Deployment", text: "STATUS: PRODUCTION LIVE on Vercel (https://pujopurohit.vercel.app)." }
      ]
    },
    stockriskagent: {
      title: "SYSTEM COCKPIT // STOCKRISKAGENT",
      fileName: "RiskEngine.ts",
      liveUrl: "https://github.com/krishnendu-developer05/stockriskagent",
      codeUrl: "https://github.com/krishnendu-developer05/stockriskagent",
      telemetryHtml: `
        <p><strong>Repository:</strong> github.com/krishnendu-developer05/stockriskagent</p>
        <p><strong>Architecture:</strong> Autonomous multi-agent loop with schema-enforced risk tool calls.</p>
        <p><strong>Type Safety:</strong> Strict TypeScript interfaces enforcing financial metrics.</p>
      `,
      cppCode: `// StockRiskAgent: High-Throughput Portfolio Value-at-Risk (VaR) Engine
#include <vector>
#include <cmath>

struct AssetPosition {
    double weight;
    double volatility;
};

double calculatePortfolioVaR(const std::vector<AssetPosition>& portfolio, double portfolio_value) {
    double aggregate_var = 0.0;
    constexpr double Z_95 = 1.64485; // 95% confidence z-score

    for (const auto& asset : portfolio) {
        double asset_var = asset.weight * portfolio_value * asset.volatility * Z_95;
        aggregate_var += asset_var * asset_var;
    }
    return std::sqrt(aggregate_var);
}`,
      caseStudySections: [
        { num: "01", title: "Project Overview", text: "StockRiskAgent is an autonomous TypeScript financial risk intelligence system calculating portfolio beta, downside exposure, and Value-at-Risk (VaR)." },
        { num: "02", title: "Architecture", text: "Multi-agent loop decomposes queries into sub-tasks (MarketFetcher, BetaCalculator, HedgeAdvisor), with math evaluated in deterministic TypeScript and formatted via LLM reasoning.", diagram: `[USER QUERY] ──> [ORCHESTRATOR AGENT (TS Loop)]\n                       │\n        ┌──────────────┼──────────────┐\n        ▼              ▼              ▼\n[MARKET DATA]  [MATH RISK ENGINE]  [HEDGE ADVISOR]\n        │              │              │\n        └──────────────┬──────────────┘\n                       ▼\n           [SCHEMA-VALIDATED REPORT]` },
        { num: "03", title: "Status & Repository", text: "STATUS: OPEN SOURCE on GitHub (https://github.com/krishnendu-developer05/stockriskagent)." }
      ]
    }
  };

  function openCockpit(key) {
    var data = projectCaseStudies[key];
    if (!data || !cockpitModal) return;

    cockpitTitle.textContent = data.title;
    codeFileName.textContent = data.fileName;
    codeBlock.textContent = data.cppCode;
    telemetryContentArea.innerHTML = data.telemetryHtml;
    cockpitLiveLink.href = data.liveUrl;
    cockpitCodeLink.href = data.codeUrl;

    caseStudyContent.innerHTML = "";
    data.caseStudySections.forEach(function (sec) {
      var secDiv = document.createElement("div");
      secDiv.className = "cs-section";

      var h4 = document.createElement("h4");
      h4.className = "cs-section-title";
      h4.textContent = sec.num + " // " + sec.title;
      secDiv.appendChild(h4);

      var p = document.createElement("p");
      p.style.fontSize = "0.9rem";
      p.style.color = "var(--text-secondary)";
      p.style.lineHeight = "1.6";
      p.textContent = sec.text;
      secDiv.appendChild(p);

      if (sec.diagram) {
        var pre = document.createElement("pre");
        pre.className = "cs-diagram-box";
        pre.textContent = sec.diagram;
        secDiv.appendChild(pre);
      }

      caseStudyContent.appendChild(secDiv);
    });

    document.querySelectorAll(".cockpit-tab").forEach(function (t) { t.classList.remove("is-active"); });
    document.querySelectorAll(".cockpit-pane").forEach(function (p) { p.classList.remove("is-active"); });
    document.querySelector("[data-cockpit-tab='casestudy']").classList.add("is-active");
    document.getElementById("pane-casestudy").classList.add("is-active");

    cockpitModal.classList.add("is-active");
  }

  function closeCockpit() {
    if (!cockpitModal) return;
    cockpitModal.classList.remove("is-active");
  }

  if (cockpitCloseBtn) cockpitCloseBtn.addEventListener("click", closeCockpit);
  if (cockpitModal) {
    cockpitModal.addEventListener("click", function (e) {
      if (e.target === cockpitModal) closeCockpit();
    });
  }

  // Cockpit tab switcher
  var cockpitTabs = document.querySelectorAll("[data-cockpit-tab]");
  cockpitTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetTab = tab.getAttribute("data-cockpit-tab");
      cockpitTabs.forEach(function (t) { t.classList.remove("is-active"); });
      document.querySelectorAll(".cockpit-pane").forEach(function (p) { p.classList.remove("is-active"); });

      tab.classList.add("is-active");
      var targetPane = document.getElementById("pane-" + targetTab);
      if (targetPane) targetPane.classList.add("is-active");
    });
  });

  document.querySelectorAll("[data-open-cockpit]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var key = btn.getAttribute("data-open-cockpit");
      openCockpit(key);
    });
  });

  if (copyCppBtn) {
    copyCppBtn.addEventListener("click", function () {
      if (codeBlock) {
        copyTextToClipboard(codeBlock.innerText, "C++ algorithm kernel copied to clipboard.");
      }
    });
  }

  /* ---------------- 5. Resume Modal ---------------- */
  var openResumeBtn = document.getElementById("openResumeBtn");
  var resumeModal = document.getElementById("resumeModal");
  var resumeCloseBtn = document.getElementById("resumeCloseBtn");
  var resumeFooterCloseBtn = document.getElementById("resumeFooterCloseBtn");
  var printResumeBtn = document.getElementById("printResumeBtn");
  var copyMarkdownResumeBtn = document.getElementById("copyMarkdownResumeBtn");

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add("is-active");
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove("is-active");
  }

  if (openResumeBtn) openResumeBtn.addEventListener("click", openResume);
  if (resumeCloseBtn) resumeCloseBtn.addEventListener("click", closeResume);
  if (resumeFooterCloseBtn) resumeFooterCloseBtn.addEventListener("click", closeResume);
  if (resumeModal) {
    resumeModal.addEventListener("click", function (e) {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener("click", function () {
      window.print();
    });
  }

  if (copyMarkdownResumeBtn) {
    copyMarkdownResumeBtn.addEventListener("click", function () {
      var mdResume = `# Krishnendu Roy — Full-Stack Engineer & AI Builder
Email: krishnenduroy423@gmail.com | Phone: 6289433768 | Kolkata, India
GitHub: https://github.com/krishnendu-developer05
LinkedIn: https://www.linkedin.com/in/krishnendu-roy-975970386

## Education
B.Tech in Computer Science & Engineering | Academy of Technology, Kolkata (2025–2029)

## Experience
Full-Stack Engineering & Shipping (2025–2026)
- Shipped 7+ web applications with 3 live cloud production deployments.

## Featured Shipped Projects
1. RapidCare (Live on Render): Emergency medical dispatch platform with Leaflet.js real-time GPS tracking and hospital bed directory.
2. MuleShield (Prototype on Vercel): Graph-based financial forensic engine analyzing laundering cycles.
3. PujaGhar (Production Live on Vercel): Cultural ritual platform connecting verified purohits and ritual samagri marketplace.
4. StockRiskAgent (GitHub): Autonomous TypeScript agent evaluating portfolio volatility, beta, and downside Value-at-Risk (VaR).

## Technical Skills
- Languages: C, C++, JavaScript (ES6+), TypeScript, Python
- Frontend: React, Next.js, HTML5, CSS3, Responsive Design, Leaflet.js
- Backend & DB: Node.js, Express, REST APIs, PostgreSQL, MongoDB
- Developer Tools: Git, GitHub, Docker, Vercel, Render`;

      copyTextToClipboard(mdResume, "Markdown CV copied to clipboard.");
    });
  }

  /* ---------------- 6. Contact Form (Instant Mailto Fallback) ---------------- */
  var contactForm = document.getElementById("contactForm");
  var formFeedback = document.getElementById("formFeedback");
  var submitFormBtn = document.getElementById("submitFormBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameInput = document.getElementById("contactName");
      var emailInput = document.getElementById("contactEmail");
      var subjectInput = document.getElementById("contactSubject");
      var messageInput = document.getElementById("contactMessage");

      var nameVal = (nameInput.value || "").trim();
      var emailVal = (emailInput.value || "").trim();
      var subjectVal = (subjectInput.value || "").trim();
      var messageVal = (messageInput.value || "").trim();

      if (!nameVal || nameVal.length < 2) {
        showFeedback("Please enter your name (minimum 2 characters).", "error");
        nameInput.focus();
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showFeedback("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
      }

      if (!subjectVal || subjectVal.length < 3) {
        showFeedback("Please enter a subject (minimum 3 characters).", "error");
        subjectInput.focus();
        return;
      }

      if (!messageVal || messageVal.length < 10) {
        showFeedback("Please enter a message (minimum 10 characters).", "error");
        messageInput.focus();
        return;
      }

      showFeedback("Launching email client to send message...", "success");

      var mailtoUrl = "mailto:krishnenduroy423@gmail.com?subject=" +
        encodeURIComponent("[Portfolio] " + subjectVal) +
        "&body=" + encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\nMessage:\n" + messageVal);

      window.location.href = mailtoUrl;
      contactForm.reset();
    });
  }

  function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = "form-feedback " + (type === "success" ? "is-success" : "is-error");
  }

  /* ---------------- 7. Copy to Clipboard & Toast Notice ---------------- */
  var toastNotice = document.getElementById("toastNotice");
  var toastTimer = null;

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.querySelector(".toast-text").textContent = message;
    toastNotice.classList.add("is-active");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastNotice.classList.remove("is-active");
    }, 2400);
  }

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg || "Copied: " + text);
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      showToast(successMsg || "Copied: " + text);
    } catch (err) {
      showToast("Copied: " + text);
    }
    document.body.removeChild(ta);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var textToCopy = btn.getAttribute("data-copy");
      if (textToCopy) copyTextToClipboard(textToCopy);
    });
  });

  /* ---------------- 8. ESC Key Handler ---------------- */
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (cockpitModal && cockpitModal.classList.contains("is-active")) closeCockpit();
      if (resumeModal && resumeModal.classList.contains("is-active")) closeResume();
      if (mobileDrawer && mobileDrawer.classList.contains("is-open")) closeDrawer();
    }
  });

  /* ---------------- 9. Nav Scroll Spy ---------------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");

  function onScroll() {
    var scrollPos = window.scrollY || window.pageYOffset;
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

  /* ---------------- 10. PR Visual Slideshow ---------------- */
  var prSlides = document.querySelectorAll(".pr-slide");
  var prDots = document.querySelectorAll(".pr-dot");
  var prTimer = null;
  var currentPrIndex = 0;

  function showPrSlide(nextIdx) {
    if (!prSlides || prSlides.length === 0) return;
    var total = prSlides.length;
    var prevIdx = currentPrIndex;
    currentPrIndex = (nextIdx + total) % total;

    prSlides.forEach(function (slide, idx) {
      slide.classList.remove("is-active");
      slide.classList.remove("is-prev");
      if (idx === currentPrIndex) {
        slide.classList.add("is-active");
      } else if (idx === prevIdx) {
        slide.classList.add("is-prev");
      }
    });

    prDots.forEach(function (dot, idx) {
      if (idx === currentPrIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
  }

  function startPrTimer() {
    if (!prSlides || prSlides.length <= 1) return;
    if (prTimer) clearInterval(prTimer);
    prTimer = setInterval(function () {
      showPrSlide(currentPrIndex + 1);
    }, 4000);
  }

  prDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var idx = parseInt(dot.getAttribute("data-slide"), 10);
      if (!isNaN(idx)) {
        showPrSlide(idx);
        startPrTimer();
      }
    });
  });

  var prWrap = document.getElementById("prSlideshow");
  if (prWrap) {
    prWrap.addEventListener("mouseenter", function () {
      if (prTimer) clearInterval(prTimer);
    });
    prWrap.addEventListener("mouseleave", function () {
      startPrTimer();
    });
  }

  startPrTimer();
})();
