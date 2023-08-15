console.log("Sanity check from calendar.js.");


const appointments = document.querySelectorAll("[data-appointment]");
const dialog = document.querySelector("[data-dialog]");
const dialogContent = document.querySelectorAll("[data-dialog-content]");
appointments.forEach(appointment => {
    appointment.addEventListener("click", e => {
        dialogContent.forEach(element => {
            if (element.dataset.value === e.target.dataset.value) {
                element.classList.remove("d-none");
            } else element.classList.add("d-none");
        })
        dialog.showModal();
    })
})


const calendar = document.querySelector('.calendar'); // Tutaj należy uzupełnić odpowiedni selektor dla elementu, w którym wyświetlasz kalendarz
const originalCalendarContent = calendar.innerHTML;

// Pobieranie referencji do divów
const buttonContainer = document.getElementById("button-container");
const monthButton = document.getElementById("month-button");
const yearButton = document.getElementById("year-button");
const tenYearsButton = document.getElementById("ten-years-button");

// Ustawienie początkowych stylów
monthButton.style.display = "block";
yearButton.style.display = "none";

// Funkcja do zmiany widoczności divów
function toggleButtons() {
    if (monthButton.style.display === "block") {
        monthButton.style.display = "none";
        yearButton.style.display = "block";
        tenYearsButton.style.display = "none";
    } else if (yearButton.style.display === "block") {
        yearButton.style.display = "none";
        tenYearsButton.style.display = "block";
    } else {
        monthButton.style.display = "block";
        yearButton.style.display = "none";
        tenYearsButton.style.display = "none";
    }
}

// Dodawanie obsługi kliknięcia w kontenerze przycisków
buttonContainer.addEventListener("click", toggleButtons);
monthButton.addEventListener("click", function () {
    // var selectedMonth = monthSelect.value; // Pobierz wartość wybranego roku
    // console.log('Wybrany miesiac:', selectedMonth);
    // Tutaj możesz wykonać inne operacje na wybranym roku
    // if (selectedMonth === '1') {
    // Wyświetl listę miesięcy zamiast dni
    const monthsList = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    calendar.innerHTML = monthsList.map(month => `<div>${month}</div>`).join('');

    // }else {
    // Powrót do oryginalnej zawartości diva z dniami
});
tenYearsButton.addEventListener("click", function () {
    calendar.innerHTML = originalCalendarContent;

});
yearButton.addEventListener("click", function () {
    const yearsList = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031'];
    calendar.innerHTML = yearsList.map(year => `<div>${year}</div>`).join('');

});



