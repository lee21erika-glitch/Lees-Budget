function addExpense() {

    let amount = Number(document.getElementById("amount").value);

    if (amount <= 0 || isNaN(amount)) {
        alert("Enter an amount.");
        return;
    }

    let money = document.getElementById("moneyLeft");

    let current = Number(
        money.innerText.replace("$","")
    );

    current -= amount;

    money.innerText = "$" + current.toFixed(2);

    document.getElementById("amount").value = "";

    alert("Expense added!");

}