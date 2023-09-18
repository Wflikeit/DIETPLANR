const cardButtons = document.querySelectorAll("[data-appointment-card-btn]");
const appointmentForm = document.getElementById("appointment-form");
cardButtons.forEach(button => {
    button.addEventListener("click", () =>{
        appointmentForm.classList.remove("d-none");
    })
})