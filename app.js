"use strict";

const STORAGE_KEY = "leesBudgetAppData";

const startingData = {
  monthlyIncome: 5200,

  categories: [
    { name: "Groceries", budget: 600, moneyAddedThisMonth: 0 },
    { name: "Fuel", budget: 425, moneyAddedThisMonth: 0 },
    { name: "Dining Out", budget: 175, moneyAddedThisMonth: 0 },
    { name: "Household", budget: 150, moneyAddedThisMonth: 0 },
    { name: "Kids", budget: 150, moneyAddedThisMonth: 0 },
    { name: "Pets", budget: 100, moneyAddedThisMonth: 0 },
    { name: "Shopping", budget: 100, moneyAddedThisMonth: 0 },
    { name: "Entertainment", budget: 60, moneyAddedThisMonth: 0 },
    { name: "Miscellaneous", budget: 100, moneyAddedThisMonth: 0 },
    { name: "Savings", budget: 695, moneyAddedThisMonth: 0 }
  ],

  bills: [
    { id: "rent", name: "Rent", amount: 560, paid: false, removed: false, dueDate: 1 },
    { id: "car", name: "Car Payment", amount: 560, paid: false, removed: false, dueDate: 1 },
    { id: "klarna", name: "Klarna", amount: 308, paid: false, removed: false, dueDate: 1 },
    { id: "tmobile", name: "T-Mobile", amount: 272, paid: false, removed: false, dueDate: 1 },
    { id: "statefarm", name: "State Farm Insurance", amount: 171, paid: false, removed: false, dueDate: 1 },
    { id: "signature", name: "Signature Loan", amount: 170, paid: false, removed: false, dueDate: 1 },
    { id: "gasheat", name: "Gas / Heat", amount: 165, paid: false, removed: false, dueDate: 1 },
    { id: "kamari", name: "Kamari Health Insurance", amount: 100, paid: false, removed: false, dueDate: 1 },
    { id: "electric", name: "Electric", amount: 70, paid: false, removed: false, dueDate: 1 },
    { id: "affirm", name: "Affirm", amount: 68, paid: false, removed: false, dueDate: 1 },
    { id: "merrick", name: "Merrick", amount: 50, paid: false, removed: false, dueDate: 1 },
    { id: "afterpay", name: "Afterpay", amount: 49, paid: false, removed: false, dueDate: 1 },
    { id: "biglots", name: "Big Lots", amount: 37, paid: false, removed: false, dueDate: 1 },
    { id: "capitalone", name: "Capital One", amount: 25, paid: false, removed: false, dueDate: 1 },
    { id: "mastercard", name: "Mastercard", amount: 20, paid: false, removed: false, dueDate: 1 },
    { id: "carecredit", name: "CareCredit", amount: 20, paid: false, removed: false, dueDate: 1 }
  ],

  debts: [
    { id: "car", name: "Car Payment", balance: 0, minimumPayment: 560, paidOff: false },
    { id: "klarna", name: "Klarna", balance: 0, minimumPayment: 308, paidOff: false },
    { id: "signature", name: "Signature Loan", balance: 0, minimumPayment: 170, paidOff: false },
    { id: "affirm", name: "Affirm", balance: 0, minimumPayment: 68, paidOff: false },
    { id: "merrick", name: "Merrick", balance: 0, minimumPayment: 50, paidOff: false },
    { id: "afterpay", name: "Afterpay", balance: 0, minimumPayment: 49, paidOff: false },
    { id: "biglots", name: "Big Lots", balance: 0, minimumPayment: 37, paidOff: false },
    { id: "capitalone", name: "Capital One", balance: 0, minimumPayment: 25, paidOff: false },
    { id: "mastercard", name: "Mastercard", balance: 0, minimumPayment: 20, paidOff: false },
    { id: "carecredit", name: "CareCredit", balance: 0, minimumPayment: 20, paidOff: false }
  ],

  archivedDebts: [],

  expenses: [],

  monthlyHistory: [],

  payPeriodHistory: [],

  settings: {
    appName: "Lee's Budget",
    appEmoji: "💰",
    payday: new Date().toISOString().slice(0, 10),
    payFrequencyDays: 14,
    budgetMode: "biweekly"
  }
};

function copyStartingData() {
  return JSON.parse(JSON.stringify(startingData));
}

function normalizeCategories(categories) {
  return (categories || []).map((category) => ({
    name: category.name,
    budget: Number(category.budget) || 0,
    moneyAddedThisMonth: Number(category.moneyAddedThisMonth) || 0
  }));
}

function normalizeBills(bills) {
  return (bills || []).map((bill) => ({
    id: bill.id,
    name: bill.name,
    amount: Number(bill.amount) || 0,
    paid: Boolean(bill.paid),
    removed: Boolean(bill.removed),
    dueDate: Number(bill.dueDate) || 1
  }));
}

function normalizeDebts(debts) {
  return (debts || []).map((debt) => ({
    id: debt.id,
    name: debt.name,
    balance: Number(debt.balance) || 0,
    minimumPayment: Number(debt.minimumPayment) || 0,
    paidOff: Boolean(debt.paidOff),
    payoffDate: debt.payoffDate || null
  }));
}

function normalizeSettings(settings) {
  const defaults = copyStartingData().settings;

  return {
    appName: (settings && settings.appName) || defaults.appName,
    appEmoji: (settings && settings.appEmoji) || defaults.appEmoji,
    payday: (settings && settings.payday) || defaults.payday,
    payFrequencyDays: (settings && Number(settings.payFrequencyDays)) || 14,
    budgetMode:
      settings && (settings.budgetMode === "monthly" || settings.budgetMode === "biweekly")
        ? settings.budgetMode
        : defaults.budgetMode
  };
}

function loadAppData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const defaults = copyStartingData();

    if (!savedData) {
      return defaults;
    }

    const parsedData = JSON.parse(savedData);

    return {
      ...defaults,
      ...parsedData,
      categories: normalizeCategories(parsedData.categories || defaults.categories),
      bills: normalizeBills(parsedData.bills || defaults.bills),
      debts: normalizeDebts(parsedData.debts || defaults.debts),
      archivedDebts: normalizeDebts(parsedData.archivedDebts || []),
      expenses: parsedData.expenses || [],
      monthlyHistory: parsedData.monthlyHistory || [],
      payPeriodHistory: parsedData.payPeriodHistory || [],
      settings: normalizeSettings(parsedData.settings)
    };
  } catch (error) {
    console.error("Budget data could not be loaded:", error);
    return copyStartingData();
  }
}

