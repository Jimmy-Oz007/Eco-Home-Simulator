const appliances = [
  {
    name: "Air Conditioner",
    power: 8,
    comfort: 12,
    description: "High comfort but expensive.",
    active: false
  },
  {
    name: "Heater",
    power: 7,
    comfort: 10,
    description: "Useful in cold weather.",
    active: false
  },
  {
    name: "Gaming PC",
    power: 5,
    comfort: 8,
    description: "Fun but power hungry.",
    active: false
  },
  {
    name: "Smart Lights",
    power: 1,
    comfort: 3,
    description: "Low power lighting.",
    active: true
  },
  {
    name: "Fridge",
    power: 3,
    comfort: 8,
    description: "Essential appliance.",
    active: true
  }
];

const upgrades = [
  {
    name: "LED Bulbs",
    cost: 120,
    saving: 0.05,
    description: "Reduce electricity bill by 5%.",
    owned: false
  },
  {
    name: "Solar Panels",
    cost: 850,
    saving: 0.25,
    description: "Reduce electricity bill by 25%.",
    owned: false
  }
];

let state = {
  day: 1,
  month: 1,
  money: 1200,
  salary: 900,
  energyUsed: 0,
  bill: 0,
  comfort: 70,
  electricityRate: 1.2
};

const monthEl = document.getElementById("month");
const moneyEl = document.getElementById("money");
const billEl = document.getElementById("bill");
const comfortEl = document.getElementById("comfort");
const energyEl = document.getElementById("energy");

const applianceList = document.getElementById("appliance-list");
const upgradeList = document.getElementById("upgrade-list");
const logEl = document.getElementById("log");

document.getElementById("next-day").addEventListener("click", nextDay);
document.getElementById("next-month").addEventListener("click", nextMonth);

function renderAppliances() {
  applianceList.innerHTML = "";

  appliances.forEach((appliance, index) => {
    const card = document.createElement("article");

    card.className =
      "appliance-card " +
      (appliance.active ? "active" : "");

    card.innerHTML = `
      <h3>${appliance.name}</h3>
      <p>${appliance.description}</p>
      <p>Power: ${appliance.power} kWh/day</p>

      <button onclick="toggleAppliance(${index})">
        ${appliance.active ? "Turn Off" : "Turn On"}
      </button>
    `;

    applianceList.appendChild(card);
  });
}

function renderUpgrades() {
  upgradeList.innerHTML = "";

  upgrades.forEach((upgrade, index) => {
    const item = document.createElement("article");

    item.className = "upgrade";

    item.innerHTML = `
      <h3>${upgrade.name}</h3>
      <p>${upgrade.description}</p>
      <p>Cost: $${upgrade.cost}</p>

      <button
        onclick="buyUpgrade(${index})"
        ${upgrade.owned ? "disabled" : ""}
      >
        ${upgrade.owned ? "Owned" : "Buy"}
      </button>
    `;

    upgradeList.appendChild(item);
  });
}

function renderStats() {
  monthEl.textContent = state.month;
  moneyEl.textContent = "$" + Math.round(state.money);
  billEl.textContent = "$" + Math.round(state.bill);
  comfortEl.textContent = state.comfort + "%";
  energyEl.textContent = state.energyUsed + " kWh";
}

function render() {
  renderStats();
  renderAppliances();
  renderUpgrades();
}

function toggleAppliance(index) {
  appliances[index].active =
    !appliances[index].active;

  addLog(
    appliances[index].name +
      (appliances[index].active
        ? " turned on."
        : " turned off.")
  );

  render();
}

function buyUpgrade(index) {
  const upgrade = upgrades[index];

  if (!upgrade.owned && state.money >= upgrade.cost) {
    state.money -= upgrade.cost;
    upgrade.owned = true;

    addLog("Bought " + upgrade.name);

    render();
  }
}

function nextDay() {
  let dailyEnergy = 0;

  appliances.forEach(appliance => {
    if (appliance.active) {
      dailyEnergy += appliance.power;
    }
  });

  let savingMultiplier = 1;

  upgrades.forEach(upgrade => {
    if (upgrade.owned) {
      savingMultiplier -= upgrade.saving;
    }
  });

  const dailyCost =
    dailyEnergy *
    state.electricityRate *
    savingMultiplier;

  state.energyUsed += dailyEnergy;
  state.bill += dailyCost;
  state.day++;

  addLog(
    "Used " +
      dailyEnergy +
      " kWh today. Added $" +
      dailyCost.toFixed(2) +
      " to bill."
  );

  render();
}

function nextMonth() {
  state.money -= state.bill;
  state.money += state.salary;

  addLog(
    "Paid electricity bill of $" +
      Math.round(state.bill)
  );

  state.month++;
  state.bill = 0;
  state.energyUsed = 0;

  render();
}

function addLog(message) {
  const entry = document.createElement("div");

  entry.className = "log-entry";
  entry.textContent = message;

  logEl.prepend(entry);
}

render();