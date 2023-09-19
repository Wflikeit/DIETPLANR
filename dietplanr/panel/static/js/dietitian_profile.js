const cardButtons = document.querySelectorAll("[data-appointment-card-btn]");
const appointmentDialog = document.getElementById("appointment-dialog");
const submitButton = document.getElementsByClassName("appointment-btn")[2]
const formFields = Array.from(document.querySelectorAll('[data-form]'))
console.log(formFields)
cardButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        var cardData = {event_duration: document.querySelector('[data-card]').textContent}
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

document.body.addEventListener("click", (event) => {
    if (event.target === appointmentDialog) {
        closeModal();
    }
});
submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    const data = {
        date: "2023-09-06 22:00:00.000",
        event_duration: '0:30:00',
        title: "Consultation",
        dietitian_profile_id:"ced270ee1f3d4f9a93c0836736e81c7b"
    }
    formFields.forEach(input => {
        data[input.id] = input.value
    })
    console.log(data)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    };
    options.body = JSON.stringify(data);

    fetch("http://127.0.0.1:8000/api/create-appointment/", options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

});