let appData = loadAppData();

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

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ordinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = n % 100;
  return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

function getNextPayday(referenceDate) {
  const frequency = Number(appData.settings.payFrequencyDays) || 14;
  let anchor = new Date(`${appData.settings.payday}T00:00:00`);

  if (isNaN(anchor.getTime())) {
    anchor = new Date();
  }

  const ref = referenceDate ? new Date(referenceDate) : new Date();
  ref.setHours(0, 0, 0, 0);
  anchor.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((ref.getTime() - anchor.getTime()) / msPerDay);
  const cyclesPassed = Math.floor(diffDays / frequency);

  let candidate = new Date(anchor.getTime() + cyclesPassed * frequency * msPerDay);

  while (candidate.getTime() < ref.getTime()) {
    candidate = new Date(candidate.getTime() + frequency * msPerDay);
  }

  return candidate;
}

function getNextDueDateOccurrence(dueDay, fromDate) {
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);

  const day = Math.min(Math.max(Number(dueDay) || 1, 1), 31);

  function clampToMonth(year, month, dayNum) {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(dayNum, lastDay));
  }

  let candidate = clampToMonth(from.getFullYear(), from.getMonth(), day);

  if (candidate.getTime() < from.getTime()) {
    candidate = clampToMonth(from.getFullYear(), from.getMonth() + 1, day);
  }

  return candidate;
}

function getBillsDueThisPayPeriod() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextPayday = getNextPayday(today);

  return appData.bills.filter((bill) => {
    if (bill.removed) {
      return false;
    }

    const dueOccurrence = getNextDueDateOccurrence(bill.dueDate, today);
    return dueOccurrence.getTime() <= nextPayday.getTime();
  });
}

function getBillsTotalForCurrentPeriod() {
  if (appData.settings.budgetMode === "monthly") {
    return appData.bills
      .filter((bill) => !bill.removed)
      .reduce((total, bill) => total + Number(bill.amount), 0);
  }

  return getBillsDueThisPayPeriod().reduce(
    (total, bill) => total + Number(bill.amount),
    0
  );
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
    getBillsTotalForCurrentPeriod() -
    getTotalExpenses()
  );
}

function applySettings() {
  const titleElement = document.getElementById("appTitleText");
  const emojiElement = document.getElementById("appTitleEmoji");

  if (titleElement) {
    titleElement.textContent = appData.settings.appName;
  }

  if (emojiElement) {
    emojiElement.textContent = appData.settings.appEmoji;
  }

  document.title = appData.settings.appName;
}

function updateDashboardLabels() {
  const incomeLabel = document.getElementById("incomeLabel");
  const billsLabel = document.getElementById("billsLabel");
  const moneyLeftLabel = document.getElementById("moneyLeftLabel");
  const spentLabel = document.getElementById("spentLabel");

  const isMonthly = appData.settings.budgetMode === "monthly";

  if (incomeLabel) {
    incomeLabel.textContent = isMonthly ? "Monthly Income" : "Paycheck Income";
  }

  if (billsLabel) {
    billsLabel.textContent = isMonthly ? "Monthly Bills" : "Bills This Pay Period";
  }

  if (moneyLeftLabel) {
    moneyLeftLabel.textContent = isMonthly ? "Money Left This Month" : "Money Left Until Payday";
  }

  if (spentLabel) {
    spentLabel.textContent = isMonthly ? "Spent So Far" : "Spent This Pay Period";
  }
}

function updateResetButtonLabel() {
  const resetBillsButton = document.getElementById("resetBillsButton");

  if (!resetBillsButton) {
    return;
  }

  resetBillsButton.textContent =
    appData.settings.budgetMode === "monthly"
      ? "Start New Month (Reset Bills & Expenses)"
      : "Start New Pay Period (Reset Bills & Expenses)";
}

function updatePayPeriodInfo() {
  const nextPaydayElement = document.getElementById("nextPaydayText");

  if (!nextPaydayElement) {
    return;
  }

  if (appData.settings.budgetMode === "monthly") {
    nextPaydayElement.textContent = "Budgeting mode: Monthly";
    return;
  }

  const nextPayday = getNextPayday(new Date());

  nextPaydayElement.textContent = `Next payday: ${nextPayday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })}`;
}

function showSettingsMessage(message, isError = false) {
  const messageElement = document.getElementById("settingsMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.style.color = isError ? "#c62828" : "#2e7d32";

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 2500);
}

