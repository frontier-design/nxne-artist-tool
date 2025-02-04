document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  if (!container) {
    console.error("No element with class 'container' found.");
    return;
  }

  const toggleWrapper = container.querySelector(".toggle-wrapper");

  if (toggleWrapper) {
    if (getComputedStyle(toggleWrapper).position === "static") {
      toggleWrapper.style.position = "relative";
    }
  } else {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
  }

  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "↑";
  toggleBtn.id = "toggleContainerBtn";

  toggleBtn.style.zIndex = "1";

  if (toggleWrapper) {
    toggleWrapper.appendChild(toggleBtn);
  } else {
    container.appendChild(toggleBtn);
  }

  toggleBtn.addEventListener("click", function () {
    container.classList.toggle("collapsed");
    if (container.classList.contains("collapsed")) {
      toggleBtn.innerText = "↓";
    } else {
      toggleBtn.innerText = "↑";
    }
  });
});
