"use strict";

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
    { id: "rent", name: "Rent", amount: 560, paid: false, removed: false },
    { id: "car", name: "Car Payment", amount: 560, paid: false, removed: false },
    { id: "klarna", name: "Klarna", amount: 308, paid: false, removed: false },
    { id: "tmobile", name: "T-Mobile", amount: 272, paid: false, removed: false },
    { id: "statefarm", name: "State Farm Insurance", amount: 171, paid: false, removed: false },
    { id: "signature", name: "Signature Loan", amount: 170, paid: false, removed: false },
    { id: "gasheat", name: "Gas / Heat", amount: 165, paid: false, removed: false },
    { id: "kamari", name: "Kamari Health Insurance", amount: 100, paid: false, removed: false },
    { id: "electric", name: "Electric", amount: 70, paid: false, removed: false },
    { id: "affirm", name: "Affirm", amount: 68, paid: false, removed: false },
    { id: "merrick", name: "Merrick", amount: 50, paid: false, removed: false },
    { id: "afterpay", name: "Afterpay", amount: 49, paid: false, removed: false },
    { id: "biglots", name: "Big Lots", amount: 37, paid: false, removed: false },
    { id: "capitalone", name: "Capital One", amount: 25, paid: false, removed: false },
    { id: "mastercard", name: "Mastercard", amount: 20, paid: false, removed: false },
    { id: "carecredit", name: "CareCredit", amount: 20, paid: false, removed: false }
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

  expenses: []
};

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
    const defaults = copyStartingData();

    return {
      ...defaults,
      ...parsedData,
      categories: parsedData.categories || defaults.categories,
      bills: parsedData.bills || defaults.bills,
      debts: parsedData.debts || defaults.debts,
      expenses: parsedData.expenses || []
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

  if (monthlyIncomeElement) {
    monthlyIncomeElement.textContent = formatMoney(appData.monthlyIncome);
  }

  if (monthlyBillsElement) {
    monthlyBillsElement.textContent = formatMoney(getMonthlyBillsTotal());
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

    const categoryRow = document.createElement("div");
    categoryRow.className = "category-row";

    categoryRow.innerHTML = `
      <div class="row-top">
        <div>
          <div class="row-name">${escapeText(category.name)}</div>
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

function renderBills() {
  const billList = document.getElementById("billList");
  const paidCount = document.getElementById("billsPaidCount");

  if (!billList) {
    return;
  }

  billList.innerHTML = "";

  const activeBills = appData.bills.filter((bill) => !bill.removed);
  const paidBills = activeBills.filter((bill) => bill.paid).length;

  if (paidCount) {
    paidCount.textContent = `${paidBills} of ${activeBills.length} paid`;
  }

  activeBills.forEach((bill) => {
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
              ${bill.paid ? "Paid" : "Not paid yet"}
            </span>
          </span>
        </label>

        <div class="amount">
          ${formatMoney(bill.amount)}
        </div>
      </div>
    `;

    billList.appendChild(billRow);
  });

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
      renderBills();
    });
  });
}

function resetBillsForNewMonth() {
  const confirmed = window.confirm("Uncheck every bill for a new month?");

  if (!confirmed) {
    return;
  }

  appData.bills.forEach((bill) => {
    bill.paid = false;
  });

  saveAppData();
  refreshApp();
}

function applyDebtPayment(debtId) {
  const debt = appData.debts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  const confirmed = window.confirm(
    `Apply your ${formatMoney(debt.minimumPayment)} payment to ${debt.name}?`
  );

  if (!confirmed) {
    return;
  }

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);
  const newBalance = Number(debt.balance) - Number(debt.minimumPayment);

  if (newBalance <= 0) {
    debt.balance = 0;
    debt.paidOff = true;

    if (matchingBill) {
      matchingBill.removed = true;
      matchingBill.paid = false;
    }
  } else {
    debt.balance = newBalance;

    if (matchingBill) {
      matchingBill.paid = true;
    }
  }

  saveAppData();
  refreshApp();
}

