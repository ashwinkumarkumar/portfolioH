// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
  } else {
    nav.style.boxShadow = "none";
  }
});

// Ring Animation Background
window.addEventListener("load", () => {
  const container = document.getElementById("ring-container");

            // Configuration
            const NUM_RINGS = 14;
            const BASE_SIZE = 2800;
            const MIN_SIZE = 300;

            // Localized Ripple Movement Configuration
            const MAX_SHIFT = 33;
            const INFLUENCE_RADIUS = 150;

            // Color Gradient Configuration (beige tones)
            const START_HUE = 30; // Beige hue
            const START_SATURATION = 20; // Low saturation for beige
            const START_LIGHTNESS = 95; // Lighter start for outer rings
            const LIGHTNESS_STEP = 2.5; // Darker inner rings

  // Dynamic Ring Creation and Styling
  const ringsData = [];
  for (let i = 0; i < NUM_RINGS; i++) {
    const ring = document.createElement("div");
    ring.classList.add("ring");

    // Geometric progression: Size_{i+1} = Size_i * 1.05 + Constant
    // We calculate Constant (X) to ensure we hit exactly BASE_SIZE at the end.
    // Formula: S_n = S_0 * r^n + X * (r^n - 1) / (r - 1)
    const r = 1.05; // 5% growth
    const n = NUM_RINGS - 1;
    const r_n = Math.pow(r, n);
    const gapConstant = (BASE_SIZE - MIN_SIZE * r_n) * (r - 1) / (r_n - 1);
    
    // j is the index starting from the center (0 = inner, n = outer)
    const j = NUM_RINGS - 1 - i;
    const r_j = Math.pow(r, j);
    const size = MIN_SIZE * r_j + gapConstant * (r_j - 1) / (r - 1);
    const lightness = START_LIGHTNESS - i * LIGHTNESS_STEP;
    const color = `hsl(${START_HUE}, ${START_SATURATION}%, ${lightness}%)`;

    ring.style.width = `${size}px`;
    ring.style.height = `${size}px`;
    ring.style.backgroundColor = color;

    ring.dataset.depth = i;

    container.appendChild(ring);

    ringsData.push({ element: ring, radius: size / 2 });
  }

  const rings = document.querySelectorAll(".ring");
  let ringsCenterX = 0;
  let ringsCenterY = 0;

  function updateRingPositions() {
    const h1 = document.querySelector(".hero-text h1");
    if (h1) {
      const h1Rect = h1.getBoundingClientRect();
      ringsCenterX = h1Rect.left + h1Rect.width / 2;
      ringsCenterY = h1Rect.top + h1Rect.height / 2;

      rings.forEach((ring) => {
        ring.style.top = `${ringsCenterY}px`;
        ring.style.left = `${ringsCenterX}px`;
      });
    }
  }

  updateRingPositions();
  window.addEventListener("resize", updateRingPositions);

  // Localized Ripple Effect on Mouse Movement
  document.addEventListener("mousemove", (e) => {
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    const directionX = cursorX - ringsCenterX;
    const directionY = cursorY - ringsCenterY;

    const magnitude = Math.sqrt(
      Math.pow(directionX, 2) + Math.pow(directionY, 2)
    );

    const unitDirectionX = magnitude > 0 ? directionX / magnitude : 0;
    const unitDirectionY = magnitude > 0 ? directionY / magnitude : 0;

    ringsData.forEach((ringData) => {
      const ringElement = ringData.element;
      const ringRadius = ringData.radius;

      const distCursorToCenter = Math.sqrt(
        Math.pow(cursorX - ringsCenterX, 2) +
          Math.pow(cursorY - ringsCenterY, 2)
      );

      const distFromRingEdge = Math.abs(distCursorToCenter - ringRadius);

      let influence = 0;
      if (distFromRingEdge < INFLUENCE_RADIUS) {
        influence = 1 - distFromRingEdge / INFLUENCE_RADIUS;
        influence = Math.pow(influence, 2);
      }

      const shiftX = unitDirectionX * influence * MAX_SHIFT * 0.5;
      const shiftY = unitDirectionY * influence * MAX_SHIFT * 0.5;

      ringElement.style.transform = `translate(-50%, -50%) translate3d(${shiftX}px, ${shiftY}px, 0px)`;
    });
  });

  // Cohesion Restore
  document.addEventListener("mouseleave", () => {
    rings.forEach((ring) => {
      ring.style.transform = "translate(-50%, -50%) translate3d(0px, 0px, 0px)";
    });
  });
});
