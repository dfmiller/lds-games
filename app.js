(() => {
  "use strict";

  const INTERVAL = 6000; // ms each app stays on screen while autoplay runs
  const SWIPE_DISTANCE = 50; // px

  const root = document.getElementById("carousel");
  const header = document.querySelector(".bar");
  const viewport = document.getElementById("viewport");
  const dotsEl = root.querySelector(".dots");
  const statusEl = document.getElementById("status");
  const prevBtn = root.querySelector(".arrow.prev");
  const nextBtn = root.querySelector(".arrow.next");

  const count = APPS.length;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const baseTitle = document.title;

  // The URL hash uses each app's slug: "#tally" shows that slide, "#tally/open" opens the app.
  // The slug comes from the name unless an app sets its own `slug` in apps.js.
  const slugOf = (app) =>
    app.slug || app.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const slugs = APPS.map(slugOf);

  document.documentElement.style.setProperty("--interval", INTERVAL + "ms");

  const SVG_NS = "http://www.w3.org/2000/svg";
  const CHEVRON_LEFT = "M15 5l-7 7 7 7";
  const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  const EXTERNAL = "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5";

  function el(tag, props, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props || {})) {
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value);
    }
    for (const child of children) if (child) node.append(child);
    return node;
  }

  function icon(pathData, size = 18) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2.2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
    return svg;
  }

  function starIcon(filled, size) {
    const svg = icon(STAR, size);
    if (filled) svg.firstChild.setAttribute("fill", "currentColor");
    return svg;
  }

  // ---------- Build slides and dots ----------

  const slides = APPS.map((app, i) => {
    const slide = el("article", {
      class: "slide",
      role: "group",
      "aria-roledescription": "slide",
      "aria-label": `${i + 1} of ${count}: ${app.name}`
    });
    slide.style.setProperty("--bg", app.background);
    slide.style.setProperty("--accent", app.accent);

    const img = el("img", {
      class: "slide__img",
      src: app.image,
      alt: app.imageAlt || "",
      decoding: "async",
      loading: i === 0 ? "eager" : "lazy"
    });

    // A normal link, so right-click and ctrl/cmd-click still work.
    // A plain click opens the app inside this page instead.
    const cta = el("a", { class: "cta", href: app.url, text: app.cta || `Open ${app.name}` });
    cta.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openApp(i);
    });

    const copy = el(
      "div",
      { class: "slide__copy" },
      el("h2", { class: "slide__name", text: app.name }),
      el("p", { class: "slide__tagline", text: app.tagline }),
      app.description ? el("p", { class: "slide__text", text: app.description }) : null,
      cta
    );

    slide.append(img, copy);
    viewport.append(slide);
    return slide;
  });

  // ---------- Mosaic of tiles ----------

  const page = document.querySelector(".page");
  const footer = document.getElementById("footer");
  const largeScreen = window.matchMedia("(min-width: 1100px)");
  const yearEl = document.getElementById("year");
  const isExcluded = localStorage.getItem('va-disable') === '1';
  yearEl.textContent = `${new Date().getFullYear()}${isExcluded ? ' - ' : ''}`;
  yearEl.ondblclick = () => {
    localStorage.setItem('va-disable','1')
  }
  const mosaicGrid = document.getElementById("mosaicGrid");

  const tiles = APPS.map((app, i) => {
    const tile = el("a", { class: "tile", href: app.url });
    tile.style.setProperty("--bg", app.background);
    tile.style.setProperty("--accent", app.accent);
    tile.append(
      el("img", { class: "tile__img", src: app.image, alt: "", decoding: "async", loading: "lazy" }),
      el(
        "div",
        { class: "tile__copy" },
        el("h3", { class: "tile__name", text: app.name }),
        el("p", { class: "tile__tagline", text: app.tagline })
      )
    );
    tile.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openApp(i);
    });
    mosaicGrid.append(tile);
    return tile;
  });

  // ---------- Search: filters the tiles as the person types ----------

  const searchInput = document.getElementById("gameSearch");
  const emptyEl = document.getElementById("mosaicEmpty");
  const searchStatus = document.getElementById("searchStatus");
  const haystacks = APPS.map((app) =>
    [app.name, app.tagline, app.description, app.tags.join(" ")].filter(Boolean).join(" ").toLowerCase()
  );

  function filterTiles() {
    const terms = searchInput.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    tiles.forEach((tile, i) => {
      const match = terms.every((term) => haystacks[i].includes(term));
      tile.hidden = !match;
      if (match) shown++;
    });
    emptyEl.hidden = shown > 0;
    searchStatus.textContent = terms.length ? `${shown} ${shown === 1 ? "game" : "games"} found` : "";
  }

  searchInput.addEventListener("input", filterTiles);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      event.stopPropagation();
      searchInput.value = "";
      filterTiles();
    }
  });

  // ---------- Favorites (kept in this browser) ----------

  const FAV_KEY = "pwf-favorites";
  const favsEl = document.getElementById("favs");
  const favsList = document.getElementById("favsList");

  function loadFavs() {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY));
      return Array.isArray(saved) ? saved.filter((slug) => slugs.includes(slug)) : [];
    } catch (error) {
      return [];
    }
  }

  let favorites = loadFavs();

  function saveFavs() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch (error) {
      // Storage can be blocked; favorites then last only until the page closes.
    }
  }

  const isFav = (index) => favorites.includes(slugs[index]);

  function toggleFav(index) {
    const slug = slugs[index];
    favorites = isFav(index) ? favorites.filter((s) => s !== slug) : [...favorites, slug];
    saveFavs();
    renderFavs();
  }

  function renderFavs() {
    favsList.replaceChildren();
    favorites.forEach((slug) => {
      const index = slugs.indexOf(slug);
      const app = APPS[index];
      const chip = el("a", { class: "fav", href: "#" + slug + "/open" });
      chip.style.setProperty("--accent", app.accent);
      chip.append(starIcon(true, 16), document.createTextNode(app.name));
      chip.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openApp(index);
      });
      favsList.append(chip);
    });
    favsEl.hidden = favorites.length === 0;
    refreshHero();
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== FAV_KEY) return;
    favorites = loadFavs();
    renderFavs();
    if (isViewerOpen()) updateFavButton(Number(viewerEl.dataset.index));
  });

  const dots = APPS.map((app, i) => {
    const dot = el("button", {
      class: "dot",
      type: "button",
      "aria-label": `Show ${app.name}, ${i + 1} of ${count}`
    });
    dot.addEventListener("click", () => userGo(i));
    dotsEl.append(dot);
    return dot;
  });

  if (count < 2) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    dotsEl.hidden = true;
  }

  // ---------- Showing a slide ----------

  let current = 0;

  // Favorites have their own links at the top, so the hero shows only the other apps
  // (or every app, if all of them are favorites).
  function heroList() {
    const all = APPS.map((_, i) => i);
    const others = all.filter((i) => !isFav(i));
    return others.length ? others : all;
  }

  // The app index of the slide `delta` steps from the current one, skipping favorites.
  function neighbor(delta) {
    const list = heroList();
    const pos = Math.max(0, list.indexOf(current));
    return list[(pos + delta + list.length) % list.length];
  }

  function show(index) {
    const list = heroList();
    if (list.includes(index)) current = index;
    else if (!list.includes(current)) current = list[0];
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.inert = !active; // keeps hidden slides out of the tab order and screen readers
    });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  // Brings the slides, dots and arrows in line with the current favorites.
  function refreshHero() {
    const list = heroList();
    slides.forEach((slide, i) => {
      if (list.includes(i)) {
        slide.setAttribute("aria-label", `${list.indexOf(i) + 1} of ${list.length}: ${APPS[i].name}`);
      }
    });
    dots.forEach((dot, i) => {
      dot.hidden = !list.includes(i);
      dot.setAttribute("aria-label", `Show ${APPS[i].name}, ${list.indexOf(i) + 1} of ${list.length}`);
    });
    const several = list.length > 1;
    prevBtn.hidden = !several;
    nextBtn.hidden = !several;
    dotsEl.hidden = !several;
    show(current);
  }

  // ---------- Autoplay: runs until the person interacts ----------

  let autoplay = count > 1 && !reduceMotion.matches;
  let timer = null;

  function restartFill() {
    dotsEl.classList.remove("auto");
    void dotsEl.offsetWidth; // restart the CSS animation
    dotsEl.classList.add("auto");
  }

  function schedule() {
    clearTimeout(timer);
    if (!autoplay || document.hidden) return;
    restartFill();
    timer = setTimeout(() => {
      show(neighbor(1));
      schedule();
    }, INTERVAL);
  }

  function stopAutoplay() {
    if (!autoplay) return;
    autoplay = false;
    clearTimeout(timer);
    dotsEl.classList.remove("auto");
  }

  document.addEventListener("visibilitychange", () => {
    if (!autoplay) return;
    if (document.hidden) clearTimeout(timer);
    else schedule();
  });

  // ---------- App viewer (the app opens in an iframe on this page) ----------

  let viewerEl = null;
  let viewerTitle = null;
  let viewerLoading = null;
  let viewerBody = null;
  let viewerStage = null;
  let viewerFavBtn = null;

  function buildViewer() {
    const closeBtn = el("button", { class: "viewer__close", type: "button" });
    closeBtn.append(icon(CHEVRON_LEFT, 20), el("span", {}, document.createTextNode("All apps")));
    closeBtn.addEventListener("click", closeFromUI);

    viewerFavBtn = el("button", { class: "viewer__fav", type: "button" });
    viewerFavBtn.addEventListener("click", () => {
      const index = Number(viewerEl.dataset.index);
      toggleFav(index);
      updateFavButton(index);
    });

    viewerTitle = el("h2", { class: "viewer__title", id: "viewer-title" });
    viewerLoading = el("p", { class: "viewer__loading" });
    viewerStage = el("div", { class: "viewer__stage" }, viewerLoading);
    viewerBody = el("div", { class: "viewer__body" }, viewerStage);
    
    viewerEl = el(
      "div",
      {
        class: "viewer",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "viewer-title",
        hidden: ""
      },
      el("div", { class: "viewer__bar" }, closeBtn, viewerTitle, viewerFavBtn),
      viewerBody
    );
    document.body.append(viewerEl);
  }

  function updateFavButton(index) {
    const fav = isFav(index);
    const name = APPS[index].name;
    viewerFavBtn.classList.toggle("is-on", fav);
    viewerFavBtn.setAttribute("aria-pressed", String(fav));
    viewerFavBtn.setAttribute("aria-label", fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`);
    viewerFavBtn.replaceChildren(starIcon(fav, 24));
  }

  function isViewerOpen() {
    return Boolean(viewerEl) && !viewerEl.hidden;
  }

  function openViewer(index) {
    if (isViewerOpen() && viewerEl.dataset.index === String(index)) return;
    if (!viewerEl) buildViewer();

    const app = APPS[index];
    viewerEl.dataset.index = String(index);
    viewerEl.style.setProperty("--bg", app.background);
    viewerEl.style.setProperty("--accent", app.accent);
    viewerEl.classList.remove("is-loaded");
    viewerTitle.textContent = app.name;
    viewerLoading.textContent = `Loading ${app.name}…`;
    updateFavButton(index);

    // A fresh iframe each time keeps the browser's Back button from stepping through old frame history.
    // The sandbox lets the app run normally but stops it from navigating this whole page away.
    viewerStage.querySelector(".viewer__frame")?.remove();
    const frame = el("iframe", {
      class: "viewer__frame",
      title: app.name,
      src: app.url,
      sandbox:
        "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads",
      allow: "fullscreen; clipboard-write",
      referrerpolicy: "strict-origin-when-cross-origin"
    });
    frame.addEventListener("load", () => viewerEl.classList.add("is-loaded"));
    viewerStage.append(frame);

    viewerEl.hidden = false;
    root.inert = true;
    page.inert = true;
    favsEl.inert = true;
    header.inert = true;
    footer.hidden = !largeScreen.matches; // large screens keep the footer under the app
    document.documentElement.classList.add("viewer-open");
    document.title = `${app.name} – ${baseTitle}`;
    viewerEl.querySelector(".viewer__close").focus();
  }

  function closeViewer() {
    if (!isViewerOpen()) return;
    viewerEl.hidden = true;
    viewerStage.querySelector(".viewer__frame")?.remove();
    root.inert = false;
    page.inert = false;
    favsEl.inert = false;
    header.inert = false;
    footer.hidden = false;
    document.documentElement.classList.remove("viewer-open");
    document.title = baseTitle;
    slides[current].querySelector(".cta")?.focus({ preventScroll: true });
  }

  // ---------- URL hash: "#tally" selects a slide, "#tally/open" opens the app ----------

  function parseHash() {
    let slug = "";
    let view = "";
    try {
      [slug, view] = decodeURIComponent(location.hash.slice(1)).split("/");
    } catch (error) {
      // A malformed hash is treated as no hash.
    }
    const index = slugs.indexOf(slug);
    return { index, open: index >= 0 && view === "open" };
  }

  // Makes the page match the hash. Runs on load and whenever the hash changes (Back, Forward, edits).
  function route() {
    const { index, open } = parseHash();
    if (index >= 0) {
      stopAutoplay(); // a hash means the person already picked an app
      show(index);
    }
    if (open) openViewer(index);
    else closeViewer();
  }

  // Slide changes replace the current history entry so browsing the carousel doesn't fill the Back button.
  function setHash(hash) {
    history.replaceState(null, "", "#" + hash);
  }

  function openApp(index) {
    stopAutoplay();
    // Opening an app adds a history entry, so Back returns to the carousel.
    history.pushState(null, "", "#" + slugs[index] + "/open");
    route();
  }

  function closeFromUI() {
    const index = Number(viewerEl.dataset.index);
    // A favorite isn't in the hero, so the hash then names the slide that is showing.
    setHash(slugs[heroList().includes(index) ? index : current]);
    route();
  }

  window.addEventListener("hashchange", route);
  largeScreen.addEventListener("change", () => {
    if (isViewerOpen()) footer.hidden = !largeScreen.matches;
  });

  // ---------- Interaction ----------

  function userGo(index) {
    stopAutoplay();
    show(index);
    setHash(slugs[current]);
    const list = heroList();
    statusEl.textContent = `Showing ${APPS[current].name}, ${list.indexOf(current) + 1} of ${list.length}`;
  }

  prevBtn.addEventListener("click", () => userGo(neighbor(-1)));
  nextBtn.addEventListener("click", () => userGo(neighbor(1)));

  // Keyboard focus anywhere in the carousel also counts as interaction.
  root.addEventListener("focusin", stopAutoplay);

  document.addEventListener("keydown", (event) => {
    if (isViewerOpen()) {
      if (event.key === "Escape") closeFromUI();
      return;
    }
    if (event.target instanceof HTMLInputElement) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft") userGo(neighbor(-1));
    else if (event.key === "ArrowRight") userGo(neighbor(1));
  });

  // Swipe on touch and pen
  let startX = 0;
  let startY = 0;
  let tracking = false;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    tracking = true;
    startX = event.clientX;
    startY = event.clientY;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (!tracking) return;
    tracking = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      userGo(neighbor(dx < 0 ? 1 : -1));
    }
  });

  viewport.addEventListener("pointercancel", () => { tracking = false; });

  // ---------- Start ----------

  show(0);
  route(); // picks up a slide or open app from the URL hash, and turns autoplay off if there is one
  if (autoplay) schedule();

  // ---------- Header background once the hero scrolls away ----------

  function updateHeader() {
    // The header floats over the hero until the page starts to scroll.
    header.classList.toggle("is-scrolled", window.scrollY > 4);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader);
  updateHeader();
  renderFavs();

  // ---------- Install ----------

  const installBtn = document.getElementById("install");
  let installPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBtn.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installBtn.hidden = true;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();