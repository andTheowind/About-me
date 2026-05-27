const openButton = document.querySelector("#openBtn");
const closeButton = document.querySelector("#closeBtn");
const wrapper = document.querySelector(".wrapper");
const circleContainer = document.querySelector(".circle-container");
const menuItems = [...document.querySelectorAll("nav > ul li")];
const menuOffsets = ["-100%", "-125%", "-150%"];

const setMenuState = (isOpen) => {
  if (!wrapper) {
    return;
  }

  document.body.classList.toggle("menu-open", isOpen);
  wrapper.classList.toggle("show-nav", isOpen);

  menuItems.forEach((item, index) => {
    item.style.transform = isOpen ? "translateX(0%)" : `translateX(${menuOffsets[index] || "-100%"})`;
  });
};

if (
  circleContainer &&
  circleContainer.parentElement !== document.body
) {
  document.body.appendChild(circleContainer);
}

if (openButton && closeButton && wrapper && menuItems.length >= 3) {
  openButton.addEventListener("click", () => setMenuState(true));
  closeButton.addEventListener("click", () => setMenuState(false));
}
