const mask = document.querySelector(".mask");

window.addEventListener("load", () => {
  if (!mask) {
    return;
  }

  mask.classList.add("hide");

  window.setTimeout(() => {
    mask.remove();
  }, 600);
});