function saveSettings() {
  const nameInput = document.getElementById("appNameInput");
  const emojiInput = document.getElementById("appEmojiInput");
  const paydayInput = document.getElementById("paydayInput");
  const frequencyInput = document.getElementById("payFrequencySelect");
  const budgetModeInput = document.getElementById("budgetModeSelect");

  if (!nameInput || !emojiInput) {
    return;
  }

  const newName = nameInput.value.trim();
  const newEmoji = emojiInput.value.trim();

  if (!newName) {
    showSettingsMessage("Enter an app name.", true);
    nameInput.focus();
    return;
  }

  appData.settings.appName = newName;
  appData.settings.appEmoji = newEmoji || "💰";

  if (paydayInput && paydayInput.value) {
    appData.settings.payday = paydayInput.value;
  }

  if (frequencyInput && frequencyInput.value) {
    appData.settings.payFrequencyDays = Number(frequencyInput.value) || 14;
  }

  if (budgetModeInput && budgetModeInput.value) {
    appData.settings.budgetMode =
      budgetModeInput.value === "monthly" ? "monthly" : "biweekly";
  }

  saveAppData();
  applySettings();
  refreshApp();

  showSettingsMessage("Settings saved.");
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

function editIncome() {
  const newIncomeInput = window.prompt(
    "Paycheck income:",
    String(appData.monthlyIncome)
  );

  if (newIncomeInput === null) {
    return;
  }

  const newIncome = Number(newIncomeInput);

  if (!Number.isFinite(newIncome) || newIncome < 0) {
    window.alert("Enter a valid income amount.");
    return;
  }

  appData.monthlyIncome = Number(newIncome.toFixed(2));

  saveAppData();
  refreshApp();
}

function updateDashboard() {
  const monthlyIncomeElement = document.getElementById("monthlyIncome");
  const monthlyBillsElement = document.getElementById("monthlyBills");
  const moneyLeftElement = document.getElementById("moneyLeft");
  const spentSoFarElement = document.getElementById("spentSoFar");

  if (monthlyIncomeElement) {
    monthlyIncomeElement.textContent = formatMoney(appData.monthlyIncome);
  }

  if (monthlyBillsElement) {
    monthlyBillsElement.textContent = formatMoney(getBillsTotalForCurrentPeriod());
  }

  if (moneyLeftElement) {
    moneyLeftElement.textContent = formatMoney(getMoneyLeft());
  }

  if (spentSoFarElement) {
    spentSoFarElement.textContent = formatMoney(getTotalExpenses());
  }
}

function getCategoryStatus(spent, budget) {
  const percentage = budget > 0 ? spent / budget : 0;

  if (percentage >= 1) {
    return { label: "Over budget", className: "over" };
  }

  if (percentage >= 0.75) {
    return { label: "Getting close", className: "warning" };
  }

  return { label: "On track", className: "safe" };
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
    const safeName = escapeText(category.name);

    const categoryRow = document.createElement("div");
    categoryRow.className = "category-row";

    categoryRow.innerHTML = `
      <div class="row-top">
        <div>
          <div class="row-name">${safeName}</div>
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

      <div class="category-actions">
        <button type="button" class="small-button secondary-button edit-category-button" data-category-name="${safeName}">Edit</button>
        <button type="button" class="small-button primary-button add-money-button" data-category-name="${safeName}">Add Money</button>
        <button type="button" class="small-button danger-button delete-category-button" data-category-name="${safeName}">Delete</button>
      </div>
    `;

    categoryList.appendChild(categoryRow);
  });

  document.querySelectorAll(".edit-category-button").forEach((button) => {
    button.addEventListener("click", () => {
      editCategory(button.dataset.categoryName);
    });
  });

  document.querySelectorAll(".add-money-button").forEach((button) => {
    button.addEventListener("click", () => {
      addMoneyToCategory(button.dataset.categoryName);
    });
  });

  document.querySelectorAll(".delete-category-button").forEach((button) => {
    button.addEventListener("click", () => {
      deleteCategory(button.dataset.categoryName);
    });
  });
}

function editCategory(name) {
  const category = appData.categories.find((item) => item.name === name);

  if (!category) {
    return;
  }

  const newNameInput = window.prompt("Category name:", category.name);

  if (newNameInput === null) {
    return;
  }

  const trimmedName = newNameInput.trim();

  if (!trimmedName) {
    window.alert("Category name cannot be empty.");
    return;
  }

  const duplicate = appData.categories.some(
    (item) =>
      item.name.toLowerCase() === trimmedName.toLowerCase() &&
      item.name !== category.name
  );

  if (duplicate) {
    window.alert("Another category already has that name.");
    return;
  }

  const newBudgetInput = window.prompt(
    "Monthly budget amount:",
    String(category.budget)
  );

  if (newBudgetInput === null) {
    return;
  }

  const newBudget = Number(newBudgetInput);

  if (!Number.isFinite(newBudget) || newBudget < 0) {
    window.alert("Enter a valid budget amount.");
    return;
  }

  const previousName = category.name;

  category.name = trimmedName;
  category.budget = Number(newBudget.toFixed(2));

  if (previousName !== trimmedName) {
    appData.expenses.forEach((expense) => {
      if (expense.category === previousName) {
        expense.category = trimmedName;
      }
    });
  }

  saveAppData();
  refreshApp();
}

function deleteCategory(name) {
  const category = appData.categories.find((item) => item.name === name);

  if (!category) {
    return;
  }

  const relatedExpenses = appData.expenses.filter(
    (expense) => expense.category === name
  );

  if (relatedExpenses.length === 0) {
    const confirmed = window.confirm(`Delete the "${name}" category?`);

    if (!confirmed) {
      return;
    }

    appData.categories = appData.categories.filter(
      (item) => item.name !== name
    );

    saveAppData();
    refreshApp();
    return;
  }

  const proceed = window.confirm(
    `"${name}" has ${relatedExpenses.length} expense(s) recorded. Continue deleting this category?`
  );

  if (!proceed) {
    return;
  }

  const reassign = window.confirm(
    `Press OK to move those expenses to "Miscellaneous".\nPress Cancel to permanently delete those expenses along with "${name}".`
  );

  if (reassign) {
    appData.expenses.forEach((expense) => {
      if (expense.category === name) {
        expense.category = "Miscellaneous";
      }
    });
  } else {
    appData.expenses = appData.expenses.filter(
      (expense) => expense.category !== name
    );
  }

  appData.categories = appData.categories.filter(
    (item) => item.name !== name
  );

  saveAppData();
  refreshApp();
}

function addMoneyToCategory(name) {
  const category = appData.categories.find((item) => item.name === name);

  if (!category) {
    return;
  }

  const input = window.prompt(
    `Enter an amount to add to ${name}'s budget (use a negative number to subtract):`,
    "0"
  );

  if (input === null) {
    return;
  }

  const amount = Number(input);

  if (!Number.isFinite(amount)) {
    window.alert("Enter a valid number.");
    return;
  }

  if (amount === 0) {
    return;
  }

  const confirmed = window.confirm(
    amount > 0
      ? `Add ${formatMoney(amount)} to ${name}'s budget?`
      : `Subtract ${formatMoney(Math.abs(amount))} from ${name}'s budget?`
  );

  if (!confirmed) {
    return;
  }

  let newBudget = Number(category.budget) + amount;

  if (newBudget < 0) {
    newBudget = 0;
  }

  category.budget = Number(newBudget.toFixed(2));
  category.moneyAddedThisMonth =
    Number(category.moneyAddedThisMonth || 0) + amount;

  saveAppData();
  refreshApp();
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

function setupHistorySubTabs() {
  const subButtons = document.querySelectorAll(".history-subtab-button");
  const subPanels = document.querySelectorAll(".history-subpanel");

  subButtons.forEach((button) => {
    button.addEventListener("click", () => {
      subButtons.forEach((item) => {
        item.classList.remove("active");
      });

      subPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      button.classList.add("active");

      const target = document.getElementById(button.dataset.subtab);

      if (target) {
        target.classList.add("active");
      }
    });
  });
}

function showExpenseMessage(message, isError = false) {
  const messageElement = document.getElementById("expenseMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.style.color = isError ? "#c62828" : "#2e7d32";

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 2500);
}

function addExpense() {
  const amountInput = document.getElementById("expenseAmount");
  const categoryInput = document.getElementById("expenseCategory");
  const noteInput = document.getElementById("expenseNote");

  if (!amountInput || !categoryInput || !noteInput) {
    return;
  }

  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const note = noteInput.value.trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    showExpenseMessage("Enter a valid expense amount.", true);
    amountInput.focus();
    return;
  }

  const expense = {
    id: Date.now().toString(),
    amount: Number(amount.toFixed(2)),
    category,
    note,
    date: new Date().toISOString()
  };

  appData.expenses.unshift(expense);

  saveAppData();
  refreshApp();

  amountInput.value = "";
  noteInput.value = "";

  showExpenseMessage("Expense added.");
  amountInput.focus();
}

