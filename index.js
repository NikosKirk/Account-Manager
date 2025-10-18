const accounts = [];
const emails = [];

class Account {
    constructor(id, name, password, email) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    displayAccounts() {
        return `--- Account: ${this.id + 1} ---
ID: ${this.id}
Name: ${this.name}
Password: ${this.password}
Email: ${this.email}`;
    }
}

// Load accounts from localStorage on page load
function loadAccounts() {
    const saved = JSON.parse(localStorage.getItem("accounts")) || [];
    saved.forEach(accData => {
        const acc = new Account(accData.id, accData.name, accData.password, accData.email);
        accounts.push(acc);
        emails.push(acc.email);
    });
}

// Refresh accounts display
function refreshAccountsDisplay() {
    const container = document.getElementById("accountsContainer");
    const checkbox = document.getElementById("showAccountsCheckbox");
    const saveBtn = document.getElementById("saveAccountsBtn");

    container.innerHTML = "";

    if (!checkbox.checked) {
        saveBtn.style.display = "none";
        return;
    }

    saveBtn.style.display = "inline-block";

    if (accounts.length === 0) {
        container.textContent = "No accounts yet!";
        saveBtn.style.display = "none";
        return;
    }

    accounts.forEach((acc, index) => {
        const div = document.createElement("div");

        const info = document.createElement("span");
        info.textContent = acc.displayAccounts();
        div.appendChild(info);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "deleteBtn";

        deleteBtn.addEventListener("click", () => {
            accounts.splice(index, 1);
            const emailIndex = emails.indexOf(acc.email);
            if (emailIndex !== -1) emails.splice(emailIndex, 1);
            localStorage.setItem("accounts", JSON.stringify(accounts));
            refreshAccountsDisplay();
        });

        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

// Submit function
function Submit() {
    const name = document.getElementById("accountName").value.trim();
    const password = document.getElementById("accountPassword").value.trim();
    const confirmPassword = document.getElementById("accountConfirmPassword").value.trim();
    const email = document.getElementById("accountEmail").value.trim();
    const emailError = document.getElementById("emailError");

    if (!name || !password || !confirmPassword || !email) {
        emailError.textContent = "All fields are required!";
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const parts = email.split("@");
    if (
        parts.length !== 2 ||
        parts[0].length === 0 ||
        parts[1].length <= 3 ||
        parts[1].startsWith(".") ||
        !parts[1].includes(".")
    ) {
        emailError.textContent = "Please enter a valid email (like name@domain.asdn)";
        return;
    }

    if (emails.includes(email)) {
        emailError.textContent = `The email ${email} is already used!`;
        return;
    }

    emails.push(email);
    const id = accounts.length;
    const newAccount = new Account(id, name, password, email);
    accounts.push(newAccount);

    document.getElementById("accountName").value = "";
    document.getElementById("accountPassword").value = "";
    document.getElementById("accountConfirmPassword").value = "";
    document.getElementById("accountEmail").value = "";
    emailError.textContent = "";

    refreshAccountsDisplay();
}

// Checkbox listener
document.getElementById("showAccountsCheckbox").addEventListener("change", refreshAccountsDisplay);

// Save button listener
document.getElementById("saveAccountsBtn").addEventListener("click", () => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
    alert("Accounts saved to local storage!");
});

// Load accounts on page load
window.addEventListener("load", () => {
    loadAccounts();
    refreshAccountsDisplay();
});
