(function () {
  var THEME_KEY = "framekit-theme";
  var NEWSLETTER_KEY = "framekit-newsletter-seen";
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var newsletterModal = document.getElementById("newsletter-modal");
  var newsletterOverlay = document.getElementById("newsletter-overlay");
  var newsletterClose = document.getElementById("newsletter-close");
  var newsletterForm = document.getElementById("newsletter-form");
  var newsletterEmail = document.getElementById("newsletter-email");

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

  function markNewsletterSeen() {
    try {
      localStorage.setItem(NEWSLETTER_KEY, "1");
    } catch (e) {}
  }

  function closeNewsletter() {
    if (!newsletterModal || !newsletterOverlay) return;
    newsletterModal.classList.remove("is-open");
    newsletterOverlay.classList.remove("is-open");
    newsletterModal.setAttribute("aria-hidden", "true");
    newsletterOverlay.setAttribute("aria-hidden", "true");
    markNewsletterSeen();
    updateStickyCta();
  }

  function openNewsletter() {
    if (!newsletterModal || !newsletterOverlay) return;
    newsletterModal.classList.add("is-open");
    newsletterOverlay.classList.add("is-open");
    newsletterModal.setAttribute("aria-hidden", "false");
    newsletterOverlay.setAttribute("aria-hidden", "false");
    if (newsletterEmail) {
      newsletterEmail.focus();
    }
    updateStickyCta();
  }

  if (newsletterModal && newsletterOverlay) {
    var seen = false;
    try {
      seen = localStorage.getItem(NEWSLETTER_KEY) === "1";
    } catch (e) {}

    if (!seen) {
      window.setTimeout(openNewsletter, 3000);
    }

    if (newsletterClose) {
      newsletterClose.addEventListener("click", closeNewsletter);
    }

    newsletterOverlay.addEventListener("click", closeNewsletter);

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        closeNewsletter();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && newsletterModal.classList.contains("is-open")) {
        closeNewsletter();
      }
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
    updateStickyCta();
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

  var stickyCta = document.getElementById("mobile-sticky-cta");
  var pricingSection = document.getElementById("pricing");
  var finalCtaSection = document.querySelector(".cta-final");
  var footer = document.querySelector(".footer");
  var stickyHiddenByContext = false;

  function isMobileViewport() {
    return window.matchMedia("(max-width: 899px)").matches;
  }

  function updateStickyCta() {
    if (!stickyCta) return;

    var blocked =
      !isMobileViewport() ||
      document.body.classList.contains("menu-open") ||
      (newsletterModal && newsletterModal.classList.contains("is-open")) ||
      stickyHiddenByContext;

    stickyCta.classList.toggle("is-visible", !blocked);
    stickyCta.setAttribute("aria-hidden", blocked ? "true" : "false");
    document.body.classList.toggle("has-mobile-sticky-cta", !blocked);
  }

  if (stickyCta) {
    var observerTargets = [pricingSection, finalCtaSection, footer].filter(Boolean);
    if ("IntersectionObserver" in window && observerTargets.length) {
      var stickyObserver = new IntersectionObserver(
        function (entries) {
          stickyHiddenByContext = entries.some(function (entry) {
            return entry.isIntersecting;
          });
          updateStickyCta();
        },
        { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
      );
      observerTargets.forEach(function (el) {
        stickyObserver.observe(el);
      });
    }

    window.addEventListener("resize", updateStickyCta, { passive: true });
    window.addEventListener("orientationchange", updateStickyCta, { passive: true });
    updateStickyCta();
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
