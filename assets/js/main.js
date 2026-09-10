/* =============================================================
   alperenkr2.github.io — sayfa etkileşimleri
   1) Tema değiştirici  2) Mobil menü  3) Sticky nav gölgesi
   4) Scroll ile görünürlük animasyonu  5) Aktif menü bağlantısı
   ============================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Tema değiştirici ---------- */
  var themeBtn = document.getElementById("themeBtn");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var yeni = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = yeni;
      themeBtn.setAttribute("aria-label",
        yeni === "dark" ? "Açık temaya geç" : "Koyu temaya geç");
      try {
        localStorage.setItem("tema", yeni);
      } catch (e) { /* localStorage kapalı olabilir */ }
    });
  }

  /* ---------- 2. Mobil menü ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function menuyuKapat() {
    if (!navLinks) return;
    navLinks.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var acik = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(acik));
      navToggle.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) menuyuKapat();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") menuyuKapat();
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) menuyuKapat();
    });
  }

  /* ---------- 3. Sticky nav gölgesi ---------- */
  var nav = document.getElementById("nav");

  function navDurumu() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  }
  navDurumu();
  window.addEventListener("scroll", navDurumu, { passive: true });

  /* ---------- 4. Scroll ile görünürlük ---------- */
  var hedefler = document.querySelectorAll(".reveal, .skill-list");

  if (azHareket || !("IntersectionObserver" in window)) {
    hedefler.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var gozlemci = new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (kayit) {
        if (!kayit.isIntersecting) return;
        kayit.target.classList.add("is-visible");
        gozlemci.unobserve(kayit.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    hedefler.forEach(function (el) { gozlemci.observe(el); });
  }

  /* ---------- 5. Aktif menü bağlantısı ---------- */
  var bolumler = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var menuBaglantilari = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a[href^='#']")
  );

  if (bolumler.length && menuBaglantilari.length && "IntersectionObserver" in window) {
    var bolumGozlemcisi = new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (kayit) {
        if (!kayit.isIntersecting) return;
        var id = kayit.target.id;
        menuBaglantilari.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    bolumler.forEach(function (bolum) { bolumGozlemcisi.observe(bolum); });
  }

  /* ---------- 6. Yıl ---------- */
  var yil = document.getElementById("year");
  if (yil) yil.textContent = new Date().getFullYear();
})();