function deleteExpense(expenseId) {
  const expense = appData.expenses.find((item) => item.id === expenseId);

  if (!expense) {
    return;
  }

  const confirmed = window.confirm(
    `Delete this ${formatMoney(expense.amount)} ${expense.category} expense?`
  );

  if (!confirmed) {
    return;
  }

  appData.expenses = appData.expenses.filter(
    (item) => item.id !== expenseId
  );

  saveAppData();
  refreshApp();
}

function renderExpenseHistory() {
  const historyContainer = document.getElementById("expenseHistory");

  if (!historyContainer) {
    return;
  }

  historyContainer.innerHTML = "";

  if (appData.expenses.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        No expenses have been added yet.
      </div>
    `;

    return;
  }

  appData.expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);

    const formattedDate = expenseDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const historyRow = document.createElement("div");
    historyRow.className = "history-row";

    historyRow.innerHTML = `
      <div class="history-details">
        <div class="row-name">
          ${escapeText(expense.category)}
        </div>

        <div class="history-note">
          ${escapeText(expense.note || "No note")} · ${formattedDate}
        </div>
      </div>

      <div>
        <div class="history-amount">
          ${formatMoney(expense.amount)}
        </div>

        <button
          type="button"
          class="small-button danger-button delete-expense-button"
          data-expense-id="${expense.id}"
        >
          Delete
        </button>
      </div>
    `;

    historyContainer.appendChild(historyRow);
  });

  document.querySelectorAll(".delete-expense-button").forEach((button) => {
    button.addEventListener("click", () => {
      deleteExpense(button.dataset.expenseId);
    });
  });
}

function clearExpenseHistory() {
  if (appData.expenses.length === 0) {
    return;
  }

  const confirmed = window.confirm("Delete every expense in your history?");

  if (!confirmed) {
    return;
  }

  appData.expenses = [];

  saveAppData();
  refreshApp();
}

function renderBillRow(bill, dueThisPeriod) {
  const billRow = document.createElement("div");
  billRow.className = `bill-row ${bill.paid ? "bill-paid" : ""}`;

  billRow.innerHTML = `
    <div class="row-top">
      <label class="bill-check">
        <input
          type="checkbox"
          class="bill-checkbox"
          data-bill-id="${bill.id}"
          ${bill.paid ? "checked" : ""}
        >

        <span>
          <span class="row-name">${escapeText(bill.name)}</span>
          <span class="row-subtitle">
            ${bill.paid ? "Paid" : "Not paid yet"} · Due ${ordinal(bill.dueDate)}
            ${dueThisPeriod && !bill.paid ? '<span class="due-badge">Due before payday</span>' : ""}
          </span>
        </span>
      </label>

      <div class="amount">
        ${formatMoney(bill.amount)}
      </div>
    </div>

    <div class="bill-actions">
      <button type="button" class="small-button secondary-button edit-bill-button" data-bill-id="${bill.id}">Edit</button>
      <button type="button" class="small-button danger-button delete-bill-button" data-bill-id="${bill.id}">Delete</button>
    </div>
  `;

  return billRow;
}

function renderBills() {
  const billList = document.getElementById("billList");
  const paidCount = document.getElementById("billsPaidCount");

  if (!billList) {
    return;
  }

  billList.innerHTML = "";

  const activeBills = appData.bills.filter((bill) => !bill.removed);
  const paidBills = activeBills.filter((bill) => bill.paid).length;
  const isMonthly = appData.settings.budgetMode === "monthly";

  if (paidCount) {
    paidCount.textContent = `${paidBills} of ${activeBills.length} paid`;
  }

  if (activeBills.length === 0) {
    billList.innerHTML = `<div class="empty-state">No bills yet.</div>`;
  } else if (isMonthly) {
    const sortedBills = [...activeBills].sort((a, b) => a.dueDate - b.dueDate);

    sortedBills.forEach((bill) => {
      billList.appendChild(renderBillRow(bill, false));
    });
  } else {
    const dueThisPeriodIds = new Set(
      getBillsDueThisPayPeriod().map((bill) => bill.id)
    );

    const dueSoon = activeBills
      .filter((bill) => dueThisPeriodIds.has(bill.id))
      .sort((a, b) => a.dueDate - b.dueDate);

    const dueLater = activeBills
      .filter((bill) => !dueThisPeriodIds.has(bill.id))
      .sort((a, b) => a.dueDate - b.dueDate);

    const dueSoonHeading = document.createElement("div");
    dueSoonHeading.className = "bill-group-heading";
    dueSoonHeading.textContent = `Due Before Payday (${dueSoon.length})`;
    billList.appendChild(dueSoonHeading);

    if (dueSoon.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No bills due before your next payday.";
      billList.appendChild(empty);
    } else {
      dueSoon.forEach((bill) => {
        billList.appendChild(renderBillRow(bill, true));
      });
    }

    const dueLaterHeading = document.createElement("div");
    dueLaterHeading.className = "bill-group-heading";
    dueLaterHeading.textContent = `Due Later (${dueLater.length})`;
    billList.appendChild(dueLaterHeading);

    dueLater.forEach((bill) => {
      billList.appendChild(renderBillRow(bill, false));
    });
  }

  document.querySelectorAll(".bill-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const bill = appData.bills.find(
        (item) => item.id === checkbox.dataset.billId
      );

      if (!bill) {
        return;
      }

      bill.paid = checkbox.checked;

      saveAppData();
      refreshApp();
    });
  });

  document.querySelectorAll(".edit-bill-button").forEach((button) => {
    button.addEventListener("click", () => {
      editBill(button.dataset.billId);
    });
  });

  document.querySelectorAll(".delete-bill-button").forEach((button) => {
    button.addEventListener("click", () => {
      deleteBill(button.dataset.billId);
    });
  });
}

function editBill(billId) {
  const bill = appData.bills.find((item) => item.id === billId);

  if (!bill) {
    return;
  }

  const newNameInput = window.prompt("Bill name:", bill.name);

  if (newNameInput === null) {
    return;
  }

  const trimmedName = newNameInput.trim();

  if (!trimmedName) {
    window.alert("Bill name cannot be empty.");
    return;
  }

  const newAmountInput = window.prompt(
    "Monthly amount:",
    String(bill.amount)
  );

  if (newAmountInput === null) {
    return;
  }

  const newAmount = Number(newAmountInput);

  if (!Number.isFinite(newAmount) || newAmount < 0) {
    window.alert("Enter a valid amount.");
    return;
  }

  const newDueDateInput = window.prompt(
    "Due date (day of month, 1-31):",
    String(bill.dueDate)
  );

  if (newDueDateInput === null) {
    return;
  }

  const newDueDate = Number(newDueDateInput);

  if (!Number.isFinite(newDueDate) || newDueDate < 1 || newDueDate > 31) {
    window.alert("Enter a valid day of month between 1 and 31.");
    return;
  }

  bill.name = trimmedName;
  bill.amount = Number(newAmount.toFixed(2));
  bill.dueDate = Math.round(newDueDate);

  saveAppData();
  refreshApp();
}

function deleteBill(billId) {
  const bill = appData.bills.find((item) => item.id === billId);

  if (!bill) {
    return;
  }

  const confirmed = window.confirm(`Delete the "${bill.name}" bill?`);

  if (!confirmed) {
    return;
  }

  appData.bills = appData.bills.filter((item) => item.id !== billId);

  saveAppData();
  refreshApp();
}

function buildCategorySpendingSnapshot() {
  return appData.categories.map((category) => ({
    name: category.name,
    budget: category.budget,
    moneyAddedThisMonth: category.moneyAddedThisMonth || 0,
    spent: getCategorySpent(category.name)
  }));
}

function createMonthlySnapshot() {
  const now = new Date();
  const label = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const savingsCategory = appData.categories.find(
    (category) => category.name === "Savings"
  );

  const snapshot = {
    id: `snapshot-${Date.now()}`,
    label,
    monthlyIncome: appData.monthlyIncome,
    billsTotal: getBillsTotalForCurrentPeriod(),
    bills: appData.bills.map((bill) => ({ ...bill })),
    expenses: appData.expenses.map((expense) => ({ ...expense })),
    categorySpending: buildCategorySpendingSnapshot(),
    moneyLeft: getMoneyLeft(),
    debts: appData.debts.map((debt) => ({ ...debt })),
    savingsAmount: savingsCategory ? savingsCategory.budget : 0
  };

  appData.monthlyHistory.unshift(snapshot);
}

function createPayPeriodSnapshot() {
  const nextPayday = getNextPayday(new Date());
  const label = `Pay period ending ${nextPayday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })}`;

  const savingsCategory = appData.categories.find(
    (category) => category.name === "Savings"
  );

  const snapshot = {
    id: `payperiod-${Date.now()}`,
    label,
    paycheckIncome: appData.monthlyIncome,
    billsTotal: getBillsTotalForCurrentPeriod(),
    bills: appData.bills.map((bill) => ({ ...bill })),
    expenses: appData.expenses.map((expense) => ({ ...expense })),
    categorySpending: buildCategorySpendingSnapshot(),
    moneyLeft: getMoneyLeft(),
    debts: appData.debts.map((debt) => ({ ...debt })),
    savingsAmount: savingsCategory ? savingsCategory.budget : 0
  };

  appData.payPeriodHistory.unshift(snapshot);
}

function renderMonthlyHistory() {
  const container = document.getElementById("monthlyHistoryList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (appData.monthlyHistory.length === 0) {
    container.innerHTML = `<div class="empty-state">No monthly snapshots yet.</div>`;
    return;
  }

  appData.monthlyHistory.forEach((snapshot) => {
    const paidCount = snapshot.bills.filter((bill) => bill.paid).length;

    const row = document.createElement("div");
    row.className = "history-row month-snapshot-row";

    row.innerHTML = `
      <div class="history-details">
        <div class="row-name">${escapeText(snapshot.label)}</div>
        <div class="history-note">
          Income ${formatMoney(snapshot.monthlyIncome)} · Bills ${formatMoney(snapshot.billsTotal)} ·
          Money Left ${formatMoney(snapshot.moneyLeft)} · ${paidCount} of ${snapshot.bills.length} bills paid ·
          ${snapshot.expenses.length} expense(s) logged · Savings ${formatMoney(snapshot.savingsAmount)}
        </div>
      </div>
    `;

    container.appendChild(row);
  });
}

function renderPayPeriodHistory() {
  const container = document.getElementById("payPeriodHistoryList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (appData.payPeriodHistory.length === 0) {
    container.innerHTML = `<div class="empty-state">No completed pay periods yet.</div>`;
    return;
  }

  appData.payPeriodHistory.forEach((snapshot) => {
    const paidCount = snapshot.bills.filter((bill) => bill.paid).length;

    const row = document.createElement("div");
    row.className = "history-row month-snapshot-row";

    row.innerHTML = `
      <div class="history-details">
        <div class="row-name">${escapeText(snapshot.label)}</div>
        <div class="history-note">
          Paycheck ${formatMoney(snapshot.paycheckIncome)} · Bills ${formatMoney(snapshot.billsTotal)} ·
          Money Left ${formatMoney(snapshot.moneyLeft)} · ${paidCount} of ${snapshot.bills.length} bills paid ·
          ${snapshot.expenses.length} expense(s) logged · Savings ${formatMoney(snapshot.savingsAmount)}
        </div>
      </div>
    `;

    container.appendChild(row);
  });
}

function startNewPeriod() {
  const isMonthly = appData.settings.budgetMode === "monthly";

  const confirmed = window.confirm(
    isMonthly
      ? "Start a new month? This saves a snapshot of the current month, unchecks all bills, and clears this month's expenses."
      : "Start a new pay period? This saves the current pay period to history, unchecks all bills, and clears this period's expenses."
  );

  if (!confirmed) {
    return;
  }

  if (isMonthly) {
    createMonthlySnapshot();
  } else {
    createPayPeriodSnapshot();
  }

  appData.bills.forEach((bill) => {
    bill.paid = false;
  });

  appData.expenses = [];

  appData.categories.forEach((category) => {
    category.moneyAddedThisMonth = 0;
  });

  saveAppData();
  refreshApp();
}

function markDebtPaidOff(debtId) {
  const debt = appData.debts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  const confirmed = window.confirm(
    `Mark ${debt.name} as paid off? This moves it to your Paid-Off Debt History.`
  );

  if (!confirmed) {
    return;
  }

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);

  debt.balance = 0;
  debt.paidOff = true;
  debt.payoffDate = new Date().toISOString();

  if (matchingBill) {
    matchingBill.removed = true;
    matchingBill.paid = false;
  }

  appData.debts = appData.debts.filter((item) => item.id !== debtId);
  appData.archivedDebts.push(debt);

  saveAppData();
  refreshApp();
}

function applyDebtPayment(debtId) {
  const debt = appData.debts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  const paymentInput = document.querySelector(
    `.payment-to-apply-input[data-debt-id="${debtId}"]`
  );

  const paymentAmount = paymentInput
    ? Number(paymentInput.value)
    : Number(debt.minimumPayment);

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    window.alert("Enter a valid payment amount.");
    return;
  }

  const confirmed = window.confirm(
    `Apply your ${formatMoney(paymentAmount)} payment to ${debt.name}?`
  );

  if (!confirmed) {
    return;
  }

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);
  const newBalance = Number(debt.balance) - paymentAmount;

  if (newBalance <= 0) {
    debt.balance = 0;
    debt.paidOff = true;
    debt.payoffDate = new Date().toISOString();

    if (matchingBill) {
      matchingBill.removed = true;
      matchingBill.paid = false;
    }

    appData.debts = appData.debts.filter((item) => item.id !== debtId);
    appData.archivedDebts.push(debt);
  } else {
    debt.balance = Number(newBalance.toFixed(2));

    if (matchingBill) {
      matchingBill.paid = true;
    }
  }

  saveAppData();
  refreshApp();
}

function restoreDebt(debtId) {
  const debt = appData.archivedDebts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  debt.paidOff = false;
  debt.payoffDate = null;

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);

  if (matchingBill) {
    matchingBill.removed = false;
    matchingBill.amount = debt.minimumPayment;
  }

  appData.archivedDebts = appData.archivedDebts.filter(
    (item) => item.id !== debtId
  );

  appData.debts.push(debt);

  saveAppData();
  refreshApp();
}

function editDebt(debtId) {
  let debt = appData.debts.find((item) => item.id === debtId);
  let isArchived = false;

  if (!debt) {
    debt = appData.archivedDebts.find((item) => item.id === debtId);
    isArchived = true;
  }

  if (!debt) {
    return;
  }

  const newNameInput = window.prompt("Debt name:", debt.name);

  if (newNameInput === null) {
    return;
  }

  const trimmedName = newNameInput.trim();

  if (!trimmedName) {
    window.alert("Debt name cannot be empty.");
    return;
  }

  const newBalanceInput = window.prompt(
    "Current balance:",
    String(debt.balance)
  );

  if (newBalanceInput === null) {
    return;
  }

  const newBalance = Number(newBalanceInput);

  if (!Number.isFinite(newBalance) || newBalance < 0) {
    window.alert("Enter a valid balance.");
    return;
  }

  const newMinimumInput = window.prompt(
    "Required minimum payment:",
    String(debt.minimumPayment)
  );

  if (newMinimumInput === null) {
    return;
  }

  const newMinimum = Number(newMinimumInput);

  if (!Number.isFinite(newMinimum) || newMinimum < 0) {
    window.alert("Enter a valid minimum payment.");
    return;
  }

  debt.name = trimmedName;
  debt.balance = Number(newBalance.toFixed(2));
  debt.minimumPayment = Number(newMinimum.toFixed(2));

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);

  if (matchingBill) {
    matchingBill.name = trimmedName;

    if (!isArchived && !matchingBill.removed) {
      matchingBill.amount = debt.minimumPayment;
    }
  }

  saveAppData();
  refreshApp();
}

function deleteDebt(debtId) {
  const debt =
    appData.debts.find((item) => item.id === debtId) ||
    appData.archivedDebts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  const confirmed = window.confirm(
    `Delete the "${debt.name}" debt? This cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  appData.debts = appData.debts.filter((item) => item.id !== debtId);
  appData.archivedDebts = appData.archivedDebts.filter(
    (item) => item.id !== debtId
  );
  appData.bills = appData.bills.filter((bill) => bill.id !== debtId);

  saveAppData();
  refreshApp();
}

