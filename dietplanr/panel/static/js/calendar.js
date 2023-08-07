const appointments = document.querySelectorAll("[data-appointment]");
const dialog = document.querySelector("[data-dialog]");
const dialogContent = document.querySelectorAll("[data-dialog-content]");
appointments.forEach(appointment => {
    appointment.addEventListener("click", e => {
        dialogContent.forEach(element =>{
            if(element.dataset.value === e.target.dataset.value) {
                element.classList.remove("d-none");
            }
            else element.classList.add("d-none");
        })
        dialog.showModal();
    })
})