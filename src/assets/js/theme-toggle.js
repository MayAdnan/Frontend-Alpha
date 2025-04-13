document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const rootElement = document.documentElement;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    rootElement.classList.add("dark-theme");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDarkTheme = rootElement.classList.toggle("dark-theme");
      localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    });
  }
});