function renderDebts() {
  const debtList = document.getElementById("debtList");
  const archivedDebtList = document.getElementById("archivedDebtList");

  if (debtList) {
    debtList.innerHTML = "";

    if (appData.debts.length === 0) {
      debtList.innerHTML = `<div class="empty-state">No active debts.</div>`;
    }

    appData.debts.forEach((debt) => {
      const debtRow = document.createElement("div");
      debtRow.className = "debt-row";

      debtRow.innerHTML = `
        <div class="row-top">
          <div>
            <div class="row-name">${escapeText(debt.name)}</div>
          </div>
        </div>

        <div class="debt-fields">
          <div class="debt-stat">
            <span class="debt-stat-label">Current Balance</span>
            <span class="debt-stat-value">${formatMoney(debt.balance)}</span>
          </div>

          <div class="debt-stat">
            <span class="debt-stat-label">Required Minimum Payment</span>
            <span class="debt-stat-value">${formatMoney(debt.minimumPayment)}</span>
          </div>
        </div>

        <label class="debt-field-label">
          Payment To Apply
          <input
            type="number"
            step="0.01"
            min="0"
            class="payment-to-apply-input"
            data-debt-id="${debt.id}"
            value="${debt.minimumPayment}"
          >
        </label>

        <div class="debt-actions two-col">
          <button type="button" class="small-button secondary-button edit-debt-button" data-debt-id="${debt.id}">Edit</button>
          <button type="button" class="small-button primary-button apply-payment-button" data-debt-id="${debt.id}">Apply Payment</button>
        </div>
        <div class="debt-actions two-col">
          <button type="button" class="small-button secondary-button mark-paid-off-button" data-debt-id="${debt.id}">Mark Paid Off</button>
          <button type="button" class="small-button danger-button delete-debt-button" data-debt-id="${debt.id}">Delete</button>
        </div>
      `;

      debtList.appendChild(debtRow);
    });
  }

  if (archivedDebtList) {
    archivedDebtList.innerHTML = "";

    if (appData.archivedDebts.length === 0) {
      archivedDebtList.innerHTML = `<div class="empty-state">No paid-off debts yet.</div>`;
    }

    appData.archivedDebts.forEach((debt) => {
      const payoffDate = debt.payoffDate
        ? new Date(debt.payoffDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        : "Unknown date";

      const debtRow = document.createElement("div");
      debtRow.className = "debt-row paid-off";

      debtRow.innerHTML = `
        <div class="row-top">
          <div>
            <div class="row-name">${escapeText(debt.name)}</div>
            <div class="row-subtitle">
              Paid off ${payoffDate} · Minimum was ${formatMoney(debt.minimumPayment)}
            </div>
          </div>
        </div>

        <div class="debt-actions">
          <button type="button" class="small-button secondary-button edit-debt-button" data-debt-id="${debt.id}">Edit</button>
          <button type="button" class="small-button restore-debt-button" data-debt-id="${debt.id}">Restore Debt</button>
          <button type="button" class="small-button danger-button delete-debt-button" data-debt-id="${debt.id}">Delete</button>
        </div>
      `;

      archivedDebtList.appendChild(debtRow);
    });
  }

  document.querySelectorAll(".apply-payment-button").forEach((button) => {
    button.addEventListener("click", () => {
      applyDebtPayment(button.dataset.debtId);
    });
  });

  document.querySelectorAll(".mark-paid-off-button").forEach((button) => {
    button.addEventListener("click", () => {
      markDebtPaidOff(button.dataset.debtId);
    });
  });

  document.querySelectorAll(".restore-debt-button").forEach((button) => {
    button.addEventListener("click", () => {
      restoreDebt(button.dataset.debtId);
    });
  });

  document.querySelectorAll(".edit-debt-button").forEach((button) => {
    button.addEventListener("click", () => {
      editDebt(button.dataset.debtId);
    });
  });

  document.querySelectorAll(".delete-debt-button").forEach((button) => {
    button.addEventListener("click", () => {
      deleteDebt(button.dataset.debtId);
    });
  });
}

function showDebtMessage(message, isError = false) {
  const messageElement = document.getElementById("debtMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.style.color = isError ? "#c62828" : "#2e7d32";

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 2500);
}

function addDebt() {
  const nameInput = document.getElementById("debtName");
  const balanceInput = document.getElementById("debtBalance");
  const minimumPaymentInput = document.getElementById("debtMinimumPayment");

  if (!nameInput || !balanceInput || !minimumPaymentInput) {
    return;
  }

  const name = nameInput.value.trim();
  const balance = Number(balanceInput.value);
  const minimumPayment = Number(minimumPaymentInput.value);

  if (!name) {
    showDebtMessage("Enter a debt name.", true);
    nameInput.focus();
    return;
  }

  if (!Number.isFinite(balance) || balance < 0) {
    showDebtMessage("Enter a valid starting balance.", true);
    balanceInput.focus();
    return;
  }

  if (!Number.isFinite(minimumPayment) || minimumPayment < 0) {
    showDebtMessage("Enter a valid minimum payment.", true);
    minimumPaymentInput.focus();
    return;
  }

  const debtId = `debt-${Date.now()}`;

  const newDebt = {
    id: debtId,
    name,
    balance: Number(balance.toFixed(2)),
    minimumPayment: Number(minimumPayment.toFixed(2)),
    paidOff: false,
    payoffDate: null
  };

  const newBill = {
    id: debtId,
    name,
    amount: newDebt.minimumPayment,
    paid: false,
    removed: false,
    dueDate: 1
  };

  appData.debts.push(newDebt);
  appData.bills.push(newBill);

  saveAppData();
  refreshApp();

  nameInput.value = "";
  balanceInput.value = "";
  minimumPaymentInput.value = "";

  showDebtMessage("Debt added.");
  nameInput.focus();
}

function showBillMessage(message, isError = false) {
  const messageElement = document.getElementById("billMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.style.color = isError ? "#c62828" : "#2e7d32";

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 2500);
}

function addBill() {
  const nameInput = document.getElementById("billName");
  const amountInput = document.getElementById("billAmount");
  const dueDateInput = document.getElementById("billDueDate");

  if (!nameInput || !amountInput) {
    return;
  }

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const dueDate = dueDateInput ? Number(dueDateInput.value) : 1;

  if (!name) {
    showBillMessage("Enter a bill name.", true);
    nameInput.focus();
    return;
  }

  if (!Number.isFinite(amount) || amount < 0) {
    showBillMessage("Enter a valid bill amount.", true);
    amountInput.focus();
    return;
  }

  if (!Number.isFinite(dueDate) || dueDate < 1 || dueDate > 31) {
    showBillMessage("Enter a valid due date (1-31).", true);
    if (dueDateInput) {
      dueDateInput.focus();
    }
    return;
  }

  const newBill = {
    id: `bill-${Date.now()}`,
    name,
    amount: Number(amount.toFixed(2)),
    paid: false,
    removed: false,
    dueDate: Math.round(dueDate)
  };

  appData.bills.push(newBill);

  saveAppData();
  refreshApp();

  nameInput.value = "";
  amountInput.value = "";

  if (dueDateInput) {
    dueDateInput.value = "";
  }

  showBillMessage("Bill added.");
  nameInput.focus();
}

function showCategoryMessage(message, isError = false) {
  const messageElement = document.getElementById("categoryMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.style.color = isError ? "#c62828" : "#2e7d32";

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 2500);
}

function addCategory() {
  const nameInput = document.getElementById("categoryName");
  const budgetInput = document.getElementById("categoryBudget");

  if (!nameInput || !budgetInput) {
    return;
  }

  const name = nameInput.value.trim();
  const budget = Number(budgetInput.value);

  if (!name) {
    showCategoryMessage("Enter a category name.", true);
    nameInput.focus();
    return;
  }

  const alreadyExists = appData.categories.some(
    (category) => category.name.toLowerCase() === name.toLowerCase()
  );

  if (alreadyExists) {
    showCategoryMessage("That category already exists.", true);
    nameInput.focus();
    return;
  }

  if (!Number.isFinite(budget) || budget < 0) {
    showCategoryMessage("Enter a valid budget amount.", true);
    budgetInput.focus();
    return;
  }

  appData.categories.push({
    name,
    budget: Number(budget.toFixed(2)),
    moneyAddedThisMonth: 0
  });

  saveAppData();
  refreshApp();

  nameInput.value = "";
  budgetInput.value = "";

  showCategoryMessage("Category added.");
  nameInput.focus();
}

function syncExpenseCategoryOptions() {
  const categorySelect = document.getElementById("expenseCategory");

  if (!categorySelect) {
    return;
  }

  const previousValue = categorySelect.value;

  categorySelect.innerHTML = "";

  appData.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const stillExists = appData.categories.some(
    (category) => category.name === previousValue
  );

  if (stillExists) {
    categorySelect.value = previousValue;
  }
}

function showBackupMessage(message, isError = false) {
  const messageElement = document.getElementById("backupMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.style.color = isError ? "#c62828" : "#2e7d32";

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 4000);
}

function exportBackup() {
  try {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const filename = `lees-budget-backup-${yyyy}-${mm}-${dd}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    showBackupMessage("Backup exported.");
  } catch (error) {
    console.error("Export failed:", error);
    showBackupMessage("Export failed. Please try again.", true);
  }
}

function isValidBackupStructure(data) {
  return (
    data &&
    typeof data === "object" &&
    typeof data.monthlyIncome !== "undefined" &&
    Array.isArray(data.categories) &&
    Array.isArray(data.bills) &&
    Array.isArray(data.debts) &&
    Array.isArray(data.expenses)
  );
}

function handleImportFile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);

      if (!isValidBackupStructure(parsed)) {
        showBackupMessage("That file doesn't look like a valid backup.", true);
        return;
      }

      const confirmed = window.confirm(
        "Import this backup? This will replace all current data."
      );

      if (!confirmed) {
        return;
      }

      const defaults = copyStartingData();

      appData = {
        ...defaults,
        ...parsed,
        categories: normalizeCategories(parsed.categories || defaults.categories),
        bills: normalizeBills(parsed.bills || defaults.bills),
        debts: normalizeDebts(parsed.debts || defaults.debts),
        archivedDebts: normalizeDebts(parsed.archivedDebts || []),
        expenses: parsed.expenses || [],
        monthlyHistory: parsed.monthlyHistory || [],
        payPeriodHistory: parsed.payPeriodHistory || [],
        settings: normalizeSettings(parsed.settings)
      };

      saveAppData();
      refreshApp();

      showBackupMessage("Backup imported successfully.");
    } catch (error) {
      console.error("Import failed:", error);
      showBackupMessage("That file could not be read. No changes were made.", true);
    }
  };

  reader.onerror = () => {
    showBackupMessage("That file could not be read. No changes were made.", true);
  };

  reader.readAsText(file);
}

function refreshApp() {
  applySettings();
  displayCurrentMonth();
  updatePayPeriodInfo();
  updateDashboardLabels();
  updateResetButtonLabel();
  updateDashboard();
  syncExpenseCategoryOptions();
  renderCategories();
  renderExpenseHistory();
  renderBills();
  renderDebts();
  renderMonthlyHistory();
  renderPayPeriodHistory();
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupHistorySubTabs();

  const addExpenseButton = document.getElementById("addExpenseButton");
  const amountInput = document.getElementById("expenseAmount");
  const clearHistoryButton = document.getElementById("clearHistoryButton");
  const resetBillsButton = document.getElementById("resetBillsButton");
  const addDebtButton = document.getElementById("addDebtButton");
  const addBillButton = document.getElementById("addBillButton");
  const addCategoryButton = document.getElementById("addCategoryButton");
  const exportBackupButton = document.getElementById("exportBackupButton");
  const importBackupInput = document.getElementById("importBackupInput");
  const editIncomeButton = document.getElementById("editIncomeButton");
  const saveSettingsButton = document.getElementById("saveSettingsButton");

  if (addExpenseButton) {
    addExpenseButton.addEventListener("click", addExpense);
  }

  if (amountInput) {
    amountInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addExpense();
      }
    });
  }

  if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", clearExpenseHistory);
  }

  if (resetBillsButton) {
    resetBillsButton.addEventListener("click", startNewPeriod);
  }

  if (addDebtButton) {
    addDebtButton.addEventListener("click", addDebt);
  }

  if (addBillButton) {
    addBillButton.addEventListener("click", addBill);
  }

  if (addCategoryButton) {
    addCategoryButton.addEventListener("click", addCategory);
  }

  if (exportBackupButton) {
    exportBackupButton.addEventListener("click", exportBackup);
  }

  if (importBackupInput) {
    importBackupInput.addEventListener("change", () => {
      const file = importBackupInput.files && importBackupInput.files[0];
      handleImportFile(file);
      importBackupInput.value = "";
    });
  }

  if (editIncomeButton) {
    editIncomeButton.addEventListener("click", editIncome);
  }

  if (saveSettingsButton) {
    saveSettingsButton.addEventListener("click", saveSettings);
  }

  const appNameInput = document.getElementById("appNameInput");
  const appEmojiInput = document.getElementById("appEmojiInput");
  const paydayInput = document.getElementById("paydayInput");
  const payFrequencySelect = document.getElementById("payFrequencySelect");
  const budgetModeSelect = document.getElementById("budgetModeSelect");

  if (appNameInput) {
    appNameInput.value = appData.settings.appName;
  }

  if (appEmojiInput) {
    appEmojiInput.value = appData.settings.appEmoji;
  }

  if (paydayInput) {
    paydayInput.value = appData.settings.payday;
  }

  if (payFrequencySelect) {
    payFrequencySelect.value = String(appData.settings.payFrequencyDays);
  }

  if (budgetModeSelect) {
    budgetModeSelect.value = appData.settings.budgetMode;
  }

  refreshApp();
  saveAppData();
});
