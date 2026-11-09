/* Shared interactions; all records and disclosures work without JavaScript. */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const mobileLayout = window.matchMedia("(max-width: 767px)");
  const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeToggle = document.getElementById("theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const storedTheme = () => {
    try {
      return localStorage.getItem("theme");
    } catch (_) {
      return null; /* Storage may be unavailable. */
    }
  };
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeColor?.setAttribute(
      "content",
      theme === "dark" ? "#111b25" : "#faf9f6"
    );
    const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
    themeToggle?.setAttribute("aria-label", label);
    themeToggle?.setAttribute("title", label);
  };
  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
  themeToggle?.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {
      /* Storage may be unavailable. */
    }
  });
  // Follow the system setting until the visitor picks a theme themselves.
  darkScheme.addEventListener("change", (event) => {
    if (!storedTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  const menuToggle = document.getElementById("menu-toggle");
  const navigation = document.getElementById("nav-links");
  const setMenu = (open, restoreFocus = false) => {
    navigation?.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    document.querySelectorAll("main, .footer").forEach((element) => {
      element.toggleAttribute("inert", open);
      if (open) element.setAttribute("aria-hidden", "true");
      else element.removeAttribute("aria-hidden");
    });
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
    if (open) navigation?.querySelector("a")?.focus({ preventScroll: true });
    else if (restoreFocus) menuToggle?.focus();
  };
  menuToggle?.addEventListener("click", () =>
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true")
  );
  document.addEventListener("click", (event) => {
    if (
      document.body.classList.contains("menu-open") &&
      !event.target.closest(".nav-inner")
    ) {
      setMenu(false, true);
    }
  });
  navigation
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (event.key === "Escape") setMenu(false, true);
    if (event.key !== "Tab") return;
    const controls = [
      ...document.querySelectorAll(".nav-links a, .theme-toggle, .menu-toggle"),
    ];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  mobileLayout.addEventListener("change", (event) => {
    if (!event.matches) setMenu(false);
  });

  const biography = document.querySelector(".hero-bio-more");
  if (biography) {
    biography.open = !mobileLayout.matches;
    mobileLayout.addEventListener("change", (event) => {
      biography.open = !event.matches;
    });
  }

  // Publication figures sit beside each record on wide screens and fold
  // into its row of links as a collapsed disclosure on phones (on both the
  // Publications page and the homepage's selected papers).
  const figurePanels = [...document.querySelectorAll(".pub-figure")];
  const figureToggle = document.getElementById("figure-toggle");
  if (figurePanels.length) {
    const figurePositions = figurePanels.map((panel) => ({
      panel,
      row: panel.parentElement,
      actions: panel.parentElement.querySelector(".pub-actions, .paper-links"),
    }));
    const hasClosedPanel = () => figurePanels.some((panel) => !panel.open);
    const updateFigureToggle = () => {
      figureToggle.textContent = hasClosedPanel()
        ? figureToggle.dataset.expandLabel
        : figureToggle.dataset.collapseLabel;
    };
    const setPanelsOpen = (open) => {
      figurePanels.forEach((panel) => (panel.open = open));
    };
    const applyPanelLayout = () => {
      setPanelsOpen(!mobileLayout.matches);
      figurePositions.forEach(({ panel, row, actions }) => {
        (mobileLayout.matches ? actions : row).append(panel);
      });
      if (figureToggle) {
        figureToggle.hidden = !mobileLayout.matches;
        updateFigureToggle();
      }
    };
    if (figureToggle) {
      figureToggle.addEventListener("click", () => {
        setPanelsOpen(hasClosedPanel());
        updateFigureToggle();
      });
      figurePanels.forEach((panel) =>
        panel.addEventListener("toggle", updateFigureToggle)
      );
    }
    applyPanelLayout();
    mobileLayout.addEventListener("change", applyPanelLayout);
  }

  // The homepage news box shows its latest items and scrolls to the rest.
  // It ends partway into the next item, so that item peeks out as a cue.
  // Phones skip the inner scroll: they list the latest items, then a link.
  const newsScroll = document.querySelector(".news-scroll");
  const newsItems = newsScroll?.querySelectorAll(".news-item") ?? [];
  const newsShown = Number(newsScroll?.dataset.visible) || 4;
  if (newsItems.length > newsShown) {
    const fitNews = () => {
      if (mobileLayout.matches) {
        newsScroll.style.removeProperty("max-height");
        newsScroll.removeAttribute("tabindex");
        return;
      }
      newsScroll.tabIndex = 0;
      const next = newsItems[newsShown];
      const style = getComputedStyle(next);
      const line =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.7;
      const peek = parseFloat(style.paddingTop) + line * 0.75;
      newsScroll.style.maxHeight = `${next.offsetTop + peek}px`;
    };
    fitNews();
    new ResizeObserver(fitNews).observe(
      newsScroll.querySelector(".news-list")
    );
    mobileLayout.addEventListener("change", fitNews);
  }

  // A link to a disclosure, or to something inside one, opens it so the
  // linked content shows; a link to a research card opens its details.
  const openLinkedTarget = () => {
    const target = document.getElementById(window.location.hash.slice(1));
    const disclosure =
      target?.closest("details") ||
      target?.querySelector(":scope > .research-more");
    if (!disclosure || disclosure.open) return;
    disclosure.open = true;
    (target.closest(".pub-item") || target).scrollIntoView();
  };
  openLinkedTarget();
  window.addEventListener("hashchange", openLinkedTarget);

  // Preserve bookmarks to records that moved off the homepage.
  if (document.body.dataset.page === "home") {
    const destinations = {
      services: "service/",
      activities: "service/#activities",
    };
    const destination = destinations[window.location.hash.slice(1)];
    if (destination) window.location.replace(destination);
  }

  const search = document.getElementById("pub-search-input");
  if (search) {
    const clear = document.getElementById("pub-search-clear");
    const buttons = [
      ...document.querySelectorAll(".pub-filters .pub-filter-btn"),
    ];
    const items = [...document.querySelectorAll(".pub-item")];
    const groups = [...document.querySelectorAll(".pub-group")];
    const status = document.getElementById("pub-results");
    const empty = document.getElementById("pub-empty");
    const params = new URLSearchParams(window.location.search);
    const validFilters = buttons.map((button) => button.dataset.filter);
    let filter = validFilters.includes(params.get("type"))
      ? params.get("type")
      : "all";
    search.value = params.get("q") || "";
    const normalize = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const matchesType = (item, type) =>
      type === "all" || item.dataset.type === type;
    const searchable = new Map(
      items.map((item) => [
        item,
        normalize(
          [
            item.querySelector(".pub-title")?.textContent,
            item.querySelector(".pub-authors")?.textContent,
            item.querySelector(".paper-badges")?.textContent,
            item.dataset.topics,
            item.querySelector(".pub-year")?.textContent,
          ].join(" ")
        ),
      ])
    );
    buttons.forEach((button) => {
      const count = document.createElement("span");
      count.className = "pub-count";
      count.setAttribute("aria-hidden", "true");
      count.textContent = items.filter((item) =>
        matchesType(item, button.dataset.filter)
      ).length;
      button.append(count);
    });
    const update = (updateURL = true) => {
      const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
      let visible = 0;
      items.forEach((item) => {
        const match =
          matchesType(item, filter) &&
          words.every((word) => searchable.get(item).includes(word));
        item.hidden = !match;
        if (match) visible++;
      });
      buttons.forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.filter === filter)
        )
      );
      groups.forEach((group) => {
        group.hidden = ![...group.querySelectorAll(".pub-item")].some(
          (item) => !item.hidden
        );
      });
      clear.hidden = search.value.length === 0;
      status.textContent = `Showing ${visible} of ${items.length} publications`;
      empty.hidden = visible > 0;
      if (updateURL) {
        const url = new URL(window.location.href);
        if (search.value.trim()) url.searchParams.set("q", search.value.trim());
        else url.searchParams.delete("q");
        if (filter !== "all") url.searchParams.set("type", filter);
        else url.searchParams.delete("type");
        window.history.replaceState(null, "", url);
      }
    };
    search.addEventListener("input", () => update());
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        filter = button.dataset.filter;
        update();
      })
    );
    clear.addEventListener("click", () => {
      search.value = "";
      update();
      search.focus();
    });
    document.getElementById("pub-reset")?.addEventListener("click", () => {
      filter = "all";
      search.value = "";
      update();
      search.focus();
    });
    update(false);
  }

  document.querySelectorAll(".copy-bibtex").forEach((button) => {
    button.addEventListener("click", async () => {
      const panel = button.closest(".citation-panel");
      const code = panel.querySelector("code");
      const message = panel.querySelector(".copy-message");
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        message.textContent = "Citation copied to clipboard.";
        setTimeout(() => {
          button.textContent = "Copy BibTeX";
          message.textContent = "";
        }, 2500);
      } catch (_) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        message.textContent =
          "Citation selected. Use your keyboard to copy it.";
      }
    });
  });

  // Tell screen-reader users which links open a new tab (the icons are
  // hidden). Runs last so the hint never enters the publication search index.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const label = link.getAttribute("aria-label");
    if (label) {
      if (!/new tab/i.test(label))
        link.setAttribute("aria-label", `${label} (opens in a new tab)`);
    } else if (!link.querySelector(".new-tab-hint")) {
      const hint = document.createElement("span");
      hint.className = "sr-only new-tab-hint";
      hint.textContent = " (opens in a new tab)";
      link.append(hint);
    }
  });
});
