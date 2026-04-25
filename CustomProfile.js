function showNotification(message) {
    const notif = document.getElementById("notification");
    notif.innerText = message;
    notif.style.display = "block";

    setTimeout(() => {
        notif.style.display = "none";
    }, 2500);
}

function saveChanges() {
    const nameTop = document.getElementById("displayName").value;
    const nameField = document.getElementById("fullName");

    // Sync both name fields
    nameField.value = nameTop;

    showNotification("Changes have been saved");
}

function logout() {
    showNotification("Successfully logged out");
}

function saveChanges() {
    // (Optional: store data here if needed)
    window.location.href = "success.html";
}

function logout() {
    window.location.href = "logout.html";
}