function restoreDebt(debtId) {
  const debt = appData.debts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  debt.paidOff = false;

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);

  if (matchingBill) {
    matchingBill.removed = false;
    matchingBill.amount = debt.minimumPayment;
  }

  saveAppData();
  refreshApp();
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
    paidOff: false
  };

  const newBill = {
    id: debtId,
    name,
    amount: newDebt.minimumPayment,
    paid: false,
    removed: false
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

function updateDebtBalance(debtId, newBalance) {
  const debt = appData.debts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  const parsedBalance = Number(newBalance);

  debt.balance = Number.isFinite(parsedBalance) && parsedBalance >= 0
    ? parsedBalance
    : 0;

  saveAppData();
}

function updateDebtMinimumPayment(debtId, newMinimumPayment) {
  const debt = appData.debts.find((item) => item.id === debtId);

  if (!debt) {
    return;
  }

  const parsedPayment = Number(newMinimumPayment);

  debt.minimumPayment = Number.isFinite(parsedPayment) && parsedPayment >= 0
    ? parsedPayment
    : 0;

  const matchingBill = appData.bills.find((bill) => bill.id === debtId);

  if (matchingBill && !matchingBill.removed) {
    matchingBill.amount = debt.minimumPayment;
  }

  saveAppData();
  refreshApp();
}

function renderDebts() {
  const debtList = document.getElementById("debtList");

  if (!debtList) {
    return;
  }

  debtList.innerHTML = "";

  appData.debts.forEach((debt) => {
    const debtRow = document.createElement("div");
    debtRow.className = `debt-row ${debt.paidOff ? "debt-paid-off" : ""}`;

    debtRow.innerHTML = `
      <div class="row-top">
        <div>
          <div class="row-name">${escapeText(debt.name)}</div>
          <div class="row-subtitle">
            ${debt.paidOff ? "Paid off" : `Minimum payment ${formatMoney(debt.minimumPayment)}`}
          </div>
        </div>
      </div>

      <div class="debt-fields">
        <label class="debt-field-label">
          Balance
          <input
            type="number"
            step="0.01"
            min="0"
            class="debt-balance-input"
            data-debt-id="${debt.id}"
            value="${debt.balance}"
            ${debt.paidOff ? "disabled" : ""}
          >
        </label>

        <label class="debt-field-label">
          Minimum Payment
          <input
            type="number"
            step="0.01"
            min="0"
            class="debt-minimum-input"
            data-debt-id="${debt.id}"
            value="${debt.minimumPayment}"
            ${debt.paidOff ? "disabled" : ""}
          >
        </label>
      </div>

      <div class="debt-actions">
        ${
          debt.paidOff
            ? `<button type="button" class="small-button restore-debt-button" data-debt-id="${debt.id}">Restore Debt</button>`
            : `<button type="button" class="small-button primary-button apply-payment-button" data-debt-id="${debt.id}">Apply Payment</button>`
        }
      </div>
    `;

    debtList.appendChild(debtRow);
  });

  document.querySelectorAll(".debt-balance-input").forEach((input) => {
    input.addEventListener("change", () => {
      updateDebtBalance(input.dataset.debtId, input.value);
    });
  });

  document.querySelectorAll(".debt-minimum-input").forEach((input) => {
    input.addEventListener("change", () => {
      updateDebtMinimumPayment(input.dataset.debtId, input.value);
    });
  });

  document.querySelectorAll(".apply-payment-button").forEach((button) => {
    button.addEventListener("click", () => {
      applyDebtPayment(button.dataset.debtId);
    });
  });

  document.querySelectorAll(".restore-debt-button").forEach((button) => {
    button.addEventListener("click", () => {
      restoreDebt(button.dataset.debtId);
    });
  });
}

function refreshApp() {
  displayCurrentMonth();
  updateDashboard();
  renderCategories();
  renderExpenseHistory();
  renderBills();
  renderDebts();
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();

  const addExpenseButton = document.getElementById("addExpenseButton");
  const amountInput = document.getElementById("expenseAmount");
  const clearHistoryButton = document.getElementById("clearHistoryButton");
  const resetBillsButton = document.getElementById("resetBillsButton");
  const addDebtButton = document.getElementById("addDebtButton");

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
    resetBillsButton.addEventListener("click", resetBillsForNewMonth);
  }

  if (addDebtButton) {
    addDebtButton.addEventListener("click", addDebt);
  }

  refreshApp();
  saveAppData();
});
