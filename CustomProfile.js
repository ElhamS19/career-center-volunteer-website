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
    setTimeout(() => {
        window.location.href = "SUCCESSpage.html";
    }, 2500);
}

function logout() {
    showNotification("Successfully logged out");
    setTimeout(() => {
        window.location.href = "LOGOUTpage.html";
    }, 2500);
}

window.saveChanges = saveChanges;
window.logout = logout;
