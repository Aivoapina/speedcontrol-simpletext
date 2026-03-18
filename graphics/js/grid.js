export function createGrid({
  squareSize,
  layout,
  containerId = "grid-container",
  gap = 2,
  outerGap = 1,
}) {
  // --- Configuration ---
  const HD_WIDTH = layout.width;
  const HD_HEIGHT = layout.height;
  const SQUARE_SIZE = squareSize;
  const GAP = gap;
  const OUTER_GAP = outerGap;

  // --- Setup container and SVG ---
  const container = document.getElementById(containerId);
  container.replaceChildren();

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${HD_WIDTH} ${HD_HEIGHT}`);
  container.appendChild(svg);

  // --- Background ---
  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("width", HD_WIDTH);
  bgRect.setAttribute("height", HD_HEIGHT);
  bgRect.setAttribute("fill", "#1e1e1e");
  bgRect.setAttribute("mask", "url(#grid-mask)");
  svg.appendChild(bgRect);

  // --- Mask ---
  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.setAttribute("id", "grid-mask");

  const fullRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );
  fullRect.setAttribute("width", HD_WIDTH);
  fullRect.setAttribute("height", HD_HEIGHT);
  fullRect.setAttribute("fill", "white");
  mask.appendChild(fullRect);

  if (layout.areas) {
    [
      "camera",
      "gameplay",
      "gameplayLeft",
      "gameplayRight",
      "secondScreen",
    ].forEach((areaName) => {
      const area = layout.areas[areaName];
      if (!area) return;

      const hole = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      hole.setAttribute("x", area.x);
      hole.setAttribute("y", area.y);
      hole.setAttribute("width", area.width);
      hole.setAttribute("height", area.height);
      hole.setAttribute("fill", "black");
      mask.appendChild(hole);
    });
  }

  svg.appendChild(mask);

  // --- Grid math ---
  const nW = (HD_WIDTH - 2 * OUTER_GAP + GAP) / (SQUARE_SIZE + GAP);
  const nH = (HD_HEIGHT - 2 * OUTER_GAP + GAP) / (SQUARE_SIZE + GAP);

  function getRandomGray(min = 20, max = 80, center = 40, spread = 2) {
    const gray = center + (Math.random() - 0.5) * spread * 2;
    return Math.max(min, Math.min(max, Math.round(gray)));
  }

  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridGroup.setAttribute("mask", "url(#grid-mask)");
  svg.appendChild(gridGroup);

  for (let i = 0; i < nW; i++) {
    for (let j = 0; j < nH; j++) {
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      rect.setAttribute("x", OUTER_GAP + i * (SQUARE_SIZE + GAP));
      rect.setAttribute("y", OUTER_GAP + j * (SQUARE_SIZE + GAP));
      rect.setAttribute("width", SQUARE_SIZE);
      rect.setAttribute("height", SQUARE_SIZE);

      const gray = getRandomGray();
      rect.setAttribute("fill", `rgb(${gray}, ${gray}, ${gray})`);

      gridGroup.appendChild(rect);
    }
  }
}
