/* Atlas Docs — sample documentation behaviour.
   Three client-side pages, searchable navigation, copyable code, a theme switch. */

(function () {
  "use strict";

  var root = document.documentElement;
  var articles = Array.prototype.slice.call(document.querySelectorAll("[data-article]"));
  var sideLinks = Array.prototype.slice.call(document.querySelectorAll("#sideNav a[data-page]"));
  var topLinks = Array.prototype.slice.call(document.querySelectorAll(".topnav a[data-page-link]"));
  var titles = {
    deploy: "Deploy your first app — Atlas Docs",
    install: "Install the CLI — Atlas Docs",
    errors: "Errors — Atlas Docs"
  };
  var order = ["deploy", "install", "errors"];

  /* ---------- Page switching ---------- */

  function showPage(page, options) {
    if (order.indexOf(page) === -1) page = "deploy";
    var settings = options || {};

    articles.forEach(function (article) {
      article.hidden = article.getAttribute("data-article") !== page;
    });

    sideLinks.forEach(function (link) {
      if (link.getAttribute("data-page") === page) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    topLinks.forEach(function (link) {
      if (link.getAttribute("data-page-link") === page) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.title = titles[page] || titles.deploy;

    if (!settings.keepScroll) {
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
  }

  function pageFromHash() {
    var hash = window.location.hash.replace("#", "");
    if (order.indexOf(hash) === -1) {
      /* Section anchors belong to the current page, so ignore them. */
      return null;
    }
    return hash;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-page]");
    if (!link) return;
    showPage(link.getAttribute("data-page"));
    closeNav();
  });

  var initial = pageFromHash();
  showPage(initial || "deploy", { keepScroll: true });

  window.addEventListener("hashchange", function () {
    var page = pageFromHash();
    if (page) showPage(page);
  });

  /* Keep in-page TOC and pager jumps inside the visible article. */
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (order.indexOf(id) !== -1) return;
    var target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });

  /* ---------- Search ---------- */

  var search = document.getElementById("q");
  var noResults = document.getElementById("noResults");
  var noTerm = document.getElementById("noTerm");

  if (search) {
    search.addEventListener("input", function () {
      var term = search.value.trim().toLowerCase();
      var matches = 0;

      sideLinks.forEach(function (link) {
        var visible = !term || link.textContent.toLowerCase().indexOf(term) !== -1;
        link.hidden = !visible;
        if (visible) matches += 1;
      });

      /* Hide a group label when nothing under it is visible. */
      Array.prototype.forEach.call(document.querySelectorAll("#sideNav .group"), function (group) {
        var node = group.nextElementSibling;
        var anyVisible = false;
        while (node && !node.classList.contains("group")) {
          if (node.tagName === "A" && !node.hidden) anyVisible = true;
          node = node.nextElementSibling;
        }
        group.hidden = !anyVisible;
      });

      noResults.hidden = matches !== 0;
      if (noTerm) noTerm.textContent = search.value.trim();
    });
  }

  /* ---------- Copy buttons ---------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-code]"), function (block) {
    var button = block.querySelector(".copy");
    if (!button) return;

    button.addEventListener("click", function () {
      var panels = Array.prototype.slice.call(block.querySelectorAll("pre code"));
      var visible = panels.filter(function (panel) { return !panel.hidden; });
      var text = (visible[0] || panels[0] || { textContent: "" }).textContent;

      function done(label) {
        var original = "Copy";
        button.textContent = label;
        button.classList.add("done");
        setTimeout(function () {
          button.textContent = original;
          button.classList.remove("done");
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { done("Select it"); });
      } else {
        done("Select it");
      }
    });
  });

  /* ---------- Install tabs ---------- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[data-lang]"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var lang = tab.getAttribute("data-lang");
      tabs.forEach(function (other) {
        other.setAttribute("aria-selected", String(other === tab));
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-panel]"), function (panel) {
        panel.hidden = panel.getAttribute("data-panel") !== lang;
      });
    });
  });

  /* ---------- Theme ---------- */

  var themeBtn = document.getElementById("themeBtn");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeLabel() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.querySelector(".sr").textContent = dark ? "Switch to light mode" : "Switch to dark mode";
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#0a0e15" : "#ffffff");
  }

  syncThemeLabel();

  themeBtn.addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") !== "dark";
    if (dark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    try { localStorage.setItem("atlas-theme", dark ? "dark" : "light"); } catch (error) {}
    syncThemeLabel();
  });

  /* ---------- Mobile nav ---------- */

  var navToggle = document.getElementById("navToggle");
  var scrim = document.getElementById("scrim");

  function closeNav() {
    if (!document.body.classList.contains("nav-open")) return;
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.querySelector(".sr").textContent = "Browse docs";
    scrim.hidden = true;
  }

  if (navToggle && scrim) {
    navToggle.addEventListener("click", function () {
      var open = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.querySelector(".sr").textContent = open ? "Close docs navigation" : "Browse docs";
      scrim.hidden = !open;
    });
    scrim.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
    Array.prototype.forEach.call(document.querySelectorAll("#sideNav a"), function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- Helpful votes ---------- */

  Array.prototype.forEach.call(document.querySelectorAll(".helpful"), function (group) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll(".thumb"));
    var thanks = group.querySelector(".thanks");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (other) { other.setAttribute("aria-pressed", String(other === button)); });
        thanks.textContent = button.getAttribute("data-helpful") === "yes"
          ? "Thank you — noted."
          : "Thank you. In a live site this would open a short feedback box.";
      });
    });
  });

  /* ---------- Keyboard access for scrolling tables ---------- */

  var tableWraps = Array.prototype.slice.call(document.querySelectorAll(".table-wrap"));
  tableWraps.forEach(function (wrap) {
    wrap.setAttribute("role", "region");
    var heading = wrap.previousElementSibling;
    var label = heading && /^H[2-4]$/.test(heading.tagName) ? heading.textContent.trim() : "Documentation";
    wrap.setAttribute("aria-label", label + " table");
  });

  function syncTableRegions() {
    tableWraps.forEach(function (wrap) {
      if (wrap.scrollWidth > wrap.clientWidth + 1) {
        wrap.setAttribute("tabindex", "0");
      } else {
        wrap.removeAttribute("tabindex");
      }
    });
  }

  syncTableRegions();
  window.addEventListener("resize", syncTableRegions);
  window.addEventListener("hashchange", syncTableRegions);
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-page]")) window.requestAnimationFrame(syncTableRegions);
  });

  /* Each GitHub Pages deploy is a standalone sample, so there is no gallery to return to. */
  if (location.hostname.endsWith(".github.io")) {
    var galleryLink = document.querySelector(".back-gallery");
    if (galleryLink) galleryLink.remove();
  }
})();
