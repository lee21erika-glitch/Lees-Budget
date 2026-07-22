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
return;
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
  if (!bill) {
    return;
  }

  bill.paid = checkbox.checked;

  saveAppData();
  renderBills();
});
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
        : `<button type="button" class="small-button danger-button paid-off-debt-button" data-debt-id="${debt.id}">Mark Paid Off</button>`
    }
  </div>
`;

debtList.appendChild(debtRow);
