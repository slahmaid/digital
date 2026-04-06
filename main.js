(function () {
  var THEME_KEY = "framekit-theme";
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      themeBtn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
    }
  }

  if (themeBtn) {
    setTheme(currentTheme());
    themeBtn.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  var nav = document.getElementById("site-nav");
  if (nav) {
    var navTick = function () {
      nav.classList.toggle("nav--scrolled", window.scrollY > 16);
    };
    navTick();
    window.addEventListener("scroll", navTick, { passive: true });
  }

  var toggle = document.querySelector(".nav__toggle");
  var navInner = document.querySelector(".nav__inner");
  var overlay = document.getElementById("nav-overlay");
  var menuCloseBtn = document.getElementById("nav-menu-close");

  function setMenuOpen(open) {
    if (!toggle) return;
    toggle.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (overlay) {
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (menuCloseBtn) {
      menuCloseBtn.setAttribute("aria-hidden", open ? "false" : "true");
      menuCloseBtn.setAttribute("tabindex", open ? "0" : "-1");
    }
  }

  if (toggle && navInner) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!toggle.classList.contains("is-open"));
    });

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener("click", function () {
        setMenuOpen(false);
      });
    }

    if (overlay) {
      overlay.addEventListener("click", function () {
        setMenuOpen(false);
      });
    }

    navInner.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    var els = document.querySelectorAll("[data-reveal]");
    if (els.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
      els.forEach(function (el) {
        io.observe(el);
      });
    } else {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
