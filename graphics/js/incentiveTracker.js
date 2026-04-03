const INCENTIVE_API_URL = "https://lahjoita.finnruns.fi/api/incentives?getActive=true";
let incentives = [];

const incentiveLayouts = {
  milestone: renderMilestone,
  freeChoice: renderBidwar,
  fixedChoice: renderBidwar,
};

const incentiveRoot = document.getElementById("incentiveRoot");

// ==========================
// RENDERERS
// ==========================

function renderMilestone(root, incentive) {
  root.innerHTML = `
        <span class="gameName">${incentive.game}</span>
        <div class="progressContainer">
            <div class="incentiveTextContainer">
                <span>${incentive.milestone.raised}€</span>
                <span>${incentive.title}</span>
                <span>${incentive.milestone.goal}€</span>
            </div>
            <div class="progressFill"></div>
        </div>
    `;

  // Fill bar logic
  const container = root.querySelector(".progressContainer");
  const fill = container.querySelector(".progressFill");
  const percent =
    Math.min(incentive.milestone.raised / incentive.milestone.goal, 1) * 100;
  fill.style.width = `${percent}%`;
}

function renderBidwar(root, incentive) {
  root.innerHTML = `
        <span class="gameName">${incentive.game}</span>
        <div class="bidwarTitle">${incentive.title}</div>
    `;

  const options = incentive.incentiveValues ? incentive.incentiveValues : [];
  const sortedOptions = [...options].sort((a, b) => b.amount - a.amount);
  const maxAmount = Math.max(...sortedOptions.map((o) => o.amount));

  if (sortedOptions.length === 0) {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.innerHTML = `
            <div class="incentiveTextContainer">
                <span class="bidwarNoOptions">Ei vielä vaihtoehtoja. Lisää oma ehdotuksesi osoitteessa lahjoita.finnruns.fi</span>
            </div>
        `;

    root.appendChild(container);
    return;
  }


  sortedOptions.forEach((option, index) => {
    const container = document.createElement("div");
    container.className = "progressContainer";
    container.style.position = "relative";

    container.innerHTML = `
            <div class="incentiveTextContainer">
                <span>${option.name}</span>
                <span>${option.amount}€</span>
            </div>
            <div class="progressFill"></div>
        `;

    const fill = container.querySelector(".progressFill");
    const percent = maxAmount > 0 ? (option.amount / maxAmount) * 100 : 0;
    fill.style.width = `${percent}%`;

    root.appendChild(container);
  });
}

function renderIncentive(incentive) {
  const renderer = incentiveLayouts[incentive.incentiveType];
  if (!renderer) return;
  renderer(incentiveRoot, incentive);
}

// Incentive rotation
let activeIndex = 0;

function showNextIncentive() {
  incentiveRoot.classList.add("is-hidden");

  // wait for fade-out to finish
  setTimeout(() => {
    renderIncentive(incentives[activeIndex]);

    activeIndex = (activeIndex + 1) % incentives.length;

    incentiveRoot.classList.remove("is-hidden");
  }, 400);
}

const fetchIncentives = async () => {
  try {
    const res = await fetch(INCENTIVE_API_URL);
    const data = await res.json();
    incentives = data.slice(0, 3);
    showNextIncentive();
  } catch (error) {
    console.log("failed to fetch incentives", error);
  }
};

fetchIncentives();
setInterval(showNextIncentive, 15000);
