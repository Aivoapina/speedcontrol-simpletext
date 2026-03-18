// ==========
// REPLICANTS
// ==========

const colorSelectorRep = nodecg.Replicant("eventColors", {
  defaultValue: "FINNRUNS",
});

// ==================
// LAYOUT DEFINITIONS
// ==================

const layoutWidth = 1920;
const layoutHeight = 1080;
const bottomBarHeight = 72;

const FINNRUNS_COLORS = {
  borderColor: "#2C7CB2",
  bottomGradient: "#08426A",
  topGradient: "#09558B",
};

const QUEST_COLORS = {
  borderColor: "#23926C",
  bottomGradient: "#17523C",
  topGradient: "#097859",
};

// This object will always reflect the currently selected colors
const LAYOUT_COLORS = { ...FINNRUNS_COLORS };

// Apply to layout immediately whenever the replicant changes
colorSelectorRep.on("change", (newValue) => {
  switch (newValue) {
    case "FINNRUNS":
      Object.assign(LAYOUT_COLORS, FINNRUNS_COLORS);
      break;
    case "QUEST":
      Object.assign(LAYOUT_COLORS, QUEST_COLORS);
      break;
  }

  // Re-apply CSS variables immediately
  const root = document.documentElement;
  root.style.setProperty("--border-color", LAYOUT_COLORS.borderColor);
  root.style.setProperty("--bottom-gradient", LAYOUT_COLORS.bottomGradient);
  root.style.setProperty("--top-gradient", LAYOUT_COLORS.topGradient);

  // Optional: trigger any other visual updates that read from LAYOUT_DEFS.colors
});

// ==============
// GRAPHICS FILES
// ==============

// Three layout archetypes have been defined: "widescreen", "tallscreen" and "race".
// When creating a new layout, copy an appropriate archetype and change the numbers as appropriate.
// The rest of the areas automatically adjust based on the gameplay and camera areas' dimensions.

const LAYOUT_DEFS = {
  "16-9": {
    archetype: "widescreen",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1408,
    gameplayHeight: 792,
    cameraHeight: 370,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },
  "16-10": {
    archetype: "widescreen",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1272,
    gameplayHeight: 795,
    cameraHeight: 370,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },
  "16-9-race": {
    archetype: "race",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 960,
    gameplayHeight: 540,
    cameraWidth: 700,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },

  "4-3": {
    archetype: "tallscreen",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1344,
    cameraHeight: 400,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },

  "10-9": {
    archetype: "tallscreen",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1120,
    cameraHeight: 450,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },

  "3-2": {
    archetype: "widescreen",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1245,
    gameplayHeight: 830,
    cameraHeight: 380,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },

  "4-3-race": {
    archetype: "race",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 960,
    gameplayHeight: 720,
    cameraWidth: 578,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },

  "3-2-race": {
    archetype: "race",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 960,
    gameplayHeight: 640,
    cameraWidth: 578,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },

  nds: {
    archetype: "nds",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1344,
    gameplayHeight: 1008,
    secondScreenHeight: 432,
    cameraHeight: 360,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },
  "5-4": {
    archetype: "tallscreen",
    width: layoutWidth,
    height: layoutHeight,
    gameplayWidth: 1260,
    cameraHeight: 400,
    bottomHeight: bottomBarHeight,
    colors: LAYOUT_COLORS,
  },
};

// ================
// LAYOUT RESOLVERS
// ================

function resolveWidescreen(def) {
  const leftColumnWidth = def.width - def.gameplayWidth;
  const cameraArea = {
    x: 0,
    y: 0,
    width: leftColumnWidth,
    height: def.cameraHeight,
  };

  const sponsorArea = {
    x: 0,
    y: def.cameraHeight,
    width: leftColumnWidth,
    height: def.height - def.bottomHeight - def.cameraHeight,
  };

  const gameplayArea = {
    x: leftColumnWidth,
    y: 0,
    width: def.gameplayWidth,
    height: def.gameplayHeight,
  };

  const runInfoArea = {
    x: leftColumnWidth,
    y: def.gameplayHeight,
    width: def.gameplayWidth,
    height: def.height - def.gameplayHeight - def.bottomHeight,
  };

  const bottomBarArea = {
    x: 0,
    y: def.height - def.bottomHeight,
    width: def.width,
    height: def.bottomHeight,
  };

  return {
    ...def,
    areas: {
      camera: cameraArea,
      sponsor: sponsorArea,
      gameplay: gameplayArea,
      runInfo: runInfoArea,
      bottomBar: bottomBarArea,
    },
  };
}

