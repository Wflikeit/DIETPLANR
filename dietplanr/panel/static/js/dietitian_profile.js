const cardButtons = document.querySelectorAll("[data-appointment-card-btn]");
const appointmentDialog = document.getElementById("appointment-dialog");

cardButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        openModal();
    });
});

function closeModal() {
    appointmentDialog.classList.remove("modal");
    appointmentDialog.close();
}

function openModal() {
    appointmentDialog.classList.add("modal");
    appointmentDialog.showModal();
}

// Add a click event listener to the document body to close the dialog when clicking outside
document.body.addEventListener("click", (event) => {
    if (event.target === appointmentDialog) {
        closeModal();
    }
});
