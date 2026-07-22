"use strict";

/* =========================================
   LEE'S BUDGET — PART 1
   Core budget data, saving, dashboard,
   categories, and tab navigation
========================================= */

const STORAGE_KEY = "leesBudgetAppData";

const startingData = {
  monthlyIncome: 5200,

  categories: [
    { name: "Groceries", budget: 600 },
    { name: "Fuel", budget: 425 },
    { name: "Dining Out", budget: 175 },
    { name: "Household", budget: 150 },
    { name: "Kids", budget: 150 },
    { name: "Pets", budget: 100 },
    { name: "Shopping", budget: 100 },
    { name: "Entertainment", budget: 60 },
    { name: "Miscellaneous", budget: 100 },
    { name: "Savings", budget: 695 }
  ],

  bills: [
    { id: "rent", name: "Rent", amount: 560, paid: false },
    { id: "car", name: "Car Payment", amount: 560, paid: false },
    { id: "klarna", name: "Klarna", amount: 308, paid: false },
    { id: "tmobile", name: "T-Mobile", amount: 272, paid: false },
    { id: "statefarm", name: "State Farm Insurance", amount: 171, paid: false },
    { id: "signature", name: "Signature Loan", amount: 170, paid: false },
    { id: "gasheat", name: "Gas / Heat", amount: 165, paid: false },
    { id: "kamari", name: "Kamari Health Insurance", amount: 100, paid: false },
    { id: "electric", name: "Electric", amount: 70, paid: false },
    { id: "affirm", name: "Affirm", amount: 68, paid: false },
    { id: "merrick", name: "Merrick", amount: 50, paid: false },
    { id: "afterpay", name: "Afterpay", amount: 49, paid: false },
    { id: "biglots", name: "Big Lots", amount: 37, paid: false },
    { id: "capitalone", name: "Capital One", amount: 25, paid: false },
    { id: "mastercard", name: "Mastercard", amount: 20, paid: false },
    { id: "carecredit", name: "CareCredit", amount: 20, paid: false }
  ],

  debts: [
    {
      id: "car",
      name: "Car Payment",
      balance: 0,
      minimumPayment: 560,
      paidOff: false
    },
    {
      id: "klarna",
      name: "Klarna",
      balance: 0,
      minimumPayment: 308,
      paidOff: false
    },
    {
      id: "signature",
      name: "Signature Loan",
      balance: 0,
      minimumPayment: 170,
      paidOff: false
    },
    {
      id: "affirm",
      name: "Affirm",
      balance: 0,
      minimumPayment: 68,
      paidOff: false
    },
    {
      id: "merrick",
      name: "Merrick",
      balance: 0,
      minimumPayment: 50,
      paidOff: false
    },
    {
      id: "afterpay",
      name: "Afterpay",
      balance: 0,
      minimumPayment: 49,
      paidOff: false
    },
    {
      id: "biglots",
      name: "Big Lots",
      balance: 0,
      minimumPayment: 37,
      paidOff: false
    },
    {
      id: "capitalone",
      name: "Capital One",
      balance: 0,
      minimumPayment: 25,
      paidOff: false
    },
    {
      id: "mastercard",
      name: "Mastercard",
      balance: 0,
      minimumPayment: 20,
      paidOff: false
    },
    {
      id: "carecredit",
      name: "CareCredit",
      balance: 0,
      minimumPayment: 20,
      paidOff: false
    }
  ],

  expenses: []
};

let appData = loadAppData();

function copyStartingData() {
  return JSON.parse(JSON.stringify(startingData));
}

function loadAppData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return copyStartingData();
    }

    const parsedData = JSON.parse(savedData);

    return {
      ...copyStartingData(),
      ...parsedData,
      categories: parsedData.categories || copyStartingData().categories,
      bills: parsedData.bills || copyStartingData().bills,
      debts: parsedData.debts || copyStartingData().debts,
      expenses: parsedData.expenses || []
    };
  } catch (error) {
    console.error("Budget data could not be loaded:", error);
    return copyStartingData();
  }
}

function saveAppData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (error) {
    console.error("Budget data could not be saved:", error);
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(amount) || 0);
}

function getMonthlyBillsTotal() {
  return appData.bills
    .filter((bill) => !bill.removed)
    .reduce((total, bill) => total + Number(bill.amount), 0);
}

function getTotalExpenses() {
  return appData.expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
}

function getCategorySpent(categoryName) {
  return appData.expenses
    .filter((expense) => expense.category === categoryName)
    .reduce((total, expense) => total + Number(expense.amount), 0);
}

function getMoneyLeft() {
  return (
    Number(appData.monthlyIncome) -
    getMonthlyBillsTotal() -
    getTotalExpenses()
  );
}

function displayCurrentMonth() {
  const monthElement = document.getElementById("currentMonth");

  if (!monthElement) {
    return;
  }

  monthElement.textContent = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
}

function updateDashboard() {
  const monthlyIncomeElement = document.getElementById("monthlyIncome");
  const monthlyBillsElement = document.getElementById("monthlyBills");
  const moneyLeftElement = document.getElementById("moneyLeft");
  const spentSoFarElement = document.getElementById("spentSoFar");

  monthlyIncomeElement.textContent = formatMoney(appData.monthlyIncome);
  monthlyBillsElement.textContent = formatMoney(getMonthlyBillsTotal());
  moneyLeftElement.textContent = formatMoney(getMoneyLeft());
  spentSoFarElement.textContent = formatMoney(getTotalExpenses());
}

function getCategoryStatus(spent, budget) {
  const percentage = budget > 0 ? spent / budget : 0;

  if (percentage >= 1) {
    return {
      label: "Over budget",
      className: "over"
    };
  }

  if (percentage >= 0.75) {
    return {
      label: "Getting close",
      className: "warning"
    };
  }

  return {
    label: "On track",
    className: "safe"
  };
}

function renderCategories() {
  const categoryList = document.getElementById("categoryList");

  if (!categoryList) {
    return;
  }

  categoryList.innerHTML = "";

  appData.categories.forEach((category) => {
    const spent = getCategorySpent(category.name);
    const remaining = category.budget - spent;
    const percentUsed =
      category.budget > 0
        ? Math.min((spent / category.budget) * 100, 100)
        : 0;

    const status = getCategoryStatus(spent, category.budget);

    const categoryRow = document.createElement("div");
    categoryRow.className = "category-row";

    categoryRow.innerHTML = `
      <div class="row-top">
        <div>
          <div class="row-name">${category.name}</div>
          <div class="row-subtitle">
            ${formatMoney(spent)} spent of ${formatMoney(category.budget)}
          </div>
        </div>

        <div class="amount">
          ${formatMoney(remaining)} left
        </div>
      </div>

      <div class="progress">
        <div
          class="progress-bar ${status.className}"
          style="width: ${percentUsed}%"
        ></div>
      </div>

      <span class="status ${status.className}">
        ${status.label}
      </span>
    `;

    categoryList.appendChild(categoryRow);
  });
}

function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.tab;

      tabButtons.forEach((tabButton) => {
        tabButton.classList.remove("active");
      });

      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      button.classList.add("active");

      const selectedPanel = document.getElementById(`${selectedTab}Tab`);

      if (selectedPanel) {
        selectedPanel.classList.add("active");
      }
    });
  });
}

function refreshApp() {
  displayCurrentMonth();
  updateDashboard();
  renderCategories();
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  refreshApp();
  saveAppData();
});