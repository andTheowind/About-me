const THEME_STORAGE_KEY = "site-theme";
const themeButtons = document.querySelectorAll("[data-theme-toggle]");

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
  } catch (error) {
    // Ignore storage access errors and fall back to the default theme.
  }

  return "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  themeButtons.forEach(function (button) {
    const icon = button.querySelector("i");
    const text = button.querySelector(".theme-toggle__text");
    const nextTheme = theme === "dark" ? "light" : "dark";
    const buttonLabel =
      nextTheme === "light" ? "Светлая тема" : "Тёмная тема";

    button.setAttribute("aria-label", "Переключить тему: " + buttonLabel);

    if (text) {
      text.textContent = buttonLabel;
    }

    if (icon) {
      icon.className = nextTheme === "light" ? "fas fa-sun" : "fas fa-moon";
    }
  });
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || getInitialTheme();
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    // Ignore storage access errors in restricted contexts.
  }
}

applyTheme(document.documentElement.getAttribute("data-theme") || getInitialTheme());

themeButtons.forEach(function (button) {
  button.addEventListener("click", toggleTheme);
});
