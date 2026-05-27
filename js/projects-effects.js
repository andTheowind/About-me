const projectsCanvas = document.querySelector(".projects-bg-canvas");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function setupCanvasBackground() {
  if (!projectsCanvas || prefersReducedMotion) {
    return;
  }

  const context = projectsCanvas.getContext("2d");

  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let animationFrameId = 0;
  let palette = [];
  let pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.35,
  };

  const particles = new Array(16).fill(null).map(function (_, index) {
    return {
      x: Math.random(),
      y: Math.random(),
      radius: 90 + Math.random() * 170,
      speed: 0.0007 + Math.random() * 0.0014,
      offset: Math.random() * Math.PI * 2,
      drift: 20 + Math.random() * 40,
      depth: 0.25 + (index % 4) * 0.18,
    };
  });

  function updatePalette() {
    const theme = document.documentElement.getAttribute("data-theme");

    if (theme === "light") {
      palette = [
        "111,99,246",
        "17,183,170",
        "128,163,255",
      ];
      return;
    }

    palette = [
      "124,108,245",
      "61,214,199",
      "92,102,255",
    ];
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    width = window.innerWidth;
    height = window.innerHeight;
    projectsCanvas.width = Math.floor(width * dpr);
    projectsCanvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawBackground() {
    const theme = document.documentElement.getAttribute("data-theme");
    const backgroundGradient = context.createLinearGradient(0, 0, width, height);

    if (theme === "light") {
      backgroundGradient.addColorStop(0, "rgba(244, 247, 252, 0.86)");
      backgroundGradient.addColorStop(1, "rgba(226, 235, 247, 0.68)");
    } else {
      backgroundGradient.addColorStop(0, "rgba(7, 8, 13, 0.92)");
      backgroundGradient.addColorStop(1, "rgba(12, 14, 24, 0.7)");
    }

    context.clearRect(0, 0, width, height);
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, width, height);
  }

  function renderFrame(time) {
    drawBackground();

    particles.forEach(function (particle, index) {
      const angle = time * particle.speed + particle.offset;
      const x =
        particle.x * width +
        Math.sin(angle) * particle.drift +
        (pointer.x - width / 2) * 0.015 * particle.depth;
      const y =
        particle.y * height +
        Math.cos(angle * 1.2) * particle.drift +
        (pointer.y - height / 2) * 0.015 * particle.depth;
      const radius = particle.radius + Math.sin(angle * 0.8) * 18;
      const color = palette[index % palette.length];
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

      gradient.addColorStop(0, "rgba(" + color + ", 0.22)");
      gradient.addColorStop(0.45, "rgba(" + color + ", 0.1)");
      gradient.addColorStop(1, "rgba(" + color + ", 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    });

    animationFrameId = window.requestAnimationFrame(renderFrame);
  }

  updatePalette();
  resizeCanvas();
  renderFrame(0);

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", function (event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  const observer = new MutationObserver(function () {
    updatePalette();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  window.addEventListener("beforeunload", function () {
    observer.disconnect();
    window.cancelAnimationFrame(animationFrameId);
  });
}

setupCanvasBackground();