function resolveTallscreen(def) {
  const leftColumnWidth = def.width - def.gameplayWidth;
  const cameraArea = {
    x: 0,
    y: 0,
    width: leftColumnWidth,
    height: def.cameraHeight,
  };

  const sponsorArea = {
    x: 0,
    y: def.cameraHeight,
    width: leftColumnWidth,
    height: def.height - def.bottomHeight - def.cameraHeight,
  };

  const gameplayArea = {
    x: leftColumnWidth,
    y: 0,
    width: def.gameplayWidth,
    height: def.height - def.bottomHeight,
  };

  const bottomBarArea = {
    x: 0,
    y: def.height - def.bottomHeight,
    width: def.width,
    height: def.bottomHeight,
  };

  return {
    ...def,
    areas: {
      camera: cameraArea,
      sponsor: sponsorArea,
      gameplay: gameplayArea,
      bottomBar: bottomBarArea,
    },
  };
}

function resolveNDS(def) {
  const leftColumnWidth = def.width - def.gameplayWidth;
  const cameraArea = {
    x: 0,
    y: 0,
    width: leftColumnWidth,
    height: def.cameraHeight,
  };

  const sponsorArea = {
    x: 0,
    y: def.cameraHeight,
    width: leftColumnWidth,
    height:
      def.height - def.bottomHeight - def.cameraHeight - def.secondScreenHeight,
  };

  const secondScreenArea = {
    x: 0,
    y: sponsorArea.height + def.cameraHeight,
    width: leftColumnWidth,
    height: def.secondScreenHeight,
  };

  const gameplayArea = {
    x: leftColumnWidth,
    y: 0,
    width: def.gameplayWidth,
    height: def.height - def.bottomHeight,
  };

  const bottomBarArea = {
    x: 0,
    y: def.height - def.bottomHeight,
    width: def.width,
    height: def.bottomHeight,
  };

  return {
    ...def,
    areas: {
      camera: cameraArea,
      sponsor: sponsorArea,
      gameplay: gameplayArea,
      secondScreen: secondScreenArea,
      bottomBar: bottomBarArea,
    },
  };
}

function resolveRace(def) {
  const infoRowHeight = def.height - def.gameplayHeight - def.bottomHeight;

  const leftGameplayArea = {
    x: 0,
    y: 0,
    width: def.gameplayWidth,
    height: def.gameplayHeight,
  };

  const rightGameplayArea = {
    x: def.gameplayWidth,
    y: 0,
    width: def.gameplayWidth,
    height: def.gameplayHeight,
  };

  const cameraX = (def.width - def.cameraWidth) / 2;
  const sideWidth = (def.width - def.cameraWidth) / 2;

  const cameraArea = {
    x: cameraX,
    y: def.gameplayHeight,
    width: def.cameraWidth,
    height: infoRowHeight,
  };

  const sponsorArea = {
    x: 0,
    y: def.gameplayHeight,
    width: sideWidth,
    height: infoRowHeight,
  };

  const runInfoArea = {
    x: cameraX + def.cameraWidth,
    y: def.gameplayHeight,
    width: sideWidth,
    height: infoRowHeight,
  };

  const bottomBarArea = {
    x: 0,
    y: def.height - def.bottomHeight,
    width: def.width,
    height: def.bottomHeight,
  };

  return {
    ...def,
    areas: {
      gameplayLeft: leftGameplayArea,
      gameplayRight: rightGameplayArea,
      sponsor: sponsorArea,
      camera: cameraArea,
      runInfo: runInfoArea,
      bottomBar: bottomBarArea,
    },
  };
}

// ================
// LAYOUT DETECTION
// ================

const path = window.location.pathname; // "/graphics/16-9.html"
const fileName = path.substring(path.lastIndexOf("/") + 1); // "16-9.html"
const layoutId = fileName.replace(".html", "");

let layout;

if (LAYOUT_DEFS[layoutId]) {
  layout = resolveLayout(layoutId);
} else {
  // Bottom bar, overlays, misc graphics
  layout = {
    colors: LAYOUT_COLORS,
  };
}

// Apply CSS variables
if (layout.colors) {
  const root = document.documentElement;
  const { colors } = layout;
  root.style.setProperty("--border-color", colors.borderColor);
  root.style.setProperty("--bottom-gradient", colors.bottomGradient);
  root.style.setProperty("--top-gradient", colors.topGradient);
}

// Apply the layout areas to HTML elements
Object.entries(layout.areas).forEach(([id, area]) => {
  const el = document.getElementById(id);
  if (!el) return;

  el.style.position = "absolute";
  el.style.left = `${area.x}px`;
  el.style.top = `${area.y}px`;
  el.style.width = `${area.width}px`;
  el.style.height = `${area.height}px`;
});

import("./grid.js").then(({ createGrid }) => {
  createGrid({
    squareSize: 22,
    layout,
  });
});

// ==========
// DISPATCHER
// ==========

export function resolveLayout(layoutId) {
  const def = LAYOUT_DEFS[layoutId];

  if (!def) {
    throw new Error(`Unknown layout ID: ${layoutId}`);
  }

  switch (def.archetype) {
    case "widescreen":
      return resolveWidescreen(def);

    case "tallscreen":
      return resolveTallscreen(def);

    case "nds":
      return resolveNDS(def);

    case "race":
      return resolveRace(def);

    default:
      throw new Error(`Unknown archetype: ${def.archetype}`);
  }
}
