(function initProjectsPage() {
  const grid = document.querySelector("[data-projects-grid]");
  const searchInput = document.querySelector("[data-projects-search]");
  const tagsContainer = document.querySelector("[data-projects-tags]");
  const sortRoot = document.querySelector("[data-projects-sort]");
  const sortButton = document.querySelector("[data-projects-sort-button]");
  const sortLabel = document.querySelector("[data-projects-sort-label]");
  const sortMenu = document.querySelector("[data-projects-sort-menu]");
  const filtersToggle = document.querySelector("[data-projects-filters-toggle]");
  const filtersLabel = document.querySelector("[data-projects-filters-label]");
  const filtersPanel = document.querySelector("[data-projects-filters-panel]");
  const countElement = document.querySelector("[data-projects-count]");
  const emptyElement = document.querySelector("[data-projects-empty]");

  if (!grid || typeof PROJECTS === "undefined") {
    return;
  }

  const state = {
    search: "",
    tags: new Set(),
    sort: "year-desc",
  };

  const SORT_OPTIONS = {
    "year-desc": { label: "Сначала новые", compare: (a, b) => b.year - a.year },
    "year-asc": { label: "Сначала старые", compare: (a, b) => a.year - b.year },
    "title-asc": { label: "По названию (А–Я)", compare: (a, b) => a.title.localeCompare(b.title, "ru") },
    "title-desc": { label: "По названию (Я–А)", compare: (a, b) => b.title.localeCompare(a.title, "ru") },
    "popularity-desc": { label: "По популярности", compare: (a, b) => b.popularity - a.popularity },
    "difficulty-desc": { label: "По сложности", compare: (a, b) => b.difficulty - a.difficulty },
  };

  const TAG_CLASSES =
    "inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition duration-200";
  const TAG_STYLE = "background: var(--bg-elevated); border-color: var(--border); color: var(--text-muted);";
  const TAG_ACTIVE_STYLE = "background: var(--surface-hover); border-color: var(--accent); color: var(--text);";
  const SORT_OPTION_STYLE = "background: transparent; color: var(--text-muted);";
  const SORT_OPTION_ACTIVE_STYLE = "background: var(--surface-hover); color: var(--text);";
  const FILTER_BUTTON_STYLE = "background: var(--bg-elevated); border-color: var(--border); color: var(--text);";
  const FILTER_BUTTON_ACTIVE_STYLE = "background: var(--surface-hover); border-color: var(--accent); color: var(--text);";

  const getAllTags = () =>
    [...new Set(PROJECTS.flatMap((project) => project.tags))].sort((a, b) =>
      a.localeCompare(b, "ru")
    );

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const pluralizeProjects = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return "проект";
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return "проекта";
    }

    return "проектов";
  };

  const matchesSearch = (project, query) => {
    if (!query) {
      return true;
    }

    return project.title.toLowerCase().includes(query);
  };

  const matchesTags = (project, selectedTags) => {
    if (selectedTags.size === 0) {
      return true;
    }

    return [...selectedTags].every((tag) => project.tags.includes(tag));
  };

  const filterProjects = () => {
    const query = state.search.trim().toLowerCase();
    const sorter = SORT_OPTIONS[state.sort]?.compare;

    return PROJECTS.filter(
      (project) => matchesSearch(project, query) && matchesTags(project, state.tags)
    ).sort(sorter);
  };

  const renderProjectCard = (project) => {
    const codeUrl = project.githubUrl || project.url;
    const codeLabel = project.githubUrl ? "Github" : project.title;

    return `
      <article class="card flex flex-col mb-4" role="listitem">
        <figure class="project-media m-0">
          <a
            href="${escapeHtml(project.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          >
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" />
          </a>
        </figure>
        <div class="project-actions flex flex-col gap-3 px-4 pb-5 pt-6">
          <a
            href="${escapeHtml(project.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-light text-left"
          >
            <i class="fas fa-eye" aria-hidden="true"></i>
            <span>${escapeHtml(project.title)}</span>
          </a>
          <a
            href="${escapeHtml(codeUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-dark text-left"
          >
            <i class="fab fa-github ml-0.5" aria-hidden="true"></i>
            <span>${escapeHtml(codeLabel)}</span>
          </a>
        </div>
      </article>
    `;
  };

  const renderTags = () => {
    if (!tagsContainer) {
      return;
    }

    const allTags = getAllTags();
    const allActive = state.tags.size === 0;

    const chips = allTags
      .map((tag) => {
        const isActive = state.tags.has(tag);

        return `
          <button
            type="button"
            class="${TAG_CLASSES}"
            style="${isActive ? TAG_ACTIVE_STYLE : TAG_STYLE}"
            data-tag="${escapeHtml(tag)}"
            aria-pressed="${isActive}"
          >
            ${escapeHtml(tag)}
          </button>
        `;
      })
      .join("");

    tagsContainer.innerHTML = `
      <button
        type="button"
        class="${TAG_CLASSES}"
        style="${allActive ? TAG_ACTIVE_STYLE : TAG_STYLE}"
        data-tag-all
        aria-pressed="${allActive}"
      >
        Все
      </button>
      ${chips}
    `;
  };

  const render = () => {
    const filtered = filterProjects();
    const total = filtered.length;

    if (countElement) {
      countElement.textContent = `Найдено: ${total} ${pluralizeProjects(total)}`;
    }

    if (emptyElement) {
      emptyElement.hidden = total > 0;
      emptyElement.classList.toggle("hidden", total > 0);
    }

    grid.innerHTML =
      total > 0 ? filtered.map(renderProjectCard).join("") : "";
  };

  const updateTagButtons = () => {
    if (!tagsContainer) {
      return;
    }

    const allActive = state.tags.size === 0;
    const allButton = tagsContainer.querySelector("[data-tag-all]");
    const selectedCount = state.tags.size;

    if (filtersLabel) {
      filtersLabel.textContent =
        selectedCount > 0 ? `Фильтры (${selectedCount})` : "Фильтры";
    }

    if (filtersToggle) {
      filtersToggle.setAttribute(
        "style",
        selectedCount > 0 ? FILTER_BUTTON_ACTIVE_STYLE : FILTER_BUTTON_STYLE
      );
    }

    if (allButton) {
      allButton.setAttribute("style", allActive ? TAG_ACTIVE_STYLE : TAG_STYLE);
      allButton.setAttribute("aria-pressed", String(allActive));
    }

    tagsContainer.querySelectorAll("[data-tag]").forEach((button) => {
      const tag = button.dataset.tag;
      const isActive = state.tags.has(tag);

      button.setAttribute("style", isActive ? TAG_ACTIVE_STYLE : TAG_STYLE);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const setSortMenuState = (isOpen) => {
    if (!sortButton || !sortMenu) {
      return;
    }

    sortMenu.classList.toggle("hidden", !isOpen);
    sortButton.setAttribute("aria-expanded", String(isOpen));

    if (filtersPanel && filtersToggle?.getAttribute("aria-expanded") === "true") {
      filtersPanel.style.maxHeight = `${filtersPanel.scrollHeight}px`;
    }
  };

  const setFiltersPanelState = (isOpen) => {
    if (!filtersToggle || !filtersPanel) {
      return;
    }

    filtersToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      filtersPanel.hidden = false;
      window.requestAnimationFrame(() => {
        filtersPanel.style.maxHeight = `${filtersPanel.scrollHeight}px`;
        filtersPanel.style.opacity = "1";
      });
      return;
    }

    setSortMenuState(false);
    filtersPanel.style.maxHeight = "0";
    filtersPanel.style.opacity = "0";

    window.setTimeout(() => {
      if (filtersToggle.getAttribute("aria-expanded") === "false") {
        filtersPanel.hidden = true;
      }
    }, 300);
  };

  const updateSortOptions = () => {
    if (sortLabel) {
      sortLabel.textContent = SORT_OPTIONS[state.sort].label;
    }

    if (!sortMenu) {
      return;
    }

    sortMenu.querySelectorAll("[data-sort-value]").forEach((button) => {
      const isActive = button.dataset.sortValue === state.sort;

      button.setAttribute(
        "style",
        isActive ? SORT_OPTION_ACTIVE_STYLE : SORT_OPTION_STYLE
      );
      button.setAttribute("aria-selected", String(isActive));
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      render();
    });
  }

  if (tagsContainer) {
    tagsContainer.addEventListener("click", (event) => {
      const allButton = event.target.closest("[data-tag-all]");
      const tagButton = event.target.closest("[data-tag]");

      if (allButton) {
        state.tags.clear();
        updateTagButtons();
        render();
        return;
      }

      if (!tagButton) {
        return;
      }

      const tag = tagButton.dataset.tag;

      if (state.tags.has(tag)) {
        state.tags.delete(tag);
      } else {
        state.tags.add(tag);
      }

      updateTagButtons();
      render();
    });
  }

  if (sortButton) {
    sortButton.addEventListener("click", () => {
      const isOpen = sortButton.getAttribute("aria-expanded") === "true";

      setSortMenuState(!isOpen);
    });
  }

  if (filtersToggle) {
    filtersToggle.addEventListener("click", () => {
      const isOpen = filtersToggle.getAttribute("aria-expanded") === "true";

      setFiltersPanelState(!isOpen);
    });
  }

  if (sortRoot) {
    sortRoot.addEventListener("click", (event) => {
      const option = event.target.closest("[data-sort-value]");

      if (!option) {
        return;
      }

      state.sort = option.dataset.sortValue;
      updateSortOptions();
      setSortMenuState(false);
      render();
    });
  }

  document.addEventListener("click", (event) => {
    if (!sortRoot || sortRoot.contains(event.target)) {
      return;
    }

    setSortMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSortMenuState(false);
      setFiltersPanelState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (
      filtersPanel &&
      filtersToggle?.getAttribute("aria-expanded") === "true"
    ) {
      filtersPanel.style.maxHeight = `${filtersPanel.scrollHeight}px`;
    }
  });

  renderTags();
  updateSortOptions();
  updateTagButtons();
  render();
})();